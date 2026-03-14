#!/bin/bash
# Hook: user-prompt-submit
# Runs before processing each user message
# Use for validation, context injection, or automated checks

# Example: Remind about testing on physical device for UI changes
# if echo "$PROMPT" | grep -qi "component\|screen\|ui\|style"; then
#   echo "💡 Remember to test UI changes on your OnePlus device"
# fi

exit 0
