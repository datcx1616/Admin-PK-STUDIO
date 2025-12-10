// lib/api-utils.ts
/**
 * Utility functions for handling inconsistent API response formats
 */

/**
 * Extracts data array from various API response formats
 * Supports multiple backend response structures:
 * - { data: [...] }
 * - { data: { data: [...] } }
 * - { data: { items: [...] } }
 * - { data: { branches/teams/users/channels: [...] } }
 */
export function extractData<T>(response: unknown, dataKey?: string): T[] {
  if (!response || typeof response !== 'object') return [];

  const resp = response as Record<string, unknown>;

  // First, check if the specific key exists directly in response
  if (dataKey && resp[dataKey]) {
    return Array.isArray(resp[dataKey]) ? resp[dataKey] as T[] : [];
  }

  // Check common patterns directly in response
  if (Array.isArray(resp.data)) return resp.data as T[];
  if (Array.isArray(resp.items)) return resp.items as T[];
  if (Array.isArray(resp.branches)) return resp.branches as T[];
  if (Array.isArray(resp.teams)) return resp.teams as T[];
  if (Array.isArray(resp.users)) return resp.users as T[];
  if (Array.isArray(resp.channels)) return resp.channels as T[];

  // If response.data exists (nested structure)
  if (resp.data && typeof resp.data === 'object') {
    const data = resp.data as Record<string, unknown>;
    
    // Check for specific key if provided
    if (dataKey && data[dataKey]) {
      return Array.isArray(data[dataKey]) ? data[dataKey] as T[] : [];
    }

    // Check common patterns in nested data
    if (Array.isArray(data.data)) return data.data as T[];
    if (Array.isArray(data.items)) return data.items as T[];
    if (Array.isArray(data.branches)) return data.branches as T[];
    if (Array.isArray(data.teams)) return data.teams as T[];
    if (Array.isArray(data.users)) return data.users as T[];
    if (Array.isArray(data.channels)) return data.channels as T[];
  }

  // If response itself is an array
  if (Array.isArray(resp)) return resp as T[];

  return [];
}

/**
 * Extracts a single object from API response
 */
export function extractObject<T>(response: unknown, dataKey?: string): T | null {
  if (!response || typeof response !== 'object') return null;

  const resp = response as Record<string, unknown>;

  if (resp.data && typeof resp.data === 'object') {
    const data = resp.data as Record<string, unknown>;
    
    if (dataKey && data[dataKey]) {
      return data[dataKey] as T;
    }

    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      return data.data as T;
    }

    if (!Array.isArray(resp.data)) {
      return resp.data as T;
    }
  }

  if (!Array.isArray(resp)) {
    return resp as T;
  }

  return null;
}

/**
 * Safely format numbers with compact notation
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return "0";
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Safely format date strings
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return "N/A";
  }
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): string {
  if (!previous || previous === 0) return "+0%";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Format duration in seconds to readable format
 */
export function formatDuration(seconds: number | undefined | null): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
