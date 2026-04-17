const mongoose = require('mongoose');
const dns = require('dns').promises;
const dnsSync = require('dns');
const url = require('url');
const net = require('net');

// Comprehensive DNS servers for maximum compatibility
const DNS_SERVERS = [
  '8.8.8.8',        // Google Public DNS
  '1.1.1.1',        // Cloudflare
  '208.67.222.222', // OpenDNS
  '8.8.4.4',        // Google Secondary
  '1.0.0.1',        // Cloudflare Secondary
  '208.67.220.220', // OpenDNS Secondary
];

// Set multiple DNS servers for maximum reliability
try {
  dnsSync.setServers(DNS_SERVERS);
  // eslint-disable-next-line no-console
  console.log('✅ Using enhanced DNS servers for MongoDB connection');
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('⚠️ Could not set custom DNS servers, using system defaults.');
}

// Retry utility with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      // eslint-disable-next-line no-console
      console.log(`⏳ Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Enhanced SRV to explicit URI conversion with IPv4/IPv6 support
async function buildExplicitMongoUri(srvUri) {
  try {
    const parsed = new url.URL(srvUri);
    const clusterHost = parsed.hostname;
    const dbName = parsed.pathname.replace(/^ ?\//, '') || 'admin';
    const searchParams = new URLSearchParams(parsed.searchParams);

    // Ensure required parameters
    if (!searchParams.has('authSource')) {
      searchParams.set('authSource', 'admin');
    }
    if (!searchParams.has('retryWrites')) {
      searchParams.set('retryWrites', 'true');
    }
    if (!searchParams.has('w')) {
      searchParams.set('w', 'majority');
    }

    // Get SRV records with retry
    const srvRecords = await retryWithBackoff(
      () => dns.resolveSrv(`_mongodb._tcp.${clusterHost}`),
      3,
      500
    );

    // Resolve hostnames to IPs for maximum compatibility
    const resolvedHosts = await Promise.all(
      srvRecords.map(async (rec) => {
        try {
          // Try IPv4 first
          const addresses = await dns.resolve4(rec.name);
          return addresses.map(ip => `${ip}:${rec.port}`);
        } catch (e) {
          try {
            // Fallback to IPv6
            const addresses = await dns.resolve6(rec.name);
            return addresses.map(ip => `[${ip}]:${rec.port}`);
          } catch (e2) {
            // Use hostname if resolution fails
            // eslint-disable-next-line no-console
            console.warn(`⚠️ Could not resolve ${rec.name}, using hostname`);
            return [`${rec.name}:${rec.port}`];
          }
        }
      })
    );

    const hosts = resolvedHosts.flat().join(',');
    const username = parsed.username ? decodeURIComponent(parsed.username) : '';
    const password = parsed.password ? decodeURIComponent(parsed.password) : '';
    const authPart = username ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : '';

    return `mongodb://${authPart}${hosts}/${dbName}?${searchParams.toString()}`;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Could not build explicit URI:', e.message);
    return null;
  }
}

// Test basic connectivity to MongoDB hosts
async function testHostConnectivity(host, port = 27017, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port, timeout });
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

// Enhanced connection attempt with pre-flight checks
async function tryConnect(uri, label, timeout = 10000) {
  try {
    // eslint-disable-next-line no-console
    console.log(`⏳ Attempting ${label}...`);

    // Pre-flight connectivity check for explicit URIs
    if (uri.startsWith('mongodb://') && !uri.includes('+srv')) {
      const parsed = new url.URL(uri);
      const hosts = parsed.hostname.split(',');
      const connectivityChecks = hosts.map(host => {
        const [hostname, port] = host.split(':');
        return testHostConnectivity(hostname.replace(/^\[|\]$/g, ''), parseInt(port) || 27017);
      });

      const results = await Promise.all(connectivityChecks);
      if (results.every(connected => !connected)) {
        throw new Error('No hosts are reachable');
      }
    }

    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 2000,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 15000,
    });

    // eslint-disable-next-line no-console
    console.log(`✅ Connected to ${label}`);
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`❌ ${label} failed:`, err.message);
    return false;
  }
}

async function connectDB() {
  const srvUri = process.env.MONGODB_URI;
  const explicitLocalUri = process.env.MONGO_URI;
  const defaultLocalUri = 'mongodb://127.0.0.1:27017/chic_db';

  // eslint-disable-next-line no-console
  console.log('⏳ Connecting to MongoDB (network-agnostic mode)...');

  // Attempt 1: Try SRV URI with enhanced DNS and retry (Atlas)
  if (srvUri) {
    const ok = await tryConnect(srvUri, 'MongoDB Atlas (SRV)', 8000);
    if (ok) return;

    // Attempt 2: Convert SRV to explicit URI with IP resolution (bypasses DNS restrictions)
    // eslint-disable-next-line no-console
    console.log('⏳ Falling back to explicit host URI with IP resolution...');
    const explicitUri = await buildExplicitMongoUri(srvUri);
    if (explicitUri) {
      const ok2 = await tryConnect(explicitUri, 'MongoDB Atlas (explicit hosts + IPs)', 8000);
      if (ok2) return;
    }
  }

  // Attempt 3: Try explicitly configured local MongoDB
  if (explicitLocalUri && explicitLocalUri !== srvUri) {
    const ok = await tryConnect(explicitLocalUri, 'Local MongoDB (configured)', 5000);
    if (ok) return;
  }

  // Attempt 4: Try default local MongoDB as last resort
  const ok = await tryConnect(defaultLocalUri, 'Local MongoDB (default)', 3000);
  if (ok) return;

  throw new Error('All MongoDB connection attempts failed. Check Atlas credentials and IP whitelist.');
}

module.exports = { connectDB };
 
