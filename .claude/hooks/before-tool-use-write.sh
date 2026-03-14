#!/bin/bash
# Hook: before-tool-use-write
# Runs BEFORE every Write tool use
# Protect critical files from being overwritten

FILE_PATH="$FILE_PATH"

# Protected files that should never be overwritten
PROTECTED_FILES=(
  "package-lock.json"
  ".env"
  ".env.local"
  ".env.production"
  "ios/Podfile.lock"
  "android/gradle.properties"
)

# Check if file is protected
for protected in "${PROTECTED_FILES[@]}"; do
  if [[ "$FILE_PATH" == *"$protected"* ]]; then
    echo "❌ BLOCKED: $FILE_PATH is a protected file"
    echo "This file should not be overwritten. If changes are needed, please:"
    echo "  - For package-lock.json: Run 'npm install <package>'"
    echo "  - For .env files: Edit manually outside of Claude"
    exit 1
  fi
done

exit 0
