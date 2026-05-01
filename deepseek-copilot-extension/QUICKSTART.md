# Quick Start Guide

Get DeepSeek V4 Pro & Flash in your Copilot Chat in 5 minutes!

## 📋 Prerequisites

- ✅ VS Code 1.116+
- ✅ GitHub Copilot extension installed
- ✅ DeepSeek API key (create one [here](https://platform.deepseek.com))

## 🚀 5-Minute Setup

### 1. Install Extension
1. Open VS Code
2. Go to **Extensions** (`Cmd+Shift+X` / `Ctrl+Shift+X`)
3. Search for **"DeepSeek V4 for Copilot Chat"**
4. Click **Install**
5. Reload VS Code

### 2. Get Your API Key
1. Go to [DeepSeek Platform](https://platform.deepseek.com)
2. Sign up or log in
3. Create an API key
4. Copy the key (starts with `sk-`)

### 3. Configure in VS Code
1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Type `DeepSeek: Set API Key`
3. Paste your API key
4. Press Enter ✅

### 4. Start Chatting!
1. Open **Copilot Chat** (`Cmd+Shift+I` / `Ctrl+Shift+I`)
2. Click the **model picker** (top-right of chat panel)
3. Select **DeepSeek V4 Pro** or **DeepSeek V4 Flash**
4. Start typing and chat! 🎉

## 🎯 Common Tasks

### Use Different Models
- **DeepSeek V4 Pro**: Best for complex reasoning, analysis, writing
- **DeepSeek V4 Flash**: Fastest for quick questions and general tasks

### Change Thinking Effort
1. Click the **gear icon** next to DeepSeek model in picker
2. Choose:
   - ⚡ **None**: Instant responses
   - 🎯 **High**: Balanced reasoning (recommended)
   - 🧠 **Max**: Deep analysis for complex problems

### Enable Image Support
1. Open Command Palette
2. Run `DeepSeek: Set Vision Proxy Model`
3. Choose **Claude Sonnet** or **GPT-4o**
4. Drop images in chat — they'll be automatically described!

### Check Configuration Status
- Look at the status bar (bottom right) for DeepSeek status
- 🟢 **Ready**: API key configured
- 🟡 **Configure**: Set API key

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key required" | Run `DeepSeek: Set API Key` and paste valid key |
| Models not showing | Restart VS Code, check Copilot extension is active |
| Images not working | Run `DeepSeek: Set Vision Proxy Model` |
| Slow responses | Try DeepSeek V4 Flash or set thinking to "None" |
| API key not saving | Check VS Code has permission to use keychain |

## 📚 More Resources

- [Full Documentation](./README.md)
- [DeepSeek API Docs](https://platform.deepseek.com/api/docs)
- [GitHub Issues](https://github.com/almeaa/deepseek-copilot/issues)

## 🎓 Tips & Tricks

✨ **Tip 1**: Use agent mode for complex multi-step tasks
```
@deepseek-v4-pro Analyze this codebase and suggest optimizations
```

✨ **Tip 2**: Use Max thinking for complex algorithms
```
Set thinking effort to Max before asking about sorting algorithms
```

✨ **Tip 3**: Combine with Copilot skills
```
@github @deepseek-v4 Find bugs in my recent commits
```

✨ **Tip 4**: Vision works automatically
```
Screenshot errors → drop in chat → DeepSeek analyzes!
```

## ❓ FAQ

**Q: Is my API key secure?**  
A: Yes! Stored in OS keychain, never on disk or sent to third parties.

**Q: Can I use free tier?**  
A: Yes! GitHub Copilot free tier works with this extension.

**Q: How much does it cost?**  
A: Only DeepSeek API charges apply. See [pricing](https://platform.deepseek.com/api/docs/pricing).

**Q: Does it work with Copilot skills?**  
A: Yes! All Copilot features work with DeepSeek models.

**Q: Can I switch models easily?**  
A: Yes! Just click the model picker and choose anytime.

---

**Ready to go?** Start with step 1 above and you'll be chatting with DeepSeek in minutes! 🚀
