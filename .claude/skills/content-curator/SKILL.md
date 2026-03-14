# Content Curator Skill

## Purpose
Generate high-quality, mature learning content for Shelter Sessions app. Content should engage educated adults during 10-15 minute reading sessions with depth, nuance, and recent insights.

---

## Target Audience

**Who:** Educated professionals (25-45 years old) who:
- Have baseline knowledge across various domains
- Want to go deeper than Wikipedia summaries
- Appreciate nuanced perspectives and recent developments
- Value intellectual stimulation during downtime

**Not for:** Complete beginners, children, or those seeking basic overviews

---

## Content Standards

### Tone & Voice
- **Conversational but sophisticated** - like The Economist, The Atlantic, or Wired
- **Assume intelligence** - reader can handle complexity
- **Engaging storytelling** - use narrative hooks, surprising facts, controversies
- **No condescension** - avoid "did you know?" or overly explanatory tone

### Depth Level
✅ **DO:**
- Start with surprising or counterintuitive angles
- Include recent developments (2020+)
- Discuss controversies, debates, and open questions
- Connect to broader implications
- Use specific examples with details
- Mention key figures and their contributions

❌ **DON'T:**
- Explain basic concepts the reader likely knows
- Use textbook-style introductions
- Oversimplify complex topics
- Stick to Wikipedia-level information
- Avoid nuance or gray areas

### Structure Requirements
1. **Intro** - Hook with a compelling angle, not a definition
2. **Key Points** (2-3) - Core concepts with depth
3. **Highlights** (1-2) - Surprising facts or recent developments
4. **Details** (2-3) - Nuanced explanations, mechanisms, or context
5. **Examples** (1-2) - Specific, detailed real-world applications
6. **Summary** - Implications, future directions, open questions

---

## Topic Selection Criteria

### Good Topics:
- Have recent significant developments
- Involve ongoing debates or controversies
- Connect multiple domains (science + ethics, history + politics)
- Challenge common assumptions
- Affect readers' lives in non-obvious ways

### Avoid:
- Topics that are purely historical without modern relevance
- Overly technical subjects requiring specialized background
- Topics without depth beyond surface facts
- Pure trivia without broader significance

---

## Content Generation Process

### Step 1: Research Phase
- Identify 2-3 recent sources (2020+)
- Find controversies, debates, or open questions
- Look for surprising angles or counterintuitive findings
- Note key researchers, dates, and specific examples

### Step 2: Angle Selection
Choose a compelling entry point:
- A recent controversy or breakthrough
- A common misconception to correct
- An unexpected connection
- A practical implication

### Step 3: Content Blocks
Write 10 content blocks following this pattern:

**Intro (1):** Lead with the hook, not a definition
- ❌ "X is a technology that..."
- ✅ "In 2023, X sparked international debate when..."

**Key Point (2-3):** Core mechanisms/concepts
- Assume reader knows basics
- Focus on how/why, not what
- Include technical specifics where relevant

**Highlight (1-2):** Surprising facts
- Recent developments (cite years)
- Counterintuitive findings
- Notable controversies

**Detail (2-3):** Deeper explanations
- Mechanisms, processes, or context
- Nuanced perspectives
- Connections to other domains

**Example (1-2):** Specific cases
- Real applications with names, dates, outcomes
- Not generic hypotheticals
- Show real-world impact

**Summary (1):** Implications and open questions
- What's still unknown?
- Future directions
- Why it matters

### Step 4: Quiz Questions
Create 5 questions that:
- Test understanding, not memorization
- Require synthesis of multiple content blocks
- Avoid trivial details
- Have explanations that add value

---

## Quality Checklist

Before finalizing content, verify:

### Depth & Maturity
- [ ] No "X is defined as..." openings
- [ ] Assumes educated reader
- [ ] Includes post-2020 information
- [ ] Discusses controversies or debates
- [ ] Goes beyond Wikipedia depth

### Engagement
- [ ] Compelling hook in intro
- [ ] Surprising facts included
- [ ] Real examples with specifics
- [ ] Storytelling elements present
- [ ] Avoids dry, textbook tone

### Structure
- [ ] 10 content blocks total
- [ ] Follows prescribed block types
- [ ] Logical flow and progression
- [ ] 10-15 minute reading time
- [ ] 5 quiz questions

### Technical
- [ ] Valid JSON format
- [ ] Proper content block types
- [ ] Quiz has correct answer indices
- [ ] Explanations add insight
- [ ] All required fields present

---

## Examples

### ❌ BAD Opening (Too Basic)
> "Quantum computing is a type of computing that uses quantum mechanics. Unlike classical computers that use bits, quantum computers use qubits..."

**Problem:** Assumes no knowledge, textbook style, defines basic terms

### ✅ GOOD Opening (Mature)
> "In October 2024, Google's quantum processor solved in 30 seconds what would take classical supercomputers billions of years. The achievement reignited debate: are we witnessing genuine quantum advantage, or elaborate benchmarking theater?"

**Why Better:** Starts with recent news, assumes reader knows what quantum computing is, introduces controversy

---

### ❌ BAD Key Point (Surface Level)
> "DNA contains genetic information stored in four bases: A, T, G, and C."

**Problem:** Too basic, no insight, common knowledge

### ✅ GOOD Key Point (Depth)
> "The 'junk DNA' that makes up 98% of our genome isn't junk at all. These non-coding regions control when and how much of each gene gets expressed—a regulatory layer that explains why humans with nearly identical genes can be so different."

**Why Better:** Corrects misconception, explains significance, adds nuance

---

## Output Format

Generate content as JSON matching this schema:

```json
{
  "id": "uuid",
  "title": "Compelling Title (not generic)",
  "category": "science|technology|history|culture|philosophy|business|psychology",
  "estimatedReadingTime": 10-15,
  "createdAt": "ISO-8601 timestamp",
  "tags": ["specific", "relevant", "searchable"],
  "contentBlocks": [
    {
      "type": "intro|key_point|highlight|detail|example|summary",
      "text": "Content following depth standards..."
    }
  ],
  "quiz": [
    {
      "question": "Thought-provoking question",
      "options": ["4 options"],
      "correctAnswer": 0-3,
      "explanation": "Insightful explanation"
    }
  ]
}
```

---

## Usage Instructions

When generating content:

1. **State the topic** you want to create
2. **Identify the angle** - what's surprising/controversial/recent?
3. **Research** - find 2-3 recent sources
4. **Draft** following the structure
5. **Review** against quality checklist
6. **Generate** JSON output

Always aim for content that makes the reader think: "I didn't know that" or "I never thought of it that way."

---

## Continuous Improvement

After each topic:
- Review user feedback on depth/engagement
- Note what worked and what didn't
- Refine understanding of target audience
- Update examples and standards

The goal: Every topic should feel like a great article from The Atlantic or Wired—intellectually stimulating, well-researched, and worth the reader's time.
