# Shelter Learning App - Implementation & Testing Plan

## Project Overview
An offline-first mobile learning app for 10-15 minute sessions in areas without cellular reception. Each session presents one curated topic with digestible content and self-assessment quizzes.

**Target Platform:** Android (OnePlus)
**Tech Stack:** Flutter or React Native (to be decided in Phase 0)

---

## Phase 0: Foundation & Tech Decisions
**Goal:** Make core technical decisions and set up development environment

### Tasks:
1. **Choose Framework** (Flutter vs React Native)
   - Criteria: Development speed, offline capabilities, UI component libraries
   - Decision point: Which has better offline-first data management?

2. **Set up development environment**
   - Install chosen framework
   - Set up Android emulator / physical device testing
   - Create project structure

### Validation:
- [ ] "Hello World" app runs on your OnePlus device
- [ ] Can build and deploy to device successfully

**Estimated Time:** 1-2 hours

---

## Phase 1: Content Curation Pipeline (Backend/Script)
**Goal:** Figure out how to source, curate, and format content before building the app

### Why First:
Content is the core value. No point building the app if we can't generate good content.

### Tasks:
1. **Define content schema**
   ```
   Topic:
   - id
   - title
   - category (science, history, tech, culture, etc.)
   - estimated_reading_time
   - content_blocks: [
       { type: "intro", text: "..." }
       { type: "key_point", text: "...", image_url?: "..." }
       { type: "highlight", text: "..." }
       { type: "summary", text: "..." }
     ]
   - quiz: [
       { question, options, correct_answer, explanation }
     ]
   - created_at
   ```

2. **Create content generation script**
   - Option A: Manual curation (Wikipedia + your summaries)
   - Option B: AI-assisted (use Claude API to summarize articles)
   - Option C: Hybrid (find articles, AI summarizes, you review)

3. **Generate 5 sample topics** across different categories
   - Science: e.g., "How CRISPR Gene Editing Works"
   - Tech: e.g., "The Story Behind Git's Creation"
   - History: e.g., "The Real Story of the Trojan Horse"
   - Culture: e.g., "Why Japanese Breakfast is So Different"
   - Philosophy: e.g., "The Paradox of Choice"

4. **Manual review and refinement**
   - Read each topic yourself
   - Time yourself (should be 10-15 min)
   - Adjust format/length as needed

### Validation:
- [ ] 5 topics in JSON format
- [ ] Each topic takes 10-15 minutes to read
- [ ] Content feels engaging and digestible
- [ ] Quizzes make sense and test comprehension

**Output:** `content/topics/` directory with 5 JSON files

**Estimated Time:** 4-6 hours (including experimentation)

---

## Phase 2: Simple Content Viewer (Mobile App MVP)
**Goal:** Build the simplest possible app that can display one topic offline

### Tasks:
1. **Set up app structure**
   - Create basic navigation
   - Set up local storage (SQLite/Hive/SQLite)

2. **Hardcode 1 topic** in the app
   - Bundle the JSON directly in the app code
   - No sync, no selection - just display

3. **Build topic viewer UI**
   - Render different content block types
   - Support text, highlights, images (if included)
   - Simple scrolling interface

4. **Add basic quiz UI**
   - Multiple choice questions
   - Show correct/incorrect feedback
   - Display explanation after answer

### Validation:
- [ ] App displays one complete topic
- [ ] Can read through content smoothly
- [ ] Quiz is interactive and shows results
- [ ] Works with airplane mode ON (no network)
- [ ] **YOU test it during one of your 15-min sessions**

**Estimated Time:** 6-8 hours

---

## Phase 3: Multi-Topic Selection & Progress
**Goal:** Support multiple topics and let user start new sessions

### Tasks:
1. **Bundle 5 topics** from Phase 1 into app

2. **Add session management**
   - "Start New Session" button
   - Select random unread topic
   - Mark topics as "completed"

3. **Add progress tracking**
   - Store which topics have been read
   - Show "X topics available" indicator
   - Simple stats: "You've completed 3 topics"

4. **Improve UI**
   - Home screen with session start
   - Topic selection logic (random from unread)
   - Basic progress display

### Validation:
- [ ] Can complete multiple sessions in a row
- [ ] Each session shows a different topic
- [ ] Progress is saved between app restarts
- [ ] **Test for a full week during your daily sessions**
- [ ] Gather feedback: Is variety good? Content quality? Length?

**Estimated Time:** 4-6 hours

---

