# Changelog

All notable changes to the DeepSeek V4 for Copilot Chat extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-01

### Added
- Initial release of DeepSeek V4 for Copilot Chat extension
- Support for DeepSeek V4 Pro model
- Support for DeepSeek V4 Flash model
- Configurable thinking effort levels (none, high, max)
- Vision proxy support for automatic image description
- Secure API key storage using OS keychain
- Status bar indicator for configuration status
- Command palette commands for API key and vision proxy management
- Full GitHub Copilot Chat integration
- Support for agent mode, tool calling, and skills
- MCP (Model Context Protocol) support

### Features
- **Model Selection**: Choose between DeepSeek V4 Pro and Flash in Copilot Chat picker
- **Thinking Effort**: Configure reasoning depth per conversation
- **Vision Proxy**: Automatic image description via Claude/GPT-4o
- **Secure Storage**: API key stored in OS keychain, never on disk
- **Status Bar**: Quick view of configuration status
- **Quick Setup**: Guided setup with helpful messages

### Documentation
- Comprehensive README with installation steps
- Inline help and tooltips
- Command descriptions
- Setting descriptions with examples

## Future Roadmap

### [1.1.0] - Planned
- [ ] Custom system prompts per model
- [ ] Model-specific settings in picker
- [ ] Integration with VS Code settings UI
- [ ] Automatic API key validation
- [ ] Response caching for repeated queries
- [ ] Custom thinking budget limits

### [1.2.0] - Planned
- [ ] Support for additional DeepSeek models
- [ ] Advanced prompt engineering tools
- [ ] Integration with VS Code's native chat commands
- [ ] Theme support for UI elements
- [ ] Telemetry and usage analytics (opt-in)

### [1.3.0] - Planned
- [ ] Custom model aliasing
- [ ] Batch processing support
- [ ] Integration with other extensions
- [ ] Advanced vision proxy configuration

## Notes

- API key security is a top priority
- Extension follows VS Code's security best practices
- All communications with DeepSeek API are encrypted
- No data is stored or transmitted without user consent
