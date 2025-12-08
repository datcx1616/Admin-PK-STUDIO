// src/types/common.types.ts

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Async data state
 */
export interface AsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Form state
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

/**
 * Select option (for dropdowns)
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/**
 * Date range
 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Sort config
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter config
 */
export interface FilterConfig {
  [key: string]: string | number | boolean | undefined;
}