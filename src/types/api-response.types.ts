// src/types/api-response.types.ts

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success?: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Error response
 */
export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
}

/**
 * List response (handles multiple formats)
 */
export type ListResponse<T> = 
  | { success?: boolean; data: T[] }
  | { [key: string]: T[] }
  | T[];