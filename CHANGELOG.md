# Changelog

All notable changes to Shelter Sessions will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- iOS support
- Bookmark specific content blocks
- Note-taking within sessions
- Export quiz results
- Multi-language support

---

## [1.0.0] - 2026-03-14

### Added
- **Core Features**
  - Offline-first mobile learning app
  - 17+ curated topics across 6 categories
  - Swipeable content card interface
  - Interactive quiz questions with explanations
  - Progress tracking (completed topics, quiz scores)
  - Dark mode support

- **Content Management**
  - Bundled topics (5 included in app)
  - Content sync from GitHub Pages
  - Manifest-based updates (no app rebuild needed)
  - Topic filtering by category and completion status
  - Browse and select specific topics

- **UI/UX**
  - Category-specific color coding
  - Clean, minimalist design
  - Responsive dark mode
  - Progress indicators
  - Intuitive navigation

- **Developer Features**
  - TypeScript with strict mode
  - Comprehensive test coverage
  - ESLint + Prettier configuration
  - Debug screen for development
  - EAS Build configuration

### Technical Details
- React Native 0.81.5
- Expo SDK 54
- AsyncStorage for local persistence
- GitHub Pages for content delivery
- Jest for testing
- TypeScript 5.9

---

## Development Timeline

### Phase 0: Foundation (Complete)
- Project setup with Expo SDK 54
- TypeScript configuration
- Basic app structure

### Phase 1: Content System (Complete)
- Content type definitions
- Topic library implementation
- Sample topics created

### Phase 2: UI Components (Complete)
- SwipeableTopicScreen with content cards
- QuizCard component
- ContentCard component
- Theme system with category colors

### Phase 3: Progress Tracking (Complete)
- AsyncStorage integration
- Session stats tracking
- Quiz scoring
- Completion tracking

### Phase 4: Content Sync (Complete)
- GitHub Pages integration
- Manifest-based sync
- Offline-first architecture
- Topic deduplication

### Phase 5: Polish & Publishing (Complete)
- Topic selection screen
- Category filtering
- UI refinements
- Dark mode improvements
- Documentation
- EAS Build setup

---

## Future Versions

### [1.1.0] - Planned
- Bookmark functionality
- Improved search and filtering
- Topic recommendations
- User feedback collection

### [1.2.0] - Planned
- Note-taking within sessions
- Export quiz results
- Study streak tracking
- Achievement system

### [2.0.0] - Future
- iOS support
- Multi-language content
- Voice narration
- Spaced repetition system
- Community-contributed topics

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
