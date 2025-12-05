// Utility function to get API base URL
// Handles both local and production environments
export const getApiUrl = () => {
  // NEW: Detect if running locally (development mode)
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '';
  
  // If running locally, always use localhost (ignore VITE_API_URL if it points to production)
  if (isLocalhost) {
    const localUrl = 'http://localhost:5000/api';
    console.log('[API] Running locally, using:', localUrl);
    return localUrl;
  }
  
  // For production, use VITE_API_URL or default to current origin
  const apiUrl = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  
  // If VITE_API_URL already includes /api, use it as is
  // Otherwise, append /api
  if (apiUrl.endsWith('/api')) {
    console.log('[API] Using configured URL:', apiUrl);
    return apiUrl;
  }
  
  // Remove trailing slash if present
  const cleanUrl = apiUrl.replace(/\/$/, '');
  const finalUrl = `${cleanUrl}/api`;
  console.log('[API] Using URL:', finalUrl);
  return finalUrl;
};

// Helper to build full API endpoint
export const buildApiEndpoint = (path) => {
  const baseUrl = getApiUrl();
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const endpoint = `${baseUrl}/${cleanPath}`;
  return endpoint;
};

