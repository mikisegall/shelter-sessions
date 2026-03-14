#!/bin/bash
# Hook: tool-use-edit
# Runs after every Edit tool use
# Auto-format files after edits

FILE_PATH="$FILE_PATH"

# Only format JavaScript/TypeScript files
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx)$ ]]; then
  # Check if prettier is installed
  if command -v npx &> /dev/null && [ -f "package.json" ]; then
    echo "🎨 Auto-formatting $FILE_PATH with Prettier..."
    npx prettier --write "$FILE_PATH" 2>/dev/null || true
  fi
fi

# Only format JSON files
if [[ "$FILE_PATH" =~ \.json$ ]]; then
  if command -v npx &> /dev/null && [ -f "package.json" ]; then
    npx prettier --write "$FILE_PATH" 2>/dev/null || true
  fi
fi

exit 0
