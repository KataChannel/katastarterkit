#!/bin/bash

# ============================================================================
# Quick Menu - Launch Development & Deployment Menu
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║       🚀 Multi-Domain Starter Kit - Quick Menu            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "This will launch the interactive development & deployment menu"
echo "where you can manage multiple domains (RAUSACH, TAZAGROUP, TIMONA)"
echo ""
echo "Press Enter to continue or Ctrl+C to exit..."
read

# Launch the main menu
"$SCRIPT_DIR/dev-deploy-menu.sh"