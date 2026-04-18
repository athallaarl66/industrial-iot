/**
 * Error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  originalError?: unknown;
}

/**
 * Parse API error response
 */
export function parseApiError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      originalError: error,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    return {
      message: (err.message as string) || 'An unexpected error occurred',
      code: (err.code as string) || 'UNKNOWN_ERROR',
      statusCode: (err.statusCode as number) || undefined,
      originalError: error,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    originalError: error,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: AppError): string {
  const errorMessages: Record<string, string> = {
    CONNECTION_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    NETWORK_ERROR: 'Network error. Please try again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  };

  return errorMessages[error.code || 'UNKNOWN_ERROR'] || error.message;
}

/**
 * Log error to console (in production, send to logging service)
 */
export function logError(error: AppError, context?: string) {
  const logMessage = context ? `[${context}] ${error.message}` : error.message;

  if (import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true') {
    console.error(logMessage, error.originalError);
  } else {
    console.error(logMessage);
  }
}