## Phase 4: Content Refresh Mechanism
**Goal:** Add ability to download new content without app updates

### Decision Point: Choose Backend Approach
**Option A: Static Hosting (Simplest)**
- Host JSON files on GitHub Pages / S3
- App downloads files periodically
- You manually add new topics by uploading files

**Option B: Simple Backend API**
- Basic Node.js/Python API
- Serves topics via REST endpoint
- Allows for user preferences later

**Recommendation:** Start with Option A (static files)

### Tasks:
1. **Set up static content hosting**
   - Create GitHub repo or S3 bucket
   - Upload topic JSON files
   - Set up CORS if needed

2. **Add sync functionality to app**
   - Check for new topics when online
   - Download and store locally
   - Update local database

3. **Add sync status UI**
   - Show "X topics downloaded"
   - Show "X topics remaining to read"
   - Manual "Sync Now" button
   - Auto-sync when app opens (if online)

4. **Handle updates gracefully**
   - Don't re-download existing topics
   - Keep completed status across syncs

### Validation:
- [ ] Add 3 new topics to hosting
- [ ] App detects and downloads them
- [ ] Sync works on WiFi and mobile data
- [ ] Offline mode still works after sync
- [ ] **Test sync behavior for one week**

**Estimated Time:** 6-8 hours

---

## Phase 5: Content Variety & Format Testing
**Goal:** Experiment with different content formats based on real usage

### Tasks:
1. **Create topics with different formats**
   - Text-heavy article style
   - Visual/diagram focused
   - List/bullet point style
   - Q&A format
   - Story narrative format

2. **Add format tags to topics**
   - Track which format each topic uses
   - (Prepare for future analytics)

3. **Generate 10 more topics** across formats

4. **Add simple feedback mechanism**
   - "Was this interesting?" (yes/no)
   - "Too long / Just right / Too short"
   - Store locally, sync when online

### Validation:
- [ ] **Use app for 2 weeks straight**
- [ ] Try all content formats
- [ ] Collect feedback data
- [ ] Analyze: Which formats work best?
- [ ] Refine content generation based on findings

**Estimated Time:** 8-10 hours (including content creation)

---

## Phase 6: Polish & Enhanced Features
**Goal:** Add nice-to-have features based on learnings

### Potential Features (prioritize based on Phase 5 learnings):
- [ ] Topic categories with filtering
- [ ] "Favorite" topics to revisit
- [ ] Reading streak tracking
- [ ] Dark mode for reading
- [ ] Adjustable font size
- [ ] Share topic summaries (when online)
- [ ] More sophisticated quiz types
- [ ] Progress visualization

### Validation:
- [ ] **Daily usage for 1 month**
- [ ] Share with 2-3 friends for feedback
- [ ] Iterate on most-requested features

**Estimated Time:** 10-15 hours (depending on features chosen)

---

## Phase 7: Content Automation (Optional)
**Goal:** Scale content generation if MVP is successful

### Tasks:
- Build automated content pipeline
- AI-powered topic curation from news/articles
- Automated summarization with human review
- Scheduled content updates

**Only pursue if:** You're using the app daily and want more content volume

**Estimated Time:** 15-20 hours

---

## Technical Decisions to Make Early

### 1. Framework Choice (Phase 0)
| Factor | Flutter | React Native |
|--------|---------|--------------|
| Offline-first libs | Hive, Drift (SQLite) | WatermelonDB, AsyncStorage |
| UI Components | Material/Cupertino | Many options (NativeBase, etc.) |
| Community | Large, growing | Larger, mature |
| Your preference? | ? | ? |

### 2. Content Format
- **JSON** (simple, human-readable)
- **Markdown + YAML** (easier to write)
- **Protobuf** (efficient, overkill for MVP)

**Recommendation:** JSON for MVP

### 3. Content Source
- Manual curation + AI summarization (best quality, slow)
- Fully automated (fast, needs oversight)
- Community contributed (later phase)

**Recommendation:** Manual + AI for MVP

---

## Success Metrics (Personal)
After each phase, evaluate:
- [ ] Do I actually USE this app?
- [ ] Do I learn something new?
- [ ] Is it fun/engaging enough?
- [ ] Does it feel worth the development time?

**Key Milestone:** If after Phase 3 you're not using it daily, pause and reassess.

---

## Next Steps
1. Review this plan
2. Decide on framework (Flutter vs React Native)
3. Start Phase 0: Set up development environment
4. Begin Phase 1: Create first 5 topics manually

**Shall we start with Phase 0?**
