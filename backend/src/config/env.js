const path = require('path');
const dotenv = require('dotenv');

let loaded = false;

function loadEnv() {
  if (loaded) return;
  const envPath = path.join(__dirname, '..', '..', '.env');
  dotenv.config({ path: envPath });
  loaded = true;
}

module.exports = { loadEnv };

