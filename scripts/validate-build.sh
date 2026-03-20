#!/bin/bash
# Pre-build validation script
# Ensures all bundled topic files are tracked by git before building

set -e

echo "🔍 Validating build requirements..."

# Regenerate manifest to ensure it includes all topics
echo "Regenerating manifest.json..."
npm run generate-manifest
echo ""

# Check that all imported JSON files are tracked by git
echo "Checking bundled topic files..."

MISSING_FILES=()

# Extract imported topic files from topicLibrary.ts
IMPORTED_FILES=$(grep "import.*from.*content/topics.*\.json" src/constants/topicLibrary.ts | sed -E "s/.*'\.\.\/\.\.\/(content\/topics\/[^']+)'.*/\1/")

for file in $IMPORTED_FILES; do
  if ! git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
    MISSING_FILES+=("$file")
  fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
  echo "❌ ERROR: The following bundled topic files are not tracked by git:"
  for file in "${MISSING_FILES[@]}"; do
    echo "   - $file"
  done
  echo ""
  echo "Fix this by running:"
  echo "   git add ${MISSING_FILES[@]}"
  echo "   git commit -m \"Add bundled topic files\""
  exit 1
fi

echo "✅ All bundled topic files are tracked by git"

# Check TypeScript compilation
echo "Checking TypeScript compilation..."
npm run type-check
echo "✅ TypeScript compilation successful"

# Check that package-lock.json is committed
if ! git diff --quiet package-lock.json 2>/dev/null; then
  echo "⚠️  WARNING: package-lock.json has uncommitted changes"
  echo "   Consider committing before building"
fi

echo ""
echo "✅ Build validation passed!"
echo "   You can now run: eas build --platform android --profile preview"
