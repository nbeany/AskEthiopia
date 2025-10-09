// Environment configuration
// Use VITE_API_URL from environment variables, fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Validate that we have a proper API URL in production
if (import.meta.env.PROD && API_BASE_URL.includes('localhost')) {
  console.warn('Warning: Using localhost API URL in production build');
}
