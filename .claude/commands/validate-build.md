# Validate Build Command

Run comprehensive validation before builds to catch issues early.

## Process:
1. Run `npm run type-check` - Ensure TypeScript compiles cleanly
2. Run `node test-topics.js` - Validate all topic JSON files
3. Check that all topic files in `content/topics/` are committed to git
4. Run `npm run validate-build` if the script exists
5. Report any issues found
6. If issues found: fix them automatically and re-validate
7. If all passes: confirm ready for build

## Auto-fix common issues:
- Type errors: Add proper types or fix mismatches
- Missing topic files: Remind to commit them
- Malformed JSON: Fix formatting
- Schema violations: Correct to match schema

## Usage:
- `/validate-build` → Run full validation suite

## Notes:
- This should be run before ANY build or deployment
- All issues must be resolved before proceeding
- Don't ask permission to fix validation errors - just fix them
