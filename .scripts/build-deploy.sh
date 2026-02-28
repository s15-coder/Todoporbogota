#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the project root directory (parent of .scripts)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/frontend/todoporbogota"
BACKEND_DIR="$PROJECT_ROOT/backend/todoporbogota"
VIEW_DIR="$BACKEND_DIR/view"
BACKUP_DIR="$BACKEND_DIR/view_backup"

echo -e "${GREEN}Starting deployment build process...${NC}"

# Navigate to frontend directory
cd "$FRONTEND_DIR" || {
    echo -e "${RED}Error: Could not navigate to frontend directory${NC}"
    exit 1
}

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install || {
    echo -e "${RED}Error: npm install failed${NC}"
    exit 1
}

echo -e "${YELLOW}Building frontend...${NC}"
npm run build || {
    echo -e "${RED}Error: Frontend build failed${NC}"
    exit 1
}

# Check if dist folder exists
if [ ! -d "$FRONTEND_DIR/dist" ]; then
    echo -e "${RED}Error: dist folder not found after build${NC}"
    exit 1
fi

# Backup existing view folder if it exists
if [ -d "$VIEW_DIR" ]; then
    echo -e "${YELLOW}Backing up existing view folder...${NC}"
    rm -rf "$BACKUP_DIR"
    mv "$VIEW_DIR" "$BACKUP_DIR" || {
        echo -e "${RED}Error: Failed to backup view folder${NC}"
        exit 1
    }
fi

# Move dist to view
echo -e "${YELLOW}Moving dist to view...${NC}"
mv "$FRONTEND_DIR/dist" "$VIEW_DIR" || {
    echo -e "${RED}Error: Failed to move dist to view${NC}"
    # Restore backup on failure
    if [ -d "$BACKUP_DIR" ]; then
        echo -e "${YELLOW}Restoring backup...${NC}"
        mv "$BACKUP_DIR" "$VIEW_DIR"
    fi
    exit 1
}

# Clean up backup on success
if [ -d "$BACKUP_DIR" ]; then
    echo -e "${YELLOW}Removing backup...${NC}"
    rm -rf "$BACKUP_DIR"
fi

echo -e "${GREEN}Deployment build completed successfully!${NC}"
exit 0
