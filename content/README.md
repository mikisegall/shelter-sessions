# Content Library

This directory contains curated learning topics for Shelter Sessions.

## Available Topics

### 1. How CRISPR Gene Editing Works (Science)
- **Reading Time:** ~12 minutes
- **Topics:** Genetics, biotechnology, medicine, innovation
- **Highlights:** Nobel Prize winners, clinical applications, ethical debates

### 2. The Story Behind Git's Creation (Technology)
- **Reading Time:** ~11 minutes
- **Topics:** Software development, Linux, version control
- **Highlights:** Created in 2 weeks, GitHub's $7.5B acquisition, distributed systems

### 3. The Real Story of the Trojan Horse (History)
- **Reading Time:** ~13 minutes
- **Topics:** Ancient Greece, warfare, archaeology, mythology
- **Highlights:** Archaeological evidence, literary evolution, modern legacy

### 4. Why Japanese Breakfast is So Different (Culture)
- **Reading Time:** ~10 minutes
- **Topics:** Food culture, traditions, nutrition, Japan
- **Highlights:** Ichiju-sansai philosophy, health benefits, cultural evolution

### 5. The Paradox of Choice (Philosophy/Psychology)
- **Reading Time:** ~12 minutes
- **Topics:** Decision-making, happiness, modern life
- **Highlights:** Jam study, maximizers vs satisficers, social media FOMO

## Content Format

Each topic is a JSON file following this structure:

```typescript
{
  id: string              // UUID
  title: string           // Topic title
  category: string        // science|technology|history|culture|philosophy
  estimatedReadingTime: number  // minutes
  contentBlocks: Array    // Structured content sections
  quiz: Array             // 5 self-assessment questions
  tags: Array             // Topic tags
  createdAt: string       // ISO timestamp
}
```

## Content Blocks

Topics use different block types for varied content:
- **intro** - Introduction to the topic
- **key_point** - Main concepts or facts
- **highlight** - Surprising or interesting facts
- **detail** - Detailed explanations
- **example** - Real-world examples
- **summary** - Conclusions

## Quiz Format

Each topic includes 5 multiple-choice questions with:
- Question text
- 4 answer options
- Correct answer index
- Detailed explanation

## Phase 1 Validation

✅ All topics are 10-15 minutes estimated reading time
✅ Cover diverse categories (science, tech, history, culture, philosophy)
✅ Include engaging mix of facts, stories, and surprising insights
✅ Feature self-assessment quizzes for retention
✅ Valid JSON format

## Next Steps

- Phase 2: Build simple topic viewer in the app
- Phase 3: Add session management and progress tracking
- Phase 4: Implement content sync mechanism
