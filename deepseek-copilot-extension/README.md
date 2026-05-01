# DeepSeek V4 for Copilot Chat

A VS Code extension that adds **DeepSeek V4 Pro & Flash** directly into the GitHub Copilot Chat model picker. Keep Copilot's agent mode, tool calling, skills, and MCP — all powered by DeepSeek.

## Features

✨ **DeepSeek V4 Pro & Flash in Copilot Chat**
- Choose between DeepSeek V4 Pro (advanced reasoning) or V4 Flash (fast, general-purpose)
- Full support for Copilot agent mode, tool calling, and skills
- MCP (Model Context Protocol) integration

🧠 **Configurable Thinking Effort**
- **None**: Fastest, no reasoning
- **High**: Balanced (recommended)
- **Max**: Deep reasoning for complex tasks

🖼️ **Vision Support with Auto-Proxy**
- Drop images into chat
- Automatically proxies through Claude/GPT-4o to describe images
- DeepSeek processes text-only with rich context

🔐 **Secure API Key Storage**
- Stored in OS keychain (macOS/Windows) or secure storage (Linux)
- Never saved to disk or sent to third parties
- One-time setup

## Installation

### Step 1: Install VS Code 1.116 or Later
Ensure you have the latest version of VS Code supporting Copilot extensions.

### Step 2: Subscribe to GitHub Copilot (Optional)
- Free tier: Works with DeepSeek
- Pro/Enterprise: All features supported
- Get a [GitHub Copilot subscription](https://github.com/github-copilot/signup)

### Step 3: Install Extension
1. Go to VS Code Extensions Marketplace
2. Search for **"DeepSeek V4 for Copilot Chat"**
3. Click Install
4. Reload VS Code

### Step 4: Get a DeepSeek API Key
1. Visit [DeepSeek Platform](https://platform.deepseek.com)
2. Create an account and generate an API key
3. Copy the key (starts with `sk-`)

### Step 5: Configure the API Key
1. Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run `DeepSeek: Set API Key`
3. Paste your key

The key is stored securely in the OS keychain and never exposed.

## Usage

### Start Chatting with DeepSeek

1. Open **Copilot Chat** (`Cmd+Shift+I` / `Ctrl+Shift+I`)
2. Click the **model picker** at the top-right
3. Select **DeepSeek V4 Pro** or **DeepSeek V4 Flash**
4. Start chatting — agent mode, tool calling, and all Copilot features work!

### Configure Thinking Effort

In the model picker, click the **gear icon** next to a DeepSeek model:

- **None**: Fastest, no reasoning
- **High**: Balanced (default, recommended for most tasks)
- **Max**: Deep reasoning for complex tasks

Or set globally in VS Code settings:
```json
{
  "deepseek.thinkingEffort": "high"
}
```

### Use Vision Proxy

1. Drop a screenshot or image into chat
2. Extension automatically:
   - Detects the image
   - Proxies through Claude or GPT-4o for description
   - Sends the text description to DeepSeek
3. DeepSeek responds with full context

### Configure Vision Proxy Model

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run `DeepSeek: Set Vision Proxy Model`
3. Choose between:
   - Claude Opus 4.7
   - Claude Sonnet 4.6
   - GPT-4o
   - Auto (default)

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `DeepSeek: Set API Key` | — | Configure or update your DeepSeek API key |
| `DeepSeek: Set Vision Proxy Model` | — | Choose which model describes images |
| `DeepSeek: Clear API Key` | — | Remove stored API key |

## Settings

```json
{
  "deepseek.thinkingEffort": "high",
  "deepseek.enableVisionProxy": true
}
```

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `deepseek.thinkingEffort` | `"none" \| "high" \| "max"` | `"high"` | Thinking effort level for complex reasoning |
| `deepseek.enableVisionProxy` | `boolean` | `true` | Enable auto-proxy for image descriptions |

## Supported Copilot Features

✅ Agent mode  
✅ Tool calling  
✅ Skills  
✅ MCP (Model Context Protocol)  
✅ Inline chat  
✅ Chat threads  
✅ Multi-turn conversations  

## Privacy & Security

🔒 **Secure Storage**
- API key stored in OS keychain (not on disk)
- Never transmitted outside Copilot Chat
- VS Code manages all secrets

🌐 **Data Flow**
1. Your message → VS Code → DeepSeek API
2. Response → DeepSeek API → VS Code → You
3. Images (if enabled) → Proxy model → Text description → DeepSeek

## Troubleshooting

### "API Key not set" error
Run `DeepSeek: Set API Key` and paste your valid key

### Models not appearing in picker
- Restart VS Code
- Ensure GitHub Copilot extension is installed and working
- Check API key is valid

### Images not being described
- Enable `deepseek.enableVisionProxy` in settings
- Run `DeepSeek: Set Vision Proxy Model` to configure
- Ensure another Copilot model is installed for proxy

### Slow responses
- Consider using **DeepSeek V4 Flash** for faster responses
- Set `deepseek.thinkingEffort` to `"none"` for instant mode

## Pricing

DeepSeek V4 Pro/Flash API pricing is available at [DeepSeek Pricing](https://platform.deepseek.com/api/docs/pricing). Much more affordable than GPT-4o.

## Support

- **Issues**: [Report bugs on GitHub](https://github.com/almeaa/deepseek-copilot)
- **Docs**: [DeepSeek Platform Docs](https://platform.deepseek.com)
- **Community**: [DeepSeek Discord](https://discord.gg/deepseek)

## License

MIT

## Credits

Built by ALMEAA Team  
Powered by [DeepSeek](https://deepseek.com) & [GitHub Copilot](https://github.com/features/copilot)
