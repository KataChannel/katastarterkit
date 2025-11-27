#!/bin/bash

# ============================================================================
# Main Development Menu
# Entry point for all development tasks
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Launch the interactive menu
"$SCRIPT_DIR/core/dev-deploy-menu.sh"
