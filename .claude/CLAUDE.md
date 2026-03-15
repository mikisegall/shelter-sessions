# Shelter Learning App - Project Context

## Project Overview
An offline-first mobile learning app for Android that delivers curated 10-15 minute learning sessions on diverse topics. Designed for use in areas without cellular reception.

**Platform:** Android (OnePlus device)
**Framework:** React Native
**Architecture:** Offline-first with periodic sync

## Current Phase
**Phase 0:** Foundation & environment setup
See `IMPLEMENTATION_PLAN.md` for full roadmap.

---

## 🤖 Claude Collaboration Guidelines

### Autonomy & Decision Making
**Default Mode: Autonomous Execution**

When the user asks you to complete a task, you should:
- **Make reasonable decisions without asking** unless there are multiple valid architectural approaches
- **Fix errors you encounter** - debug and iterate until tests pass
- **Run all necessary validation steps** automatically (type-check, test-topics.js, etc.)
- **Handle edge cases** - if you find issues while implementing, fix them proactively
- **Complete the full workflow** - don't stop halfway for approval unless explicitly asked

**When to Ask Questions:**
- Multiple valid architectural approaches exist
- Unclear requirements that could lead to significant rework
- Security or privacy implications
- Breaking changes to existing functionality

**When NOT to Ask:**
- Implementation details (variable names, file structure within conventions)
- Bug fixes encountered during implementation
- Validation steps (always run them)
- Commit message wording (follow conventions below)

### Adding Topics Workflow

**When user requests new topics, automatically:**
1. Create JSON files following existing schema in `content/topics/`
2. Validate with `node test-topics.js`
3. Run `npm run type-check`
4. If validation passes: stage files but **wait for user review before committing**
5. If validation fails: debug and fix until it passes
6. Show created files for review

**Commit message format:**
```
content: Add [topic-name] topic

Or for multiple:
content: Add topics for [X, Y, Z]
```

**User preference:** Review content before commits, but you can auto-fix validation errors.

### Validation & Quality Checks

**Always run before marking a task complete:**
- `npm run type-check` - TypeScript validation
- `node test-topics.js` - Topic content validation (when topics are modified)
- `npm run lint` - Code quality (for source code changes)
- Manual review of generated content files

**If validation fails:**
- Debug the issue yourself
- Fix and re-validate
- Only surface to user if you cannot resolve after reasonable attempts

### Build & Deployment

**Before any build or deployment:**
1. Run `npm run validate-build` (includes bundling and topic validation)
2. Fix any issues found
3. Verify all topic JSON files are committed to git
4. Only then proceed with build commands

**User preference:** Validate thoroughly before builds to avoid iteration cycles.

### Commit Workflow

**Default behavior:**
- For content additions (topics): Stage files, show for review, wait for commit approval
- For bug fixes: Auto-commit with clear message if tests pass
- For features: Complete implementation, validate, then ask about commit

**Commit message format (strictly follow):**
```
<type>: <description>

Types:
- content: Topic additions or content changes
- feat: New features
- fix: Bug fixes
- refactor: Code improvements without behavior change
- docs: Documentation updates
- chore: Tooling, dependencies, config
```

### Error Handling Philosophy

**When you encounter errors:**
1. Read the full error message and stack trace
2. Check relevant files and configuration
3. Apply fix based on error analysis
4. Re-run validation
5. Only escalate if multiple fix attempts fail

**Common patterns to auto-fix:**
- Missing dependencies → check package.json and suggest install
- Type errors → add proper types or fix type mismatches
- Linting errors → apply fixes automatically
- Test failures → debug and fix the underlying issue

### Iteration Speed

**Optimize for speed by:**
- Batching related tasks (create + validate + stage)
- Running validations in parallel when possible
- Making incremental commits for large features
- Fixing small issues immediately rather than noting them
- Using existing patterns from codebase without asking

**User expectation:** Fast iteration, minimal back-and-forth, autonomous problem-solving.

---

## Development Commands

### Setup & Installation
```bash
# Install dependencies
npm install

# Install Expo CLI (if using Expo)
npm install -g expo-cli

# Start development server
npm start

# Run on Android
npm run android
```

### Testing & Quality
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### Build & Deploy
```bash
# Build Android APK
npm run build:android

# Build production bundle
npm run build
```

---

## Code Style & Conventions

### General Principles
- **Offline-first:** All features must work without network connectivity
- **Mobile performance:** Optimize for battery life and smooth UI
- **Incremental development:** Build, validate, iterate
- **Test before moving on:** Each phase must be validated before proceeding

### TypeScript Standards
- Use TypeScript for all new code
- Enable strict mode
- Define explicit interfaces for all data structures
- Use type inference where obvious, explicit types otherwise
- No `any` types except for rare third-party integration edge cases

