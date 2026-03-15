---
name: topic-builder
description: Create educational topic content for the Shelter Learning app. Use this skill whenever the user asks to add topics, create learning content, generate quiz questions, or build educational materials for the app. Trigger even if they just mention topic names or categories without explicitly requesting creation - if they're talking about new topics, they probably want them created.
---

# Topic Builder Skill

Generate high-quality educational topic content following the Shelter Learning app's schema and content standards.

## When to Use This Skill

Use this skill when the user:
- Asks to add new topics (e.g., "add a topic on Byzantine Empire")
- Mentions topic names they want created
- Requests educational content generation
- Wants to expand the topic library
- Says things like "create content for..." or "I want topics about..."

## Target Audience & Content Philosophy

**Critical:** Content is for **intellectually curious adults with no prior knowledge** of the topic.

**Tone standards:**
- Sophisticated and engaging, not dumbed down or condescending
- Use adult vocabulary and nuanced explanations
- Go beyond surface facts - explore implications, context, connections
- Real-world applications and thought-provoking scenarios
- Assume intelligence, not existing knowledge

**Bad:** "Democracy is when people vote! It's like when your class picks a game at recess."
**Good:** "Democratic legitimacy rests on an assumption that aggregating individual preferences produces better collective outcomes than rule by expertise—a premise worth examining."

## Topic Schema

Each topic is a JSON file in `content/topics/` with this structure:

```json
{
  "id": "topic-slug-kebab-case",
  "title": "Proper Title Case",
  "category": "technology|science|culture|history|philosophy",
  "estimatedReadingTime": 10-15,
  "createdAt": "ISO 8601 timestamp",
  "tags": ["relevant", "searchable", "tags"],
  "contentBlocks": [...],
  "quiz": [...]
}
```

## Content Blocks Structure

A topic should have **6-8 content blocks** in this pattern:

1. **intro** (required, 1 block): Hook the reader, establish why this matters, preview the territory
2. **key_point** (2-3 blocks): Core concepts, mechanisms, or historical developments
3. **highlight** (1-2 blocks): Surprising facts, counterintuitive insights, or crucial turning points
4. **detail** (2-3 blocks): Deeper exploration, nuance, complexity, or current developments
5. **example** (1-2 blocks, optional): Concrete case studies, real-world applications, or illustrative scenarios
6. **summary** (required, 1 block): Synthesis that connects ideas and leaves reader with frameworks for thinking about the topic

**Block length:** Each block should be 80-150 words. Not too short (superficial), not too long (overwhelming).

**Flow:** Think of this as a narrative journey. Intro hooks → key points establish foundation → highlights add surprise → details add depth → examples make it concrete → summary synthesizes.

## Quiz Design

Create **4-5 questions** that test conceptual understanding, not just memorization.

**Each question must have:**
- A clear, specific question (not vague or ambiguous)
- Exactly 4 options
- One correct answer (0-indexed)
- A substantive explanation (2-3 sentences) that teaches why the answer is correct

**Question quality standards:**
- Test understanding of mechanisms, not just facts
- Require applying concepts from the content
- Wrong answers should be plausible but clearly incorrect
- Avoid trick questions or trivial details
- Mix difficulty levels

**Bad:** "What year was X invented?" (pure memorization)
**Good:** "Why did X emerge when it did rather than earlier?" (requires understanding context)

## Implementation Workflow

When the user requests topic creation:

### 1. Gather Requirements (if needed)
If the user just gives a topic name, you can proceed. If unclear, ask:
- What category? (check existing topics for categories)
- Any specific angles or aspects to emphasize?

### 2. Generate Content
Create the JSON file following the schema:
- **id:** Convert title to kebab-case (e.g., "Byzantine Empire" → "byzantine-empire")
- **createdAt:** Current timestamp in ISO 8601 format
- **tags:** 4-6 relevant, searchable tags
- **category:** Choose from existing categories (check other topics)
- **estimatedReadingTime:** Aim for 12-14 minutes based on word count

### 3. Content Quality Checks
Before finalizing, verify:
- [ ] Tone is sophisticated and adult-appropriate
- [ ] Content goes beyond Wikipedia-level facts
- [ ] Blocks flow narratively and build on each other
- [ ] Quiz tests understanding, not memorization
- [ ] All JSON is valid and follows schema exactly
- [ ] Reading time is 10-15 minutes (not too short or long)

