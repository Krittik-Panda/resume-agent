# Contributing to AI Resume & Portfolio Agent

We welcome contributions from the community! This document provides guidelines and information for contributors to help make the contribution process smooth and effective.

## Welcome

The AI Resume & Portfolio Agent is an interactive, AI-powered resume and portfolio agent that transforms static CVs into dynamic, conversational experiences. This project is part of the AI AGENTS ASSEMBLE hackathon by WeMakeDevs and integrates with multiple sponsor tools including OpenRouter, Kestra, Vercel, Oumi, CodeRabbit, and Cline.

Whether you're fixing bugs, adding features, improving documentation, or helping with testing, your contributions are valuable and appreciated!

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- **Be Respectful**: Treat all contributors with respect and kindness
- **Be Collaborative**: Work together constructively and help newcomers
- **Be Inclusive**: Ensure your contributions are accessible and considerate of diverse perspectives
- **Be Professional**: Maintain a professional tone in all communications

## Development Setup

### Prerequisites

- **Node.js 18+** and npm
- **OpenRouter API Key** (free tier available at [openrouter.ai](https://openrouter.ai))
- **Vercel Account** (optional, for deployment)
- **Git** for version control

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/resume-agent.git
   cd resume-agent
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies (includes backend dependencies)
   npm install

   # Install frontend dependencies
   cd frontend && npm install && cd ..
   ```

3. **Environment Configuration**

   **Backend Environment (.env in backend/):**

   ```env
   PORT=3000
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   OPENROUTER_MODEL=mistralai/mistral-7b-instruct
   ```

   **Root Environment (.env in project root):**

   ```env
   BACKEND_URL=http://localhost:3000
   ```

4. **Start Development Servers**

   ```bash
   # Start backend (Terminal 1)
   npm run dev

   # Start frontend (Terminal 2)
   cd frontend && npm run dev
   ```

5. **Verify Installation**

   - Frontend: Visit <http://localhost:3000>
   - Backend API: Visit <http://localhost:3000/health>
   - Test API: Run `node test-resume-upload.js`

## How to Contribute

### Types of Contributions

- **🐛 Bug Fixes**: Identify and fix bugs in the codebase
- **✨ New Features**: Add new functionality to the application
- **📚 Documentation**: Improve documentation, tutorials, or examples
- **🧪 Testing**: Add or improve test coverage
- **🎨 UI/UX**: Enhance user interface and experience
- **🔧 Tooling**: Improve development tools, scripts, or CI/CD
- **📖 Content**: Update README, guides, or project information

### Contribution Process

1. **Choose an Issue**: Look for open issues labeled `good first issue` or `help wanted`
2. **Fork & Clone**: Fork the repository and create a feature branch
3. **Make Changes**: Implement your changes following our coding standards
4. **Test**: Ensure your changes work and don't break existing functionality
5. **Submit PR**: Create a pull request with a clear description

## Development Workflow

### Git Workflow

We follow a standard Git workflow:

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. **Make Commits**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

   Use conventional commit format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for code refactoring

3. **Keep Updated**

   ```bash
   git fetch origin
   git rebase origin/main
   ```

4. **Push & Create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

### Pull Request Process

1. **PR Template**: Fill out the PR template completely
2. **Description**: Clearly describe what changes were made and why
3. **Screenshots**: Include screenshots for UI changes
4. **Testing**: Describe how you tested your changes
5. **Review**: Address reviewer feedback promptly
6. **Merge**: PRs are merged after approval from maintainers

## Coding Standards

### TypeScript Standards

- Use TypeScript for all new code
- Enable strict type checking where possible
- Use interfaces for object shapes and type definitions
- Prefer `const` assertions for immutable data
- Use meaningful variable and function names

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const API_ENDPOINTS = {
  users: '/api/users',
  projects: '/api/projects'
} as const;

// ❌ Avoid
let user: any;
const endpoints = {
  users: '/api/users'
};
```

### React Standards

- Use functional components with hooks
- Follow React best practices for performance
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Follow component composition patterns

```typescript
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ Avoid
const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

### AI & Backend Standards

- Use async/await for asynchronous operations
- Implement proper error handling and logging
- Follow REST API conventions
- Use environment variables for configuration
- Implement input validation and sanitization

```typescript
// ✅ Good
async function analyzeResume(text: string): Promise<AnalysisResult> {
  try {
    const response = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL!,
      messages: [{ role: 'user', content: text }]
    });

    return {
      summary: response.choices[0].message.content,
      success: true
    };
  } catch (error) {
    logger.error('Resume analysis failed:', error);
    throw new Error('Failed to analyze resume');
  }
}

// ❌ Avoid
function analyzeResume(text) {
  return openrouter.chat.completions.create({
    model: 'mistralai/mistral-7b-instruct',
    messages: [{ role: 'user', content: text }]
  });
}
```

## Testing Requirements

### Unit Tests

- Write unit tests for all utility functions
- Test components with React Testing Library
- Mock external API calls in tests
- Aim for 80%+ code coverage

```typescript
// Example test with Jest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button onClick={() => {}}>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Tests

- Test API endpoints with real requests
- Test component interactions
- Use test database for data operations
- Test error scenarios and edge cases

```bash
# Run integration tests
npm run test:integration

# Test specific endpoint
curl -X POST http://localhost:3000/api/resume/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "test resume"}'
```

### Testing Scripts

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
cd frontend && npm test

# Run with coverage
npm run test:coverage
```

## Documentation Standards

### Code Documentation

- Use JSDoc comments for functions and classes
- Document complex algorithms and business logic
- Include examples for API usage
- Keep README files updated

```typescript
/**
 * Analyzes resume text using AI and generates role-specific summaries
 * @param text - The resume text to analyze
 * @param role - The target role for analysis (e.g., 'backend-engineer')
 * @returns Promise resolving to analysis result
 * @throws Error if API call fails or invalid input provided
 *
 * @example
 * ```typescript
 * const result = await analyzeResume(resumeText, 'frontend-developer');
 * console.log(result.summary);
 * ```
 */
async function analyzeResume(text: string, role: string): Promise<AnalysisResult> {
  // implementation
}
```

### API Documentation

- Document all API endpoints with OpenAPI/Swagger
- Include request/response examples
- Specify authentication requirements
- Document error responses

```yaml
# Example API documentation
/resume/analyze:
  post:
    summary: Analyze resume text
    parameters:
      - name: text
        in: body
        required: true
        schema:
          type: string
    responses:
      200:
        description: Successful analysis
        schema:
          type: object
          properties:
            summary:
              type: string
            role:
              type: string
```

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Clear Title**: Summarize the issue concisely
- **Description**: Detailed description of the problem
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node.js version, browser
- **Screenshots**: If applicable
- **Code Snippets**: Relevant code causing the issue

### Feature Requests

For new features, please include:

- **Use Case**: Why this feature is needed
- **Proposed Solution**: How it should work
- **Alternatives**: Other solutions considered
- **Additional Context**: Screenshots, examples, or references

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation improvements
- `good first issue`: Suitable for newcomers
- `help wanted`: Community contributions welcome

## Community Guidelines

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Discord**: Join our community chat (link in README)

### Communication Guidelines

- Use English for all communications
- Be patient and respectful when asking questions
- Provide context and be specific about your issue
- Search existing issues before creating new ones

### Recognition

Contributors will be recognized in:
- GitHub repository contributors list
- CHANGELOG.md for significant contributions
- Project README acknowledgments

---

Thank you for contributing to the AI Resume & Portfolio Agent! Your efforts help make this project better for everyone in the community. 🚀
