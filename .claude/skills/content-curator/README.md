# Content Curator Skill

A Claude Code skill for generating high-quality, mature learning content for the Shelter Sessions app.

## Quick Start

```bash
# In Claude Code, invoke the skill:
/content-curator

# Or use the Skill tool
```

Then provide a topic you want to create content for.

## What This Skill Does

Generates 10-15 minute learning sessions with:
- Sophisticated, engaging content for educated adults
- Recent developments and controversies
- Nuanced perspectives beyond Wikipedia
- 5 thoughtful quiz questions
- Proper JSON format for the app

## Target Audience

Educated professionals (25-45) who want:
- Depth, not surface-level overviews
- Recent insights and developments
- Intellectual stimulation during downtime
- Content at The Economist/Atlantic/Wired level

## Content Standards

✅ Sophisticated tone
✅ Assumes intelligence
✅ Recent developments (2020+)
✅ Controversies and debates
✅ Specific, detailed examples

❌ No "X is defined as..."
❌ No Wikipedia summaries
❌ No condescending explanations
❌ No pure trivia

## Example Usage

**Input:** "Create a topic about lab-grown meat"

**Output:** JSON content with:
- Hook: 2023 FDA approval, market implications
- Recent developments in cellular agriculture
- Cost/scale challenges and breakthroughs
- Ethics: environment vs animal welfare vs "naturalness"
- Specific companies and their approaches
- Future trajectory and open questions

## Quality Checklist

Every topic must have:
- [ ] Compelling, non-obvious hook
- [ ] Post-2020 information
- [ ] Debate or controversy
- [ ] Specific examples with details
- [ ] 10 content blocks (proper types)
- [ ] 5 synthesis-based quiz questions
- [ ] 10-15 minute reading time
- [ ] Valid JSON output

## See Also

- `SKILL.md` - Complete guidelines and standards
- `../../FEEDBACK.md` - User feedback on content quality
- `../../content/topics/` - Example outputs
