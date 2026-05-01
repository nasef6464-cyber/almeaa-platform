# Development Guide

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- VS Code 1.116+
- Git

### Clone & Install

```bash
git clone https://github.com/almeaa/deepseek-copilot.git
cd deepseek-copilot
npm install
```

### Build

```bash
# Watch mode (auto-rebuild on changes)
npm run watch

# Production build (with minification)
npm run vscode:prepublish
```

### Debug

1. Open the project in VS Code
2. Press `F5` to launch debug window
3. The debug instance will have your extension loaded
4. Set breakpoints and debug normally

### Project Structure

```
src/
├── extension.ts           # Main entry point
├── deepseekProvider.ts   # DeepSeek API wrapper
├── config.ts             # Configuration & secrets
├── copilotIntegration.ts # Copilot Chat integration
└── types.ts              # TypeScript interfaces

dist/                     # Compiled output (generated)
README.md                 # User documentation
QUICKSTART.md            # Quick start guide
CHANGELOG.md             # Version history
package.json             # Dependencies & scripts
```

## Code Style

- Use TypeScript strictly (`strict: true`)
- Follow ESLint rules
- Use descriptive variable names
- Add JSDoc comments for public APIs

### Format Code

```bash
npm run lint -- --fix
```

## Testing

```bash
# Run tests
npm test

# Coverage
npm run test:coverage
```

## Building for Release

### Create VSIX Package

```bash
# Install vsce if needed
npm install -g @vscode/vsce

# Package
vsce package

# This creates: deepseek-copilot-1.0.0.vsix
```

### Publish to Marketplace

```bash
vsce publish

# Or specify version
vsce publish 1.1.0
```

## Key APIs Used

### VS Code Extension API
- `vscode.commands.registerCommand()`
- `vscode.window.showInputBox()`
- `vscode.window.showQuickPick()`
- `vscode.context.secrets`
- `vscode.workspace.getConfiguration()`

### DeepSeek API
- POST `/chat/completions`
- Support for streaming responses
- Thinking tokens (for reasoning)
- Vision support (text-only, images via proxy)

### GitHub Copilot Chat
- Model picker integration (pending stable API)
- Agent mode
- Tool calling
- Skills support
- MCP integration

## Common Development Tasks

### Add a New Command

```typescript
this.context.subscriptions.push(
  vscode.commands.registerCommand('deepseek.myCommand', async () => {
    // Implementation
  })
);
```

### Show User Input

```typescript
const input = await vscode.window.showInputBox({
  title: 'Enter something',
  prompt: 'Please enter value',
  validateInput: (val) => val.length > 0 ? '' : 'Required'
});
```

### Store Secret

```typescript
await this.context.secrets.store('mykey', 'value');
const value = await this.context.secrets.get('mykey');
```

### Call DeepSeek API

```typescript
const provider = new DeepSeekChatProvider(apiKey);
const response = await provider.completeChat(messages, 'deepseek-chat', 'high');
```

## Debugging Tips

- Use `console.log()` for debugging
- Check "Debug Console" output in VS Code
- VS Code Debugger works normally (F5, breakpoints, etc.)
- Check Extension Output for runtime errors

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Run tests: `npm test`
- [ ] Build: `npm run vscode:prepublish`
- [ ] Test in debug mode (F5)
- [ ] Create git tag: `git tag v1.x.x`
- [ ] Build package: `vsce package`
- [ ] Test .vsix locally
- [ ] Publish: `vsce publish`

## Known Limitations & TODOs

- [ ] Copilot Chat model picker API not stable yet (awaiting GitHub)
- [ ] Vision proxy currently placeholder implementation
- [ ] MCP integration pending official spec
- [ ] No offline mode support

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [DeepSeek API Docs](https://platform.deepseek.com/api/docs)
- [GitHub Copilot Chat Docs](https://code.visualstudio.com/docs/copilot/copilot-chat)
