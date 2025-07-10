# Contributing to ElizaOS Claude Code Plugin

Thank you for your interest in contributing to the Claude Code plugin for ElizaOS! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/plugin-claude-code.git
   cd plugin-claude-code
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/elizaos-plugins/plugin-claude-code.git
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```

## Development Workflow

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Write or update tests as needed

4. Run tests to ensure everything works:
   ```bash
   pnpm test
   ```

5. Lint your code:
   ```bash
   pnpm lint
   ```

6. Format your code:
   ```bash
   pnpm format
   ```

7. Commit your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```

8. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

9. Create a Pull Request

## Coding Standards

### TypeScript Guidelines

- Use TypeScript for all source code
- Enable strict mode
- Provide proper types for all functions and variables
- Avoid using `any` type unless absolutely necessary
- Use interfaces for object shapes
- Document complex types with JSDoc comments

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Maximum line length of 100 characters
- Use meaningful variable and function names
- Add comments for complex logic

### File Structure

- Place actions in `src/actions/`
- Place services in `src/services/`
- Place providers in `src/providers/`
- Place evaluators in `src/evaluators/`
- Keep related functionality together

## Testing

### Writing Tests

- Write tests for all new functionality
- Place tests next to the files they test (e.g., `claudeCode.test.ts`)
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Pull Request Guidelines

### PR Requirements

1. **Working Demo**: Include screenshots or recordings showing the feature works
2. **Tests**: All tests must pass
3. **Documentation**: Update README if adding new features
4. **Commit Messages**: Follow conventional commits format
5. **Description**: Provide a clear description of changes

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added and passing
- [ ] No new warnings introduced
- [ ] Demo evidence provided

## Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Maintenance tasks

## Reporting Issues

When reporting issues, please include:

1. ElizaOS version
2. Plugin version
3. Node.js version
4. Operating system
5. Steps to reproduce
6. Expected behavior
7. Actual behavior
8. Error logs or screenshots

## Community

- Join the ElizaOS Discord for discussions
- Check existing issues before creating new ones
- Be respectful and constructive in all interactions
- Help others when you can

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
