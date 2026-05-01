/**
 * Type definitions for the extension
 */

export interface DeepSeekModel {
  id: string;
  name: string;
  description: string;
  vendor: string;
  family: string;
  contextWindow?: number;
  costPerMToken?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: ImageContent[];
}

export interface ImageContent {
  type: 'image_url';
  image_url: {
    url: string;
  };
}

export interface DeepSeekCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ThinkingConfig {
  enabled: boolean;
  type: 'enabled';
  budgetTokens: number;
}

export type ThinkingEffort = 'none' | 'high' | 'max';

export interface ApiKeyValidation {
  valid: boolean;
  message: string;
  remaining?: number;
}

export interface VisionProxyModel {
  id: string;
  label: string;
  description: string;
}

export const AVAILABLE_VISION_PROXIES: VisionProxyModel[] = [
  {
    id: 'claude-opus',
    label: 'Claude Opus 4.7',
    description: 'Most capable, best for complex images'
  },
  {
    id: 'claude-sonnet',
    label: 'Claude Sonnet 4.6',
    description: 'Balanced speed and quality'
  },
  {
    id: 'gpt4o',
    label: 'GPT-4o',
    description: 'Fast, reliable image understanding'
  },
  {
    id: 'gpt4-turbo',
    label: 'GPT-4 Turbo',
    description: 'Advanced vision capabilities'
  },
  {
    id: 'auto',
    label: 'Auto (Default)',
    description: 'Automatically select based on availability'
  }
];

export const DEEPSEEK_MODELS: DeepSeekModel[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V4 Pro',
    description: 'Advanced reasoning, 128K context',
    vendor: 'deepseek',
    family: 'deepseek-v4',
    contextWindow: 128000,
    costPerMToken: 0.27
  },
  {
    id: 'deepseek-chat-flash',
    name: 'DeepSeek V4 Flash',
    description: 'Fast responses, 64K context',
    vendor: 'deepseek',
    family: 'deepseek-v4',
    contextWindow: 64000,
    costPerMToken: 0.1
  }
];

export interface ExtensionState {
  apiKeyConfigured: boolean;
  visionProxyConfigured: boolean;
  thinkingEffort: ThinkingEffort;
  lastUsedModel: string;
}
