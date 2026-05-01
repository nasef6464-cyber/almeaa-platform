import * as vscode from 'vscode';

/**
 * DeepSeek Chat Completion Provider
 * Handles communication with DeepSeek API and integrates with Copilot Chat
 */
export class DeepSeekChatProvider {
  private apiKey: string;
  private baseUrl: string = 'https://api.deepseek.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async completeChat(
    messages: ChatMessage[],
    model: 'deepseek-chat' | 'deepseek-chat-flash' = 'deepseek-chat',
    thinkingEffort: 'none' | 'high' | 'max' = 'high',
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const response = await this.makeRequest('/chat/completions', {
        model,
        messages,
        temperature: 0.3,
        max_tokens: 8192,
        ...(thinkingEffort !== 'none' && {
          thinking: {
            type: 'enabled',
            budget_tokens: this.getThinkingBudget(thinkingEffort)
          }
        })
      });

      let fullResponse = '';

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullResponse += content;
                  onChunk?.(content);
                }
              } catch {
                // Parse error, skip
              }
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      throw new Error(`DeepSeek API error: ${error}`);
    }
  }

  async describeImage(imageData: string | Buffer, model: 'claude' | 'gpt4' = 'claude'): Promise<string> {
    // This would be implemented by delegating to the vision proxy model
    // For now, returning a placeholder
    return `[Image description via ${model}]`;
  }

  private async makeRequest(
    endpoint: string,
    body: Record<string, unknown>,
    stream: boolean = false
  ): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        ...body,
        stream
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`API error ${response.status}: ${JSON.stringify(error)}`);
    }

    return response;
  }

  private getThinkingBudget(effort: 'high' | 'max'): number {
    return effort === 'max' ? 32000 : 16000;
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: Array<{
    type: 'image_url';
    image_url: {
      url: string;
    };
  }>;
}

/**
 * Vision Proxy Handler
 * Proxies images through Copilot models to get descriptions
 */
export class VisionProxyHandler {
  async proxyImageDescription(
    imageBuffer: Buffer,
    modelName: string
  ): Promise<string> {
    // This would integrate with Copilot's vision capabilities
    // For now, returning a placeholder that would be implemented
    // based on available Copilot extension APIs
    return `[Image analyzed by ${modelName}]`;
  }
}
