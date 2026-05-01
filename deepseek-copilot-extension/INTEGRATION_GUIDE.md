# Complete Integration Guide

## Overview

This guide explains the **DeepSeek V4 for Copilot Chat** extension architecture and how all components work together to integrate DeepSeek with GitHub Copilot Chat.

## File Organization

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Extension metadata, dependencies, commands, settings |
| `tsconfig.json` | TypeScript compiler configuration |
| `.gitignore` | Git ignore patterns |
| `.vscodeignore` | Files to exclude from .vsix package |

### Documentation

| File | Purpose |
|------|---------|
| `README.md` | Full user documentation and feature list |
| `QUICKSTART.md` | 5-minute setup guide for new users |
| `CONTRIBUTING.md` | Developer guide and setup instructions |
| `CHANGELOG.md` | Version history and release notes |
| `EXTENSION_SUMMARY.md` | Technical overview of the project |

### Source Code (`src/`)

| File | Responsibility |
|------|----------------|
| `extension.ts` | Main entry point, command registration, initialization |
| `deepseekProvider.ts` | DeepSeek API wrapper and chat completion |
| `config.ts` | Configuration and secret management |
| `copilotIntegration.ts` | Copilot Chat integration and advanced features |
| `types.ts` | TypeScript interfaces and type definitions |
| `utils.ts` | Helper functions and utilities |
| `errors.ts` | Error classes and error handling |

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VS Code Extension                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────────────────────────┐
        │        extension.ts (Main)           │
        ├──────────────────────────────────────┤
        │ • Command Registration               │
        │ • Activation Logic                   │
        │ • Status Bar Management              │
        │ • Welcome Wizard                     │
        └──────────────────────────────────────┘
                ↙                    ↘
    ┌──────────────────┐      ┌──────────────────┐
    │   config.ts      │      │  deepseekProvider│
    ├──────────────────┤      ├──────────────────┤
    │ • Secrets Store  │      │ • API Requests   │
    │ • Config Watch   │      │ • Streaming      │
    │ • Settings Mgmt  │      │ • Thinking Cfg   │
    └──────────────────┘      └──────────────────┘
            ↓                          ↓
    ┌──────────────────┐      ┌──────────────────┐
    │ VS Code Keychain │      │ DeepSeek API     │
    └──────────────────┘      └──────────────────┘
                    ↘        ↙
        ┌──────────────────────────────────┐
        │  copilotIntegration.ts           │
        ├──────────────────────────────────┤
        │ • Model Registration             │
        │ • Agent Mode                     │
        │ • Tool Calling                   │
        │ • Skills Integration             │
        │ • MCP Support                    │
        └──────────────────────────────────┘
                     ↓
        ┌──────────────────────────────────┐
        │  Copilot Chat Model Picker       │
        │  & Chat Interface                │
        └──────────────────────────────────┘
```

## Data Flow

### 1. Initialization Flow

```
VS Code Startup
    ↓
extension.ts: activate()
    ↓
Register Commands
    ├─ deepseek.setApiKey
    ├─ deepseek.setVisionProxy
    └─ deepseek.clearApiKey
    ↓
Load Configuration
    ├─ Check for stored API key
    ├─ Load thinking effort setting
    └─ Load vision proxy model
    ↓
Show Status Bar
    ├─ If API key exists: "DeepSeek: Ready"
    └─ If not: "DeepSeek: Configure"
    ↓
Show Welcome (if new user)
```

### 2. API Key Configuration Flow

```
User runs: deepseek.setApiKey
    ↓
Show Input Box
    ├─ Title: "DeepSeek API Key"
    ├─ Prompt: "Enter your DeepSeek API key"
    └─ Password: true (hidden input)
    ↓
Validate Input
    ├─ Must start with "sk-"
    └─ Must be at least 20 characters
    ↓
Store in Keychain
    ├─ Try: keytar.setPassword()
    └─ Fallback: context.secrets.store()
    ↓
Update Status Bar
    └─ Set to "DeepSeek: Ready"
    ↓
Show Success Message
    └─ Offer to configure Vision Proxy
```

### 3. Chat Completion Flow

```
User: Opens Copilot Chat
    ↓
Select: DeepSeek V4 Pro/Flash
    ↓
User: Types message
    ↓
Copilot Chat: Sends to DeepSeek provider
    ↓
deepseekProvider.completeChat()
    ├─ Retrieve API key from config
    ├─ Get thinking effort from settings
    └─ Build request payload
    ↓
DeepSeek API Request
    ├─ Method: POST
    ├─ URL: https://api.deepseek.com/v1/chat/completions
    ├─ Headers: Authorization Bearer token
    └─ Body: messages, model, thinking config
    ↓
Stream Response
    ├─ Event: data: {...}
    ├─ Parse chunks
    └─ Emit each chunk
    ↓
Copilot Chat: Display response
    ↓
User: Sees streamed response in real-time
```

### 4. Vision Proxy Flow

```
User: Drops image in chat
    ↓
Copilot Chat: Detects attachment
    ↓
VisionProxyHandler.proxyImageDescription()
    ├─ Get vision proxy model from config
    ├─ Call selected model (Claude/GPT-4o)
    └─ Wait for image description
    ↓
