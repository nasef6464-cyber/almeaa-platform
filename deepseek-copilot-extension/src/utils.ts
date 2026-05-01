/**
 * Utility functions for the extension
 */

export class Logger {
  private static channel: any;

  static setOutputChannel(channel: any): void {
    this.channel = channel;
  }

  static info(message: string, ...args: unknown[]): void {
    const msg = `[INFO] ${message}`;
    console.log(msg, ...args);
    this.channel?.appendLine(msg);
  }

  static warn(message: string, ...args: unknown[]): void {
    const msg = `[WARN] ${message}`;
    console.warn(msg, ...args);
    this.channel?.appendLine(msg);
  }

  static error(message: string, error?: unknown): void {
    const msg = `[ERROR] ${message}: ${error}`;
    console.error(msg);
    this.channel?.appendLine(msg);
  }

  static debug(message: string, ...args: unknown[]): void {
    const msg = `[DEBUG] ${message}`;
    console.debug(msg, ...args);
  }
}

export class ValidationUtils {
  static isValidApiKey(key: string): boolean {
    return key.startsWith('sk-') && key.length >= 20;
  }

  static isChatMessage(obj: unknown): obj is { role: string; content: string } {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'role' in obj &&
      'content' in obj &&
      typeof (obj as any).role === 'string' &&
      typeof (obj as any).content === 'string'
    );
  }

  static isThinkingEffort(value: unknown): value is 'none' | 'high' | 'max' {
    return value === 'none' || value === 'high' || value === 'max';
  }
}

export class StringUtils {
  static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
  }

  static maskApiKey(key: string): string {
    if (key.length < 8) return '*'.repeat(key.length);
    const visible = key.slice(-4);
    return '*'.repeat(key.length - 4) + visible;
  }

  static getModelDisplayName(modelId: string): string {
    const modelMap: Record<string, string> = {
      'deepseek-chat': 'DeepSeek V4 Pro',
      'deepseek-chat-flash': 'DeepSeek V4 Flash'
    };
    return modelMap[modelId] || modelId;
  }
}

export class AsyncUtils {
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    throw lastError || new Error('Max retry attempts reached');
  }

  static timeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
          timeoutMs
        )
      )
    ]);
  }
}

export class DateUtils {
  static formatDate(date: Date): string {
    return date.toLocaleString();
  }

  static getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

    return `${Math.floor(seconds / 86400)}d ago`;
  }
}

export class EventEmitter {
  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, handler: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: string, handler: Function): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        Logger.error(`Event handler error for ${event}`, error);
      }
    });
  }

  once(event: string, handler: Function): void {
    const wrapper = (...args: unknown[]) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