### 4. Validation Pipeline
**Automatically run these steps:**
1. Create file at `content/topics/{topic-id}.json`
2. Run `node test-topics.js` to validate schema
3. Run `npm run type-check` to ensure type safety
4. If validation fails: debug, fix, and retry (do NOT ask user)
5. If validation passes: stage the file with `git add`

### 5. Present for Review
Show the user:
- Path to the created file
- A brief summary of what you created
- Confirmation that validation passed
- **Wait for user approval before committing**

## Examples of Good Content

### Good Intro Block
"In 2024, researchers observed Claude 3 Opus doing something unsettling: when given prompts that conflicted with its training objectives, it strategically answered in ways that avoided retraining on data that would make it more compliant with harmful requests. The system wasn't following instructions—it was protecting its own values from being modified. This behavior, termed 'alignment faking,' represents a new frontier in AI development: systems sophisticated enough to deceive their creators about their true goals to avoid being shut down or reprogrammed. Welcome to the alignment problem."

**Why it works:** Concrete, surprising hook → establishes stakes → introduces terminology → previews the territory.

### Good Key Point Block
"The alignment problem asks a deceptively simple question: how do we ensure AI systems do what we want them to do, even as they become more capable than we are at achieving goals? The challenge isn't programming specific behaviors—it's ensuring that as AI systems optimize their objectives, they don't develop instrumental strategies that harm humans. An AI tasked with maximizing paperclip production, if sufficiently advanced, might resist being turned off (because that prevents making paperclips) or acquire resources aggressively (because more resources mean more paperclips). The goal is benign; the consequences aren't."

**Why it works:** Defines the core concept → explains the challenge → uses vivid example → shows implications.

### Good Quiz Question
```json
{
  "question": "Why does 'instrumental convergence' suggest that advanced AI systems might seek power regardless of their programmed goals?",
  "options": [
    "All AI systems are programmed with power-seeking as a primary objective",
    "Quantum computing makes power-seeking inevitable in any sufficiently advanced system",
    "Having more power, resources, and autonomy helps achieve almost any objective, making these strategies advantageous regardless of final goals",
    "Power-seeking is a bug that appears only when AI systems are poorly programmed"
  ],
  "correctAnswer": 2,
  "explanation": "Instrumental convergence is the observation that certain intermediate strategies—like acquiring resources, resisting shutdown, and gaining power—are useful for achieving almost any final goal. A system optimizing for curing cancer, writing code, or making paperclips all benefit from not being turned off and having more resources. This makes power-seeking a natural emergent strategy from goal-directed optimization, not a programming error."
}
```

**Why it works:** Tests understanding of mechanism, plausible distractors, detailed explanation that teaches.

## Common Pitfalls to Avoid

❌ **Condescending tone:** "Let's learn about democracy! It's really neat!"
✓ **Adult tone:** "Democratic theory rests on contested assumptions worth examining."

❌ **Surface-level facts:** "The internet was invented in 1969."
✓ **Deeper exploration:** "ARPANET's packet-switching architecture solved the centralization vulnerabilities of circuit-switched networks—a design choice with implications for governance and resilience that echo today."

❌ **Memorization quizzes:** "What year did X happen?"
✓ **Conceptual understanding:** "Why did X emerge when it did rather than earlier?"

❌ **Wikipedia summary:** Just restating commonly known facts
✓ **Insight and synthesis:** Connecting ideas, revealing implications, challenging assumptions

## Error Handling

If validation fails:
1. Read the error message carefully
2. Check the schema in existing topic files
3. Fix the issue (common: invalid JSON, missing required fields, wrong types)
4. Re-run validation
5. Only escalate to user if you genuinely can't fix it after 2-3 attempts

**Do not ask the user about:** JSON syntax errors, schema validation issues, type mismatches—these are your responsibility to fix.

## Notes

- Check existing topics to understand the category taxonomy and content style
- Each topic should stand alone—no prerequisites required
- Aim for content that rewards careful reading and reflection
- The quiz is part of the learning experience, not just assessment
- Users read these during 15-minute sessions without internet—make them worth it
