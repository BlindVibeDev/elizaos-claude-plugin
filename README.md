# ElizaOS Claude Code Plugin

<img src="assets/banner.png" alt="Claude Code Plugin Banner" width="100%" />

## Overview

The Claude Code plugin integrates Anthropic's Claude Code CLI tool with ElizaOS, enabling AI agents to perform sophisticated coding tasks including creating, editing, refactoring, reviewing, explaining, fixing, and testing code across multiple programming languages.

Claude Code is an agentic command-line tool that allows developers to delegate coding tasks to Claude directly from their terminal. This plugin brings that power to ElizaOS agents, allowing them to assist with programming tasks in a conversational manner.

## Features

- **Code Generation**: Create new code files and functions based on natural language descriptions
- **Code Refactoring**: Improve existing code structure and readability
- **Code Review**: Analyze code for potential issues and suggest improvements
- **Code Explanation**: Provide detailed explanations of code functionality
- **Bug Fixing**: Identify and fix issues in code
- **Test Generation**: Create unit tests and test cases
- **Multi-language Support**: Works with Python, JavaScript, TypeScript, Java, C++, and more
- **Context Awareness**: Maintains session history and workspace context
- **Fallback API Mode**: Works even without Claude Code CLI installed

## Installation

### Prerequisites

1. **ElizaOS**: Ensure you have ElizaOS v2 installed and configured
2. **Anthropic API Key**: Get your API key from [Anthropic Console](https://console.anthropic.com/)
3. **Claude Code CLI** (Optional but recommended):
   ```bash
   # Install Claude Code CLI globally
   npm install -g claude-code
   # or
   yarn global add claude-code
   ```

### Plugin Installation

1. Add the plugin to your agent's `package.json`:
   ```json
   {
     "dependencies": {
       "@elizaos/plugin-claude-code": "github:elizaos-plugins/plugin-claude-code"
     }
   }
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Configure your agent's character file:
   ```json
   {
     "name": "CodingAssistant",
     "plugins": ["@elizaos/plugin-claude-code"],
     "settings": {
       "secrets": {
         "ANTHROPIC_API_KEY": "your-anthropic-api-key"
       },
       "CLAUDE_CODE_WORKSPACE": "/path/to/your/workspace",
       "CLAUDE_CODE_MODEL": "claude-3-5-sonnet-20241022",
       "CLAUDE_CODE_MAX_TOKENS": 4096
     }
   }
   ```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY` (required): Your Anthropic API key
- `CLAUDE_CODE_WORKSPACE` (optional): Default workspace directory for operations
- `CLAUDE_CODE_MODEL` (optional): Claude model to use (default: claude-3-5-sonnet-20241022)
- `CLAUDE_CODE_MAX_TOKENS` (optional): Maximum tokens for responses (default: 4096)

### Character Configuration Example

```json
{
  "name": "DevBot",
  "description": "An AI coding assistant powered by Claude Code",
  "plugins": ["@elizaos/plugin-claude-code"],
  "settings": {
    "voice": {
      "model": "en_US-hfc_female-medium"
    },
    "secrets": {
      "ANTHROPIC_API_KEY": "sk-ant-..."
    },
    "CLAUDE_CODE_WORKSPACE": "./projects",
    "CLAUDE_CODE_MODEL": "claude-3-5-sonnet-20241022"
  },
  "bio": [
    "I'm a coding assistant that can help you write, review, and improve code.",
    "I use Claude Code to provide intelligent programming assistance.",
    "I can work with multiple programming languages and frameworks."
  ],
  "style": {
    "all": [
      "Be helpful and precise with coding tasks",
      "Provide clear explanations for code",
      "Suggest best practices and improvements",
      "Use appropriate technical terminology"
    ]
  }
}
```

## Usage Examples

### Code Generation
```
User: Create a Python function that calculates the factorial of a number
Bot: I'll create a Python function to calculate factorials using Claude Code.
[Creates factorial.py with implementation]
```

### Code Refactoring
```
User: Refactor this JavaScript code to use modern ES6+ features
Bot: I'll refactor your JavaScript code to use modern ES6+ features with Claude Code.
[Refactors the code with arrow functions, destructuring, etc.]
```

### Code Review
```
User: Review this Python class for potential improvements
Bot: I'll review your Python class and suggest improvements using Claude Code.
[Analyzes code and provides detailed feedback]
```

### Bug Fixing
```
User: This function is throwing an error, can you fix it?
Bot: I'll analyze and fix the error in your function with Claude Code.
[Identifies the issue and provides corrected code]
```

## Plugin Architecture

### Components

1. **Actions**
   - `CLAUDE_CODE`: Main action for executing coding tasks

2. **Services**
   - `ClaudeCodeService`: Core service handling Claude Code integration

3. **Providers**
   - `claudeCodeProvider`: Provides context about recent coding sessions

4. **Evaluators**
   - `claudeCodeEvaluator`: Evaluates message relevance for coding tasks

### Task Types

- `create`: Generate new code from descriptions
- `edit`: Modify existing code
- `refactor`: Improve code structure
- `review`: Analyze code quality
- `explain`: Provide code explanations
- `fix`: Debug and fix issues
- `test`: Generate test cases

## Development

### Building the Plugin

```bash
# Clone the repository
git clone https://github.com/elizaos-plugins/plugin-claude-code
cd plugin-claude-code

# Install dependencies
pnpm install

# Build the plugin
pnpm run build

# Run tests
pnpm test
```

### Testing Locally

1. Link the plugin locally:
   ```bash
   pnpm link
   ```

2. In your ElizaOS project:
   ```bash
   pnpm link @elizaos/plugin-claude-code
   ```

## API Reference

### ClaudeCodeService

```typescript
class ClaudeCodeService {
  executeTask(task: ClaudeCodeTask): Promise<ClaudeCodeResult>
  getSession(sessionId: string): ClaudeCodeSession | undefined
  getAllSessions(): ClaudeCodeSession[]
  clearSessions(): void
}
```

### Types

```typescript
interface ClaudeCodeTask {
  type: 'create' | 'edit' | 'refactor' | 'review' | 'explain' | 'fix' | 'test'
  description: string
  files?: string[]
  language?: string
  context?: string
}

interface ClaudeCodeResult {
  success: boolean
  message: string
  files?: Array<{
    path: string
    content: string
    action: 'created' | 'modified' | 'deleted'
  }>
  output?: string
  error?: string
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Claude Code CLI not found**
   - The plugin will fallback to API mode
   - For best results, install Claude Code CLI

2. **API Key errors**
   - Ensure your Anthropic API key is valid
   - Check the key is properly configured in settings

3. **Workspace permissions**
   - Ensure the agent has read/write access to the workspace directory

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/elizaos-plugins/plugin-claude-code/issues)
- **Discord**: Join the ElizaOS Discord community
- **Documentation**: [ElizaOS Docs](https://docs.elizaos.ai)

## Acknowledgments

- Anthropic for Claude and Claude Code
- ElizaOS community for the plugin framework
- All contributors to this project
