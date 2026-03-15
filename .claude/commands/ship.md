# Ship Command

Complete validation, commit, and push workflow for shipping changes.

## Process:
1. Run `npm run type-check`
2. Run `node test-topics.js` (if topics were modified)
3. Check git status for uncommitted changes
4. If validation passes:
   - Stage all relevant files
   - Generate conventional commit message based on changes
   - Create commit
   - Push to remote
5. If validation fails:
   - Fix issues automatically
   - Re-run validation
   - Only surface issues if cannot auto-fix

## Commit Message Generation:
- Analyze the changes (git diff)
- Determine type (content, feat, fix, docs, chore)
- Write clear, descriptive message
- Include Claude Code attribution

## Usage:
- `/ship` → Validate, commit, and push all changes
- `/ship "custom message"` → Use custom commit message

## Notes:
- User trusts you to write good commit messages
- Fix validation errors without asking
- Only stop if there are merge conflicts or push failures
- Be autonomous - the goal is zero user intervention for standard workflows