### React Native Best Practices

**Component Structure:**
- Use functional components with hooks
- Keep components small and focused (< 200 lines)
- Extract reusable logic into custom hooks
- Use memo() for expensive renders

**File Organization:**
```
src/
├── components/       # Reusable UI components
│   ├── common/       # Shared components (Button, Card, etc.)
│   └── topic/        # Topic-specific components
├── screens/          # Screen components
├── navigation/       # Navigation configuration
├── services/         # Business logic
│   ├── storage/      # Local storage (AsyncStorage/SQLite)
│   ├── sync/         # Content sync logic
│   └── content/      # Content management
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── constants/        # App constants
```

**Naming Conventions:**
- Components: PascalCase (e.g., `TopicViewer.tsx`)
- Files: camelCase for utilities, PascalCase for components
- Hooks: camelCase with `use` prefix (e.g., `useTopicSelection.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_TOPICS`)
- Interfaces/Types: PascalCase with descriptive names (e.g., `TopicContent`)

**State Management:**
- Use Context API for global state (avoid Redux for MVP)
- Keep component state local when possible
- Use custom hooks for shared state logic

**Styling:**
- Use StyleSheet.create() for performance
- Define styles at bottom of component file
- Use theme constants for colors/spacing
- Mobile-first, responsive design

### Data Schema Standards

**Topic Structure:**
```typescript
interface Topic {
  id: string;
  title: string;
  category: TopicCategory;
  estimatedReadingTime: number; // minutes
  contentBlocks: ContentBlock[];
  quiz: QuizQuestion[];
  createdAt: string; // ISO 8601
}

interface ContentBlock {
  type: 'intro' | 'key_point' | 'highlight' | 'summary';
  text: string;
  imageUrl?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}
```

### Error Handling
- Always handle async errors with try/catch
- Provide user-friendly error messages
- Log errors for debugging (but not in production)
- Never crash on network errors (offline-first!)

### Performance
- Lazy load images and heavy content
- Use FlatList for long scrollable lists
- Optimize re-renders with useMemo/useCallback
- Profile with React DevTools before optimizing

---

## Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `dev`: Active development
- Feature branches: `feature/phase-X-description`

### Commit Messages
Follow conventional commits:
```
feat: Add topic viewer component
fix: Resolve quiz answer validation
refactor: Extract storage logic to service
docs: Update implementation plan
chore: Add ESLint configuration
```

### Before Committing
- [ ] Code is formatted (Prettier)
- [ ] No linting errors
- [ ] TypeScript compiles without errors
- [ ] Tests pass (when applicable)
- [ ] Tested on physical device (for UI changes)

---

## Testing Strategy

### What to Test
- **Unit tests:** Utility functions, hooks, business logic
- **Integration tests:** Storage, sync, content management
- **Component tests:** Critical UI components
- **E2E tests:** (Later phases) Full user flows

### Test Conventions
- Place tests next to source files: `TopicViewer.test.tsx`
- Use descriptive test names: `it('should display quiz after content is read')`
- Mock external dependencies (storage, network)
- Test offline scenarios explicitly

---

## Security & Privacy

### Data Handling
- Store all content locally (SQLite or AsyncStorage)
- No analytics or tracking in offline mode
- Minimal data collection when online
- No personal information required

### Protected Files
- Never edit: `.env`, `package-lock.json`, `app.json`
- Always review before commit: Native config files

---

## Dependencies Philosophy

### Add Dependencies When:
- Significant functionality is needed (navigation, storage)
- Well-maintained and popular library
- Reduces development time substantially

### Prefer Native Solutions When:
- Simple functionality can be built quickly
- Dependency adds significant bundle size
- Offline-first requirements conflict with library

### Key Dependencies (to be added)
- `@react-navigation/native` - Navigation
- `react-native-sqlite-storage` or `@react-native-async-storage/async-storage` - Local storage
- `axios` - HTTP client for sync
- `react-native-paper` or `native-base` - UI components (TBD)

---

## Development Workflow

### Starting a New Phase
1. Review implementation plan for phase goals
2. Create feature branch
3. Build incrementally with frequent commits
4. Test on physical device
5. Validate against phase criteria
6. Merge to dev when phase is complete

### When Stuck
- Check React Native docs first
- Review similar patterns in codebase
- Ask for clarification on requirements
- Test simpler version first, then enhance

### Before Phase Completion
- [ ] All phase tasks completed
- [ ] Tested on OnePlus device
- [ ] No console warnings/errors
- [ ] Code is clean and commented where necessary
- [ ] Validation criteria met

---

## Notes
- This is an MVP - prioritize functionality over perfection
- Real-world testing (during actual 15-min sessions) is the ultimate validation
- Iterate based on actual usage, not assumptions
- Keep it simple, fast, and reliable
