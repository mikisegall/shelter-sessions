#!/bin/bash
# Hook: before-tool-use-edit
# Runs BEFORE every Edit tool use
# Protect critical files from being edited

FILE_PATH="$FILE_PATH"

# Protected files that should never be edited
PROTECTED_FILES=(
  "package-lock.json"
  ".env"
  ".env.local"
  ".env.production"
  "app.json"
  "ios/Podfile.lock"
  "android/gradle.properties"
)

# Check if file is protected
for protected in "${PROTECTED_FILES[@]}"; do
  if [[ "$FILE_PATH" == *"$protected"* ]]; then
    echo "❌ BLOCKED: $FILE_PATH is a protected file"
    echo "This file should not be manually edited. If changes are needed, please:"
    echo "  - For package-lock.json: Run 'npm install <package>'"
    echo "  - For .env files: Edit manually outside of Claude"
    echo "  - For app.json: Review changes carefully first"
    exit 1
  fi
done

exit 0
