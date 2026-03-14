# Shelter Sessions

> A mobile learning app designed for offline environments. Learn something new in 15 minutes.

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📱 About

Shelter Sessions is an offline-first mobile learning application that delivers curated educational content in bite-sized sessions. Perfect for areas without cellular reception or for focused learning without distractions.

### ✨ Features

- **📚 17+ Curated Topics** - Finance, Economics, Geopolitics, Technology, Science
- **🔄 Smart Sync** - Download new topics from GitHub Pages when online
- **📖 Browse & Filter** - Find topics by category, completion status
- **❓ Interactive Quizzes** - Test your knowledge after each session
- **📊 Progress Tracking** - Monitor completed topics and quiz performance
- **🌙 Dark Mode** - Easy on the eyes in any environment
- **✈️ 100% Offline** - All content works without internet after initial sync
- **🎨 Category Colors** - Visual organization with color-coded categories

### 🎯 Use Cases

- Learning during commutes (no signal areas)
- Offline study sessions
- Educational content for remote locations
- Focused reading without internet distractions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android device or emulator (iOS support coming soon)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/shelter-sessions.git
cd shelter-sessions

# Install dependencies
npm install

# Start development server
npm start
```

### Run on Device

1. Install [Expo Go](https://expo.dev/go) on your Android device
2. Scan the QR code from the terminal
3. App will load on your device

### Build APK

See [QUICK_START.md](./QUICK_START.md) for the fastest way to build, or [BUILDING_APK.md](./BUILDING_APK.md) for comprehensive build documentation.

```bash
# Login to Expo
eas login

# Build preview APK (~15 minutes)
eas build --platform android --profile preview

# Download and install on your device
```

---

## 📂 Project Structure

```
shelter-sessions/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (buttons, cards)
│   │   └── topic/           # Topic-specific components
│   ├── constants/           # Theme, colors, topic library
│   ├── screens/             # Main app screens
│   │   ├── HomeScreen.tsx
│   │   ├── TopicSelectionScreen.tsx
│   │   ├── SwipeableTopicScreen.tsx
│   │   └── DebugScreen.tsx
│   ├── services/            # Business logic
│   │   ├── storage/         # AsyncStorage operations
│   │   └── sync/            # Content sync from GitHub
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── content/topics/          # Bundled topics (5)
├── public/topics/           # Synced topics from GitHub Pages
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── eas.json                 # Build configuration
└── package.json
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator (requires macOS)

# Quality Checks
npm run type-check     # TypeScript type checking
npm run lint           # ESLint code linting
npm run format         # Prettier code formatting
npm test               # Run Jest tests
npm run test:coverage  # Run tests with coverage

# Build
eas build --platform android --profile preview     # Preview APK
eas build --platform android --profile production  # Production APK
```

### Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript (strict mode)
- **Storage:** AsyncStorage for local persistence
- **Navigation:** Custom state-based navigation
- **Styling:** React Native StyleSheet with theme system
- **Testing:** Jest + React Native Testing Library
- **Build:** EAS Build (cloud-based)

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for consistent formatting
- Functional components with React Hooks
- Offline-first architecture

---

## 📖 Content Management

### Adding New Topics

1. Create a JSON file in `public/topics/` following the schema:

```json
{
  "id": "unique-topic-id",
  "title": "Topic Title",
  "category": "finance",
  "estimatedReadingTime": 12,
  "tags": ["tag1", "tag2"],
  "contentBlocks": [
    {
      "type": "intro",
      "text": "Introduction text..."
    },
    {
      "type": "key_point",
      "text": "Main content..."
    }
  ],
  "quiz": [
    {
      "question": "Quiz question?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct..."
    }
  ]
}
```

2. Update `public/topics/manifest.json`:

```json
{
  "version": "2.0.0",
  "lastUpdated": "2026-03-14T18:00:00Z",
  "topics": [
    {
      "id": "unique-topic-id",
      "filename": "unique-topic-id.json",
      "category": "finance"
    }
  ]
}
```

3. Commit and push to GitHub
4. Users tap "Sync" in the app to download new content

**No app rebuild needed!** Content updates via GitHub Pages.

### Content Schema

See [src/types/content.ts](./src/types/content.ts) for the complete TypeScript schema.

**Content Block Types:**
- `intro` - Topic introduction
- `key_point` - Main content section
- `highlight` - Important callout
- `summary` - Conclusion and key takeaways

**Categories:**
- Finance (green)
- Economics (orange)
- Geopolitics (red)
- Technology (blue)
- Science (purple)
- Culture (pink)

---

## 🎨 Design System

### Theme

See [src/constants/theme.ts](./src/constants/theme.ts) for the complete theme configuration.

**Colors:**
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Category-specific accent colors

**Typography:**
- Sizes: xs (12px) to heading (32px)
- Weights: normal, medium, semibold, bold
- Line heights: tight (1.25), normal (1.5), relaxed (1.75)

**Spacing:**
- xs (4px), sm (8px), md (12px), base (16px), lg (20px), xl (24px), xxl (32px)

**Dark Mode:**
- Fully supported with separate color palette
- Automatic contrast adjustments
- Consistent visual hierarchy

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- Unit tests for services and utilities
- Integration tests for sync functionality
- Component tests for critical UI elements

See [src/services/sync/__tests__/](./src/services/sync/__tests__/) for examples.

---

## 🏗️ Architecture

### Offline-First Design

1. **Bundled Content** - 5 topics included in the app
2. **Downloaded Content** - Synced from GitHub Pages and stored locally
3. **Merged Library** - Unified topic list, deduplicated by ID
4. **Graceful Degradation** - All features work offline

### State Management

- React Context API for global state (dark mode, navigation)
- AsyncStorage for persistence
- Component-level state for UI
- Custom hooks for shared logic

### Content Sync Flow

```
User taps "Sync"
    ↓
Fetch manifest.json from GitHub Pages
    ↓
Compare with local synced IDs
    ↓
Download new topic JSON files
    ↓
Save to AsyncStorage
    ↓
Merge with bundled topics
    ↓
Update UI
```

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Fast 3-command APK build guide
- **[BUILDING_APK.md](./BUILDING_APK.md)** - Comprehensive build documentation
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Original development roadmap
- **[FEEDBACK.md](./FEEDBACK.md)** - User feedback and iteration notes

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Areas

- 📝 **Content:** Add new topics (finance, tech, science, etc.)
- 🐛 **Bug Fixes:** Report or fix issues
- ✨ **Features:** Suggest or implement new functionality
- 📖 **Docs:** Improve documentation
- 🎨 **Design:** UI/UX improvements

### Code Standards

- Follow the existing code style (ESLint + Prettier)
- Write TypeScript with strict typing
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
- Content hosted on [GitHub Pages](https://pages.github.com/)
- Designed for offline learning in challenging environments

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/shelter-sessions/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/shelter-sessions/discussions)

---

## 🗺️ Roadmap

- [ ] iOS support
- [ ] Bookmark specific content blocks
- [ ] Note-taking within sessions
- [ ] Export quiz results
- [ ] Multi-language support
- [ ] Voice narration for content
- [ ] Spaced repetition for quiz questions

---

**Made with ❤️ for learners everywhere**
