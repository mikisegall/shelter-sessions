# Shelter Sessions - Quick Start Guide

## Build Your APK in 3 Commands

```bash
# 1. Login to Expo
eas login

# 2. Build the APK (takes ~15 minutes)
eas build --platform android --profile preview

# 3. Download from the link provided, install on your phone
```

That's it! ☕

---

## Full Documentation

- **[BUILDING_APK.md](./BUILDING_APK.md)** - Complete build guide with troubleshooting
- **[BUILD_README.md](./BUILD_README.md)** - Original build notes (alternative methods)

---

## What You Have

### App Features
✅ 17 curated learning topics (finance, economics, geopolitics)
✅ Browse and select any topic
✅ 10-15 minute reading sessions
✅ Quiz questions with explanations
✅ Progress tracking
✅ Dark mode
✅ 100% offline functionality
✅ Sync new topics from GitHub
✅ Debug tools (dev mode)

### Content Categories
- **Finance** (5): FTX, SVB, Credit Suisse, GameStop, more
- **Economics** (4): Argentina, China, Japan, UK
- **Geopolitics** (4): Saudi petroyuan, Wagner, Ukraine, Armenia
- **Technology** (2): AI alignment, Quantum computing
- **Science** (2): CRISPR, Microplastics

---

## Adding New Topics

1. Create JSON file in `public/topics/`
2. Update `public/topics/manifest.json`
3. Commit and push to GitHub
4. Users tap "🔄 Check for New Topics" in app

**No rebuild needed!** Content syncs from GitHub Pages.

---

## Development Commands

```bash
# Run in Expo Go
npm start

# Type check
npm run type-check

# Run tests
npm test

# Build preview APK
eas build --platform android --profile preview

# Build production APK
eas build --platform android --profile production
```

---

## Project Structure

```
shelter-fun/
├── src/
│   ├── screens/          # HomeScreen, TopicSelectionScreen, SwipeableTopicScreen
│   ├── components/       # Reusable UI components
│   ├── services/         # Storage, sync logic
│   ├── types/            # TypeScript definitions
│   └── constants/        # Theme, topic library
├── content/topics/       # Bundled topics (5)
├── public/topics/        # Synced topics (GitHub Pages)
├── App.tsx               # Root component
└── eas.json              # Build configuration
```

---

## Architecture

**Offline-First:**
- All content stored locally (AsyncStorage)
- App works 100% without internet
- Sync is optional for new content

**Content Delivery:**
- 5 topics bundled in app
- 12+ topics sync from GitHub Pages
- Manifest-based updates
- No app rebuild needed for new topics

**Build Process:**
- Cloud builds via EAS (no Android Studio)
- APK ready in ~15 minutes
- Free tier: 30 builds/month

---

## Key Files

- **app.json** - App configuration, version number
- **eas.json** - Build profiles (preview/production)
- **public/topics/manifest.json** - Available topics for sync
- **src/constants/topicLibrary.ts** - Topic management
- **src/services/sync/contentSync.ts** - Sync logic

---

## Support

Issues or questions? Check:
- [BUILDING_APK.md](./BUILDING_APK.md) - Detailed build guide
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [GitHub Issues](https://github.com/anthropics/claude-code/issues)

---

## Next Steps

1. **Build your first APK** (follow commands above)
2. **Install on your phone**
3. **Test all features**
4. **Add more topics** (I can help generate them!)
5. **Share the APK** with friends

Enjoy your learning sessions! 📚
