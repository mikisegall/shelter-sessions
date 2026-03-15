# Add Topic Command

Create a new topic JSON file in `content/topics/` following the existing schema.

## Process:
1. Ask the user for topic details if not provided (title, category, key points)
2. Generate comprehensive topic content following the schema:
   - id: kebab-case version of title
   - title: Proper title case
   - category: One of the existing categories (check existing topics)
   - estimatedReadingTime: 10-15 minutes
   - contentBlocks: 4-6 blocks (intro, key_point x2-3, highlight, summary)
   - quiz: 3 questions with 4 options each
3. Create the JSON file at `content/topics/{topic-id}.json`
4. Validate with `node test-topics.js`
5. Run `npm run type-check`
6. If validation fails: fix and retry automatically
7. If validation passes: stage the file and show it for user review
8. Wait for user approval before committing

## Content Guidelines:
- **Target audience:** Adults with intellectual curiosity but no prior knowledge of the topic
- **Tone:** Sophisticated, engaging, informative - not dumbed down
- **Phrasing:** Use adult vocabulary and nuanced explanations
- **Depth:** Go beyond surface-level facts; explore implications, context, and connections
- **Examples:** Use real-world applications and thought-provoking scenarios
- **Avoid:** Condescending language, overly simplistic explanations, childish examples

## Example usage:
- `/add-topic` → Ask for details interactively
- `/add-topic "Byzantine Empire"` → Auto-generate with that topic
- `/add-topic "Git" "technology"` → Topic with specific category

## Notes:
- Make content engaging and educational for intelligent adults
- Keep reading time to 10-15 minutes
- Quiz should test conceptual understanding, not just memorization
- Follow existing topic patterns for consistency
