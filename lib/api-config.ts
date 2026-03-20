import { Platform } from 'react-native';

/**
 * API Base URL Configuration
 * Automatically detects the environment and returns the correct API base URL
 */

export const getAPIBaseURL = (): string => {
  // On web, use relative URLs (they'll use the same origin)
  if (Platform.OS === 'web') {
    return '';
  }

  // On native (iOS/Android), use the full URL with port 3000
  // This assumes the backend is running on port 3000
  // In development, this would be localhost:3000
  // In production, this should be your actual server domain
  
  // For development with Expo, use the exposed server URL
  // You can set this via environment variables or detect from package.json
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // In production, use your actual server domain
    return 'https://your-server-domain.com';
  }

  // In development, use localhost:3000
  // This works when running on the same machine
  return 'http://localhost:3000';
};

/**
 * Fetch wrapper that automatically adds the API base URL
 */
export const apiFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const baseURL = getAPIBaseURL();
  const url = `${baseURL}${endpoint}`;
  
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
};
