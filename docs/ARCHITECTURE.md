# Architecture Documentation

## Overview

Shelter Sessions is built with an offline-first architecture, ensuring all core functionality works without network connectivity. Content sync is an optional enhancement that runs in the background.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ HomeScreen   │  │ TopicSelect  │  │ SwipeableTopic│      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Topic Library                           │   │
│  │  - Merges bundled + downloaded topics                │   │
│  │  - Deduplicates by ID                                │   │
│  │  - Provides unified interface                        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────┐          ┌──────────────────────┐    │
│  │  Content Sync     │          │  Progress Tracking   │    │
│  │  - Manifest fetch │          │  - Completion state  │    │
│  │  - Topic download │          │  - Quiz scores       │    │
│  │  - ID tracking    │          │  - Session stats     │    │
│  └──────────────────┘          └──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
          │                           │
          ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Persistence Layer                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AsyncStorage                             │   │
│  │  - downloaded_topics: Topic[]                        │   │
│  │  - synced_topic_ids: string[]                        │   │
│  │  - completed_topic_ids: string[]                     │   │
│  │  - session_stats: SessionStats                       │   │
│  │  - last_sync_time: ISO timestamp                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          GitHub Pages (Content Delivery)             │   │
│  │  - public/topics/manifest.json                       │   │
│  │  - public/topics/*.json                              │   │
│  │  - Read-only, no authentication                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Principles

### 1. Offline-First

**Implementation:**
- All content stored locally in AsyncStorage
- Bundled topics (5) included in app bundle
- Downloaded topics persisted locally
- No network calls required for core functionality

**Benefits:**
- Works in areas without cellular reception
- Fast, instant loading
- No data costs for users
- Reliable user experience

### 2. Manifest-Based Sync

**Why manifest-based?**
- Single fetch to discover all available content
- Efficient - only download new topics
- Version tracking
- Easy to update (just commit to GitHub)

**Sync Flow:**
```
1. Fetch manifest.json
   ↓
2. Get local synced IDs
   ↓
3. Compare and find new topics
   ↓
4. Download new topic JSONs
   ↓
5. Update local storage
   ↓
6. Refresh UI
```

### 3. Two-Tier Content System

**Bundled Topics (Tier 1):**
- 5 core topics included in app
- Always available, even on first launch
- Located in `content/topics/`
- Compiled into app bundle

**Downloaded Topics (Tier 2):**
- Synced from GitHub Pages
- Stored in AsyncStorage
- Updated when user taps "Sync"
- No app rebuild needed

**Merging Logic:**
```typescript
const getTopicLibrary = async (): Promise<Topic[]> => {
  const bundledTopics = TOPIC_LIBRARY; // From bundle
  const downloadedTopics = await getDownloadedTopics(); // From storage

  // Merge and deduplicate by ID
  const allTopics = [...bundledTopics, ...downloadedTopics];
  const uniqueTopics = Array.from(
    new Map(allTopics.map(t => [t.id, t])).values()
  );

  return uniqueTopics;
};
```

### 4. Category-Based Organization

**Color Coding:**
- Finance: Green (#10B981)
- Economics: Orange (#F59E0B)
- Geopolitics: Red (#EF4444)
- Technology: Blue (#3B82F6)
- Science: Purple (#8B5CF6)
- Culture: Pink (#EC4899)

**Visual Consistency:**
- Progress bars use category colors
- Topic cards have colored borders
- Category badges show category color
- Consistent across light/dark modes

---

## Data Flow

### Reading a Topic

```
User taps "Start Session"
    ↓
HomeScreen → getTopicLibrary()
    ↓
Topic Library merges bundled + downloaded
    ↓
Filter by completion status
    ↓
Random selection from unread topics
    ↓
Pass Topic to SwipeableTopicScreen
    ↓
Render content blocks + quiz
    ↓
User completes session
    ↓
Save completion state to AsyncStorage
    ↓
Update stats and refresh UI
```

### Syncing New Content

```
User taps "Sync" (or auto-sync on app launch)
    ↓
syncTopics() called
    ↓
Fetch manifest.json from GitHub
    ↓
Get local synced_topic_ids from AsyncStorage
    ↓
If first sync: mark bundled topics as synced
    ↓
Find topics in manifest not in synced list
    ↓
Download each new topic JSON
    ↓
Append to downloaded_topics in AsyncStorage
    ↓
Update synced_topic_ids
    ↓
Save last_sync_time
    ↓
Refresh UI with new topics available
```

---

## State Management

### Global State (React Context)
- Dark mode preference
- Current navigation state
- Theme colors

### Local Storage (AsyncStorage)
- Downloaded topics
- Synced topic IDs
- Completed topic IDs
- Session statistics
- Last sync timestamp

### Component State
- Current card index (swiping)
- Quiz answers
- Filter selections
- UI state (loading, errors)

---

## Performance Optimizations

### 1. Lazy Loading
- Topics loaded on-demand
- Images not preloaded
- AsyncStorage reads minimized

### 2. Deduplication
- Topics deduplicated by ID
- Synced IDs prevent re-downloads
- Bundled topics marked as synced on first launch

### 3. Efficient Rendering
- FlatList for topic lists (virtualization)
- StyleSheet.create for style optimization
- Memo for expensive components

### 4. Network Optimization
- 10-second timeout on fetch requests
- AbortController for cancellation
- Graceful offline fallback
- No-cache headers for fresh content

---

## Security Considerations

### Data Privacy
- No user authentication required
- No personal data collected
- No analytics or tracking
- All data stored locally on device

### Content Delivery
- Read-only GitHub Pages
- No API keys required
- Public content only
- No sensitive data in topics

### Local Storage
- AsyncStorage (unencrypted)
- Suitable for non-sensitive educational content
- No credentials stored

---

## Scalability

### Content Scaling
- **Current:** 17 topics
- **Tested:** Up to 100 topics
- **Limit:** AsyncStorage max size (~6MB)
- **Strategy:** Paginate topic downloads if needed

### User Scaling
- Fully client-side (no server)
- Scales infinitely (static hosting)
- No backend costs
- CDN-friendly (GitHub Pages)

---

## Error Handling

### Network Errors
- Silent failure on sync errors
- User can retry manually
- Offline mode always works
- No crashes on network issues

### Storage Errors
- Fallback to bundled topics
- Console logging for debugging
- Graceful degradation
- Default values when storage fails

### Content Errors
- Skip invalid topics during sync
- Continue with valid topics
- Log errors for debugging
- Don't crash the app

---

## Testing Strategy

### Unit Tests
- Sync functions (manifest fetch, topic download)
- Storage operations
- Topic library merging
- Utility functions

### Integration Tests
- Full sync flow
- Topic library with bundled + downloaded
- Progress tracking
- Dark mode switching

### Manual Testing
- Offline functionality
- Sync with slow network
- Dark mode in all screens
- Quiz interaction
- Progress persistence

---

## Future Architecture Considerations

### Potential Enhancements
1. **SQLite Migration** - For better performance with 100+ topics
2. **Incremental Sync** - Download topics in batches
3. **Content Compression** - Reduce storage size
4. **Cache Invalidation** - Smart cache updates
5. **Search Indexing** - Full-text search across topics

### iOS Support
- No architecture changes needed
- Same AsyncStorage approach
- Dark mode already compatible
- Build configuration only

---

## Development Workflow

### Adding a New Screen
1. Create screen component in `src/screens/`
2. Define props interface
3. Add navigation logic in App.tsx
4. Update state management if needed
5. Add tests

### Adding a New Feature
1. Update types if needed (`src/types/`)
2. Implement business logic (`src/services/`)
3. Add tests
4. Update UI components
5. Update documentation

### Modifying Content Schema
1. Update `src/types/content.ts`
2. Update topic JSON schema
3. Add migration for existing data
4. Update documentation
5. Test with old and new content

---

## Deployment

### Content Updates
1. Add/edit JSON in `public/topics/`
2. Update `public/topics/manifest.json`
3. Commit to main branch
4. GitHub Pages auto-deploys
5. Users sync to get updates

### App Updates
1. Update version in `app.json`
2. Build APK with EAS
3. Test on device
4. Distribute APK
5. Users install manually

---

## Monitoring & Debugging

### Debug Tools
- **Debug Screen** - View sync state, topics, IDs
- **Console Logging** - Extensive logs for sync flow
- **React DevTools** - Component inspection
- **Expo DevTools** - Network, storage inspection

### Common Issues
- **Sync not working**: Check network, GitHub URLs
- **Topics not showing**: Clear AsyncStorage, re-sync
- **Dark mode issues**: Check theme context
- **Quiz not saving**: Check AsyncStorage permissions

---

## References

- [React Native Architecture](https://reactnative.dev/architecture/overview)
- [Expo Documentation](https://docs.expo.dev/)
- [AsyncStorage API](https://react-native-async-storage.github.io/async-storage/)
- [Offline-First Architecture](https://offlinefirst.org/)
