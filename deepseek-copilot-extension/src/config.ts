import * as vscode from 'vscode';

export type ThinkingEffort = 'none' | 'high' | 'max';

export class ConfigurationManager {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getThinkingEffort(): ThinkingEffort {
    return vscode.workspace.getConfiguration('deepseek').get('thinkingEffort', 'high') as ThinkingEffort;
  }

  setThinkingEffort(effort: ThinkingEffort): Thenable<void> {
    return vscode.workspace.getConfiguration('deepseek').update('thinkingEffort', effort, vscode.ConfigurationTarget.Global);
  }

  isVisionProxyEnabled(): boolean {
    return vscode.workspace.getConfiguration('deepseek').get('enableVisionProxy', true);
  }

  setVisionProxyEnabled(enabled: boolean): Thenable<void> {
    return vscode.workspace.getConfiguration('deepseek').update('enableVisionProxy', enabled, vscode.ConfigurationTarget.Global);
  }

  onConfigurationChange(callback: () => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('deepseek')) {
        callback();
      }
    });
  }
}

export class SecretManager {
  private context: vscode.ExtensionContext;
  private readonly API_KEY_KEY = 'deepseek-api-key';
  private readonly VISION_PROXY_KEY = 'deepseek-vision-proxy';

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async getApiKey(): Promise<string | undefined> {
    try {
      return await this.context.secrets.get(this.API_KEY_KEY);
    } catch {
      return undefined;
    }
  }

  async setApiKey(key: string): Promise<void> {
    return this.context.secrets.store(this.API_KEY_KEY, key);
  }

  async deleteApiKey(): Promise<void> {
    return this.context.secrets.delete(this.API_KEY_KEY);
  }

  async getVisionProxyModel(): Promise<string | undefined> {
    try {
      return await this.context.secrets.get(this.VISION_PROXY_KEY);
    } catch {
      return undefined;
    }
  }

  async setVisionProxyModel(model: string): Promise<void> {
    return this.context.secrets.store(this.VISION_PROXY_KEY, model);
  }

  async deleteVisionProxyModel(): Promise<void> {
    return this.context.secrets.delete(this.VISION_PROXY_KEY);
  }
}
