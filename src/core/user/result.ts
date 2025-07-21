// src/core/user/result.ts
export type Result<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };

// Example usage of Result
export const isSuccess = <T, E>(result: Result<T, E>): result is { success: true; value: T } => result.success;
export const isError = <T, E>(result: Result<T, E>): result is { success: false; error: E } => !result.success;
