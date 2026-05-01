import * as vscode from 'vscode';

const DEEPSEEK_SERVICE = 'deepseek-copilot';
const API_KEY_ACCOUNT = 'deepseek-api-key';
const VISION_PROXY_KEY = 'deepseek-vision-proxy';

interface DeepSeekModel {
  id: string;
  name: string;
  description: string;
}

const DEEPSEEK_MODELS: DeepSeekModel[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek V4 Pro',
    description: 'High - Most capable reasoning model'
  },
  {
    id: 'deepseek-chat-flash',
    name: 'DeepSeek V4 Flash',
    description: 'Max - Fast, general-purpose model'
  }
];

class DeepSeekCopilotExtension {
  private context: vscode.ExtensionContext;
  private statusBar: vscode.StatusBarItem;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBar.name = 'DeepSeek Status';
  }

  async activate(): Promise<void> {
    console.log('DeepSeek V4 for Copilot Chat is now active');

    // Register commands
    this.registerCommands();

    // Initialize status bar
    await this.updateStatusBar();

    // Show welcome message
    const hasApiKey = await this.getApiKey();
    if (!hasApiKey) {
      vscode.window.showInformationMessage(
        'DeepSeek V4 for Copilot Chat: Set your API key to get started',
        'Set API Key'
      ).then(selection => {
        if (selection === 'Set API Key') {
          vscode.commands.executeCommand('deepseek.setApiKey');
        }
      });
    }
  }

  private registerCommands(): void {
    // Set API Key command
    this.context.subscriptions.push(
      vscode.commands.registerCommand('deepseek.setApiKey', async () => {
        await this.handleSetApiKey();
      })
    );

    // Set Vision Proxy Model command
    this.context.subscriptions.push(
      vscode.commands.registerCommand('deepseek.setVisionProxy', async () => {
        await this.handleSetVisionProxy();
      })
    );

    // Clear API Key command
    this.context.subscriptions.push(
      vscode.commands.registerCommand('deepseek.clearApiKey', async () => {
        await this.handleClearApiKey();
      })
    );
  }

  private async handleSetApiKey(): Promise<void> {
    const input = await vscode.window.showInputBox({
      title: 'DeepSeek API Key',
      prompt: 'Enter your DeepSeek API key (starts with sk-)',
      password: true,
      validateInput: (value: string) => {
        if (!value) return 'API key is required';
        if (!value.startsWith('sk-')) return 'API key should start with sk-';
        if (value.length < 20) return 'API key seems too short';
        return '';
      }
    });

    if (!input) return;

    try {
      // Try to use keytar if available
      try {
        const keytar = require('keytar');
        await keytar.setPassword(DEEPSEEK_SERVICE, API_KEY_ACCOUNT, input);
      } catch {
        // Fallback to secret storage
        this.context.secrets.store(API_KEY_ACCOUNT, input);
      }

      await this.updateStatusBar();
      vscode.window.showInformationMessage('✅ DeepSeek API key configured successfully!');
      
      // Offer to set vision proxy if not already set
      const visionProxy = await this.getVisionProxy();
      if (!visionProxy) {
        const result = await vscode.window.showInformationMessage(
          'Do you want to configure a vision proxy model for image support?',
          'Configure',
          'Skip'
        );
        if (result === 'Configure') {
          vscode.commands.executeCommand('deepseek.setVisionProxy');
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to save API key: ${error}`);
    }
  }

  private async handleSetVisionProxy(): Promise<void> {
    const copilotModels = [
      'Claude Opus 4.7',
      'Claude Sonnet 4.6',
      'GPT-4o',
      'GPT-4 Turbo',
      'Auto (Default)'
    ];

    const selected = await vscode.window.showQuickPick(copilotModels, {
      title: 'Select Vision Proxy Model',
      placeHolder: 'Choose which model should handle image descriptions',
      description: 'This model will describe images before sending to DeepSeek'
    });

    if (!selected) return;

    try {
      this.context.secrets.store(VISION_PROXY_KEY, selected);
      vscode.window.showInformationMessage(`✅ Vision proxy set to: ${selected}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to save vision proxy: ${error}`);
    }
  }

  private async handleClearApiKey(): Promise<void> {
    const confirmed = await vscode.window.showWarningMessage(
      'Are you sure you want to clear the DeepSeek API key?',
      'Yes, Clear',
      'Cancel'
    );

    if (confirmed !== 'Yes, Clear') return;

    try {
      try {
        const keytar = require('keytar');
        await keytar.deletePassword(DEEPSEEK_SERVICE, API_KEY_ACCOUNT);
      } catch {
        this.context.secrets.delete(API_KEY_ACCOUNT);
      }

      await this.updateStatusBar();
      vscode.window.showInformationMessage('DeepSeek API key cleared');
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to clear API key: ${error}`);
    }
  }

  private async getApiKey(): Promise<string | undefined> {
    try {
      try {
        const keytar = require('keytar');
        return await keytar.getPassword(DEEPSEEK_SERVICE, API_KEY_ACCOUNT);
      } catch {
        return this.context.secrets.get(API_KEY_ACCOUNT);
      }
    } catch {
      return undefined;
    }
  }

  private async getVisionProxy(): Promise<string | undefined> {
    try {
      return this.context.secrets.get(VISION_PROXY_KEY);
    } catch {
      return undefined;
    }
  }

  private async updateStatusBar(): Promise<void> {
    const hasApiKey = await this.getApiKey();
    const visionProxy = await this.getVisionProxy();

    if (hasApiKey) {
      this.statusBar.text = '$(extensions-info-message) DeepSeek: Ready';
      this.statusBar.tooltip = `DeepSeek V4 Pro/Flash ready\nVision Proxy: ${visionProxy || 'Not configured'}`;
      this.statusBar.command = 'deepseek.setVisionProxy';
    } else {
      this.statusBar.text = '$(extensions-warning-message) DeepSeek: Configure';
      this.statusBar.tooltip = 'Click to set DeepSeek API key';
      this.statusBar.command = 'deepseek.setApiKey';
    }

    this.statusBar.show();
  }
}

export async function activate(context: vscode.ExtensionContext) {
  const extension = new DeepSeekCopilotExtension(context);
  await extension.activate();
}

export function deactivate() {
  console.log('DeepSeek V4 for Copilot Chat deactivated');
}