Vision Model: Returns text description
    ↓
Combine: Original message + description
    ↓
deepseekProvider.completeChat()
    └─ Send combined text to DeepSeek
    ↓
DeepSeek: Analyzes with full context
    ↓
Response: Displayed in chat
```

## Key Features Implementation

### 1. Secure API Key Storage

**Files**: `config.ts`, `extension.ts`

```typescript
// Storage priority:
1. Try keytar (OS keychain)
   - macOS: Keychain
   - Windows: Credential Manager
   - Linux: Secret Service
   
2. Fallback: VS Code Secret Storage
   - Encrypted storage
   - Extension-scoped
   
3. Never: Plain text files
```

### 2. Thinking Effort Control

**Files**: `types.ts`, `deepseekProvider.ts`, `config.ts`

```typescript
// Thinking effort levels:
none   → No reasoning, instant response
high   → Default, balanced reasoning
max    → Maximum tokens for deep thinking

// Configuration:
- User setting: deepseek.thinkingEffort
- Per-model configuration in Copilot
- Converted to thinking tokens budget:
  - high: 16,000 tokens
  - max: 32,000 tokens
```

### 3. Vision Proxy Support

**Files**: `deepseekProvider.ts`, `copilotIntegration.ts`

```typescript
// Process:
1. Detect image attachment
2. Send to proxy model (Claude/GPT-4o)
3. Get text description
4. Combine with original message
5. Send text-only to DeepSeek

// Why needed:
- DeepSeek V4 is text-only
- Vision models understand images better
- Proxy extracts rich context
- DeepSeek processes text for better accuracy
```

### 4. Agent Mode & Tool Calling

**Files**: `copilotIntegration.ts`

```typescript
// Agent Mode:
- Multi-turn conversations
- Up to 10 turns per conversation
- Maintains context between turns

// Tool Calling:
- Parse <tool_call> blocks from responses
- Execute VS Code commands
- Return results to next turn

// Skills Integration:
- Access installed Copilot skills
- Inject skill context into messages
- Combine with DeepSeek reasoning
```

## Environment Setup

### For Users (One-time)

1. VS Code 1.116+
2. GitHub Copilot subscription (free tier works)
3. DeepSeek API key from [platform.deepseek.com](https://platform.deepseek.com)

### For Developers

```bash
# Prerequisites
Node.js 18+
npm or yarn
Git

# Setup
git clone <repo>
cd deepseek-copilot-extension
npm install

# Development
npm run watch        # Auto-rebuild on changes
F5                  # Launch debug VS Code instance

# Build
npm run vscode:prepublish  # Production build
vsce package               # Create .vsix
```

## Configuration Examples

### User Settings

```json
{
  "deepseek.thinkingEffort": "high",
  "deepseek.enableVisionProxy": true
}
```

### Package.json Contributions

```json
{
  "contributes": {
    "commands": [
      {
        "command": "deepseek.setApiKey",
        "title": "DeepSeek: Set API Key"
      }
    ],
    "configuration": {
      "properties": {
        "deepseek.thinkingEffort": {
          "type": "string",
          "enum": ["none", "high", "max"],
          "default": "high"
        }
      }
    }
  }
}
```

## Error Handling

**Files**: `errors.ts`, `deepseekProvider.ts`

```typescript
// Error Types:
DeepSeekError           // Generic errors
ApiKeyError             // Invalid/missing key
NetworkError            // Connection issues
TimeoutError            // Request timeout
RateLimitError          // API rate limit
VisionProxyError        // Image processing failed
ConfigurationError      // Config issues

// Handling:
- Try-catch blocks
- Retry logic with exponential backoff
- User-friendly error messages
- VS Code error notifications
```

## Testing

Current: Manual testing in VS Code debug

Future:
- Unit tests with Jest
- Integration tests
- API mocking
- UI testing

## Build & Publish

### Package

```bash
npm run vscode:prepublish
vsce package
# Creates: deepseek-copilot-1.0.0.vsix
```

### Publish

```bash
vsce publish
# Or specific version
vsce publish 1.1.0
```

## Performance Considerations

- **Streaming**: Real-time response display
- **Lazy Loading**: Only load when needed
- **Caching**: Consider response caching (future)
- **Resource Usage**: Minimal impact on VS Code

## Security Considerations

✅ **Implemented**
- OS keychain for API keys
- No plain text storage
- Secure HTTPS for API calls
- No data logging

⚠️ **Future**
- Rate limiting
- Request signing
- Audit logging
- IP whitelisting

## Troubleshooting Common Issues

| Issue | File | Solution |
|-------|------|----------|
| Key not saving | config.ts | Check keychain permissions |
| API errors | deepseekProvider.ts | Validate key, check network |
| Vision not working | copilotIntegration.ts | Set vision proxy model |
| Models not showing | extension.ts | Restart VS Code |

## Next Steps for Development

1. **Stable Copilot Chat API**: Await GitHub's public API
2. **Advanced Features**: Custom prompts, caching, etc.
3. **Additional Models**: Support more DeepSeek models
4. **Testing**: Comprehensive test coverage
5. **Marketplace**: Official marketplace listing

---

**For Questions**: See [CONTRIBUTING.md](./CONTRIBUTING.md) for developer resources.
