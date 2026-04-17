const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
  : (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1');

export { API_BASE_URL };

