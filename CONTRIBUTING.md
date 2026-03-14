# Contributing to Shelter Sessions

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to Shelter Sessions.

## 🎯 Ways to Contribute

### 1. 📝 Add New Topics

The easiest and most impactful way to contribute is by adding educational content!

**What makes a great topic:**
- Specific, timely events with broader implications (e.g., "FTX Collapse 2022")
- Real-world case studies over general explainers
- 10-15 minute reading time
- Interesting to people interested in finance, economics, geopolitics, technology, or science
- Includes interactive quiz questions

**How to add a topic:**

1. Create a JSON file in `public/topics/` (see template below)
2. Update `public/topics/manifest.json` to include your topic
3. Submit a Pull Request

**Topic Template:**

```json
{
  "id": "unique-kebab-case-id",
  "title": "Your Topic Title",
  "category": "finance",
  "estimatedReadingTime": 12,
  "tags": ["relevant", "tags", "here"],
  "contentBlocks": [
    {
      "type": "intro",
      "text": "Hook the reader with why this topic matters. Keep it concise (2-3 sentences)."
    },
    {
      "type": "key_point",
      "text": "## Background\n\nProvide essential context. What happened? Who was involved?"
    },
    {
      "type": "key_point",
      "text": "## What Happened\n\nDescribe the main events chronologically."
    },
    {
      "type": "highlight",
      "text": "💡 **Key Insight:** Pull out important quotes, stats, or insights that readers should remember."
    },
    {
      "type": "key_point",
      "text": "## Implications\n\nWhy does this matter? What are the broader consequences?"
    },
    {
      "type": "summary",
      "text": "Summarize the key takeaways in 3-5 bullet points:\n\n• Takeaway 1\n• Takeaway 2\n• Takeaway 3"
    }
  ],
  "quiz": [
    {
      "question": "What was the primary cause of [event]?",
      "options": [
        "Correct answer with specific detail",
        "Plausible but incorrect",
        "Common misconception",
        "Too extreme to be true"
      ],
      "correctAnswer": 0,
      "explanation": "Explain why the correct answer is right and add context."
    },
    {
      "question": "What was the outcome of [event]?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 2,
      "explanation": "Provide additional insight or connect to broader themes."
    }
  ]
}
```

**Content Guidelines:**
- Use clear, accessible language (avoid jargon without explanation)
- Include specific dates, numbers, and facts
- Cite sources in the text where relevant
- Make it engaging - this is for learning, not just information
- 3-5 quiz questions per topic

**Categories:**
- `finance` - Financial markets, companies, banking, crypto
- `economics` - Economic policy, inflation, trade, monetary systems
- `geopolitics` - International relations, conflicts, diplomacy
- `technology` - Tech companies, AI, platforms, regulation
- `science` - Scientific discoveries, health, environment
- `culture` - Media, society, cultural phenomena

### 2. 🐛 Report Bugs

Found a bug? Please create an issue with:

- **Clear title:** "Bug: [Short description]"
- **Steps to reproduce:** How can we recreate the issue?
- **Expected behavior:** What should happen?
- **Actual behavior:** What actually happens?
- **Environment:** Device, Android version, app version
- **Screenshots:** If applicable

### 3. 💡 Suggest Features

Have an idea? Create an issue with:

- **Clear title:** "Feature: [Short description]"
- **Use case:** Why is this useful?
- **Proposed solution:** How might it work?
- **Alternatives considered:** Other approaches you've thought about

### 4. 🔧 Code Contributions

**Before starting:**
1. Check existing issues/PRs to avoid duplicates
2. For large changes, open an issue first to discuss
3. Fork the repository and create a branch

**Development setup:**

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/shelter-sessions.git
cd shelter-sessions

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/shelter-sessions.git

# Install dependencies
npm install

# Start development server
npm start
```

**Making changes:**

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Run quality checks
npm run type-check
npm run lint
npm run format
npm test

# Commit with clear message
git commit -m "feat: Add your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

**Commit message format:**

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
- `feat: Add bookmark functionality`
- `fix: Resolve sync timeout on slow connections`
- `docs: Update content schema documentation`

### 5. 📖 Improve Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples or diagrams
- Improve code comments
- Translate documentation

## 🔍 Code Review Process

1. **Submit PR:** Create a pull request with a clear description
2. **Automated checks:** Tests and linting must pass
3. **Review:** A maintainer will review your code
4. **Feedback:** Address any requested changes
5. **Merge:** Once approved, your PR will be merged

**What we look for:**
- Code follows existing style and patterns
- Tests are included for new features
- Documentation is updated
- No breaking changes (or clearly documented)
- TypeScript types are correct

## 📋 Code Standards

### TypeScript

- Use strict mode (already configured)
- Explicit types for function parameters and return values
- Use interfaces for objects
- Avoid `any` (use `unknown` if needed)

```typescript
// Good
interface TopicData {
  id: string;
  title: string;
  category: string;
}

const getTopic = (id: string): TopicData | null => {
  // ...
};

// Avoid
const getTopic = (id: any): any => {
  // ...
};
```

### React Components

- Functional components with hooks
- Props interfaces defined
- Descriptive component names
- Extract complex logic to custom hooks

```typescript
interface MyComponentProps {
  title: string;
  onPress: () => void;
  isDarkMode?: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
  isDarkMode = false,
}) => {
  // Component logic
};
```

### Styling

- Use StyleSheet.create()
- Define styles at bottom of component file
- Use theme constants for colors/spacing
- Avoid inline styles except for dynamic values

```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
  },
});
```

### File Organization

- Place files in appropriate directories
- Co-locate tests with source files
- Use index files for clean imports
- Follow existing naming conventions

## 🧪 Testing

- Write tests for new features
- Update tests when changing existing code
- Aim for good coverage of business logic
- Use descriptive test names

```typescript
describe('syncTopics', () => {
  it('should download new topics from manifest', async () => {
    // Test implementation
  });

  it('should handle network errors gracefully', async () => {
    // Test implementation
  });
});
```

## 🤔 Questions?

- Open a [Discussion](https://github.com/yourusername/shelter-sessions/discussions)
- Comment on an existing issue
- Reach out to maintainers

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

## 🙏 Thank You!

Every contribution helps make Shelter Sessions better for learners everywhere. We appreciate your time and effort!
