/**
 * Custom error classes and error handling
 */

export class DeepSeekError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'DeepSeekError';
  }
}

export class ApiKeyError extends DeepSeekError {
  constructor(message: string) {
    super(message, 'INVALID_API_KEY');
    this.name = 'ApiKeyError';
  }
}

export class NetworkError extends DeepSeekError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends DeepSeekError {
  constructor(timeoutMs: number) {
    super(`Request timeout after ${timeoutMs}ms`, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class RateLimitError extends DeepSeekError {
  constructor(public readonly retryAfter?: number) {
    super('Rate limit exceeded', 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

export class VisionProxyError extends DeepSeekError {
  constructor(message: string) {
    super(message, 'VISION_PROXY_ERROR');
    this.name = 'VisionProxyError';
  }
}

export class ConfigurationError extends DeepSeekError {
  constructor(message: string) {
    super(message, 'CONFIG_ERROR');
    this.name = 'ConfigurationError';
  }
}

export class ErrorHandler {
  static handle(error: unknown): string {
    if (error instanceof ApiKeyError) {
      return `API Key Error: ${error.message}. Please run "DeepSeek: Set API Key" command.`;
    }

    if (error instanceof NetworkError) {
      return `Network Error: ${error.message}. Check your internet connection.`;
    }

    if (error instanceof TimeoutError) {
      return `Request Timeout: ${error.message}. The server is taking too long to respond.`;
    }

    if (error instanceof RateLimitError) {
      return `Rate Limited: ${error.message}. Please wait a moment before trying again.`;
    }

    if (error instanceof VisionProxyError) {
      return `Vision Proxy Error: ${error.message}. Configure a vision proxy model.`;
    }

    if (error instanceof DeepSeekError) {
      return `DeepSeek Error: ${error.message}`;
    }

    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }

    return 'An unknown error occurred';
  }

  static parseApiError(status: number, response: any): DeepSeekError {
    const message = response?.error?.message || `API Error ${status}`;

    switch (status) {
      case 400:
        return new DeepSeekError(`Bad Request: ${message}`, 'BAD_REQUEST');
      case 401:
      case 403:
        return new ApiKeyError(message);
      case 429:
        return new RateLimitError(response?.retry_after);
      case 500:
      case 502:
      case 503:
        return new DeepSeekError(`Server Error: ${message}`, `SERVER_ERROR_${status}`);
      case 504:
        return new TimeoutError(30000);
      default:
        return new DeepSeekError(message, `HTTP_${status}`);
    }
  }
}
