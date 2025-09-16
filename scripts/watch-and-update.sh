#!/bin/bash

# AI React SDK - Watch and Update Script
# This script builds ai-react in watch mode and runs a demo app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting AI React SDK Development Mode${NC}"

# Build ai-react in watch mode
echo -e "${YELLOW}📦 Building ai-react in watch mode...${NC}"
pnpm dev &

# Wait for first build to complete
echo -e "${YELLOW}⏳ Waiting for initial build to complete...${NC}"
sleep 5

# Check if demo directory exists, if not create it
if [ ! -d "../ai-react-demo" ]; then
  echo -e "${YELLOW}📁 Creating test demo application...${NC}"
  ./scripts/create-demo.sh
fi

# Run the demo application
echo -e "${GREEN}🎯 Starting demo application...${NC}"
cd ../ai-react-demo
pnpm dev
