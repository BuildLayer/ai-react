#!/bin/bash

# AI React SDK - Run Demo Script
# This script runs the demo application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting AI React SDK Demo${NC}"

# Check if demo directory exists
if [ ! -d "../ai-react-demo" ]; then
  echo -e "${YELLOW}📁 Demo directory not found. Creating demo...${NC}"
  ./scripts/create-demo.sh
fi

# Run the demo
echo -e "${GREEN}🎯 Starting demo application...${NC}"
cd ../ai-react-demo
pnpm dev
