#!/bin/bash

# AI React SDK - Create Demo Script
# This script creates a simple demo application to test the SDK

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
DEMO_NAME="ai-react-demo"
DEMO_DIR="../"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -n|--name)
      DEMO_NAME="$2"
      shift 2
      ;;
    -d|--dir)
      DEMO_DIR="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  -n, --name NAME    Demo application name (default: ai-react-demo)"
      echo "  -d, --dir DIR      Directory to create demo in (default: ../)"
      echo "  -h, --help         Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🚀 Creating AI React SDK Demo Application${NC}"
echo -e "${YELLOW}Demo name: ${DEMO_NAME}${NC}"
echo -e "${YELLOW}Demo directory: ${DEMO_DIR}${NC}"

# Create demo directory
DEMO_PATH="$DEMO_DIR/$DEMO_NAME"
mkdir -p "$DEMO_PATH"

# Create package.json
echo -e "${BLUE}📦 Creating package.json...${NC}"
cat > "$DEMO_PATH/package.json" << EOF
{
  "name": "$DEMO_NAME",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "@buildlayer/ai-core": "^0.2.2",
    "zustand": "^5.0.8",
    "immer": "^10.1.3",
    "@buildlayer/ai-react": "file:../ai-react"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.7.0",
    "vite": "^5.4.19",
    "typescript": "^5.4.0"
  }
}
EOF

# Create vite.config.ts
echo -e "${BLUE}⚙️ Creating vite.config.ts...${NC}"
cat > "$DEMO_PATH/vite.config.ts" << EOF
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  css: {
    postcss: "../ai-react/postcss.config.mjs",
  },
  // Using direct relative imports instead of alias for better development experience
});
EOF

# Create index.html
echo -e "${BLUE}🌐 Creating index.html...${NC}"
cat > "$DEMO_PATH/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI React SDK Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Create src directory
mkdir -p "$DEMO_PATH/src"

# Create main.tsx
echo -e "${BLUE}⚛️ Creating main.tsx...${NC}"
cat > "$DEMO_PATH/src/main.tsx" << EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Create App.tsx
echo -e "${BLUE}📱 Creating App.tsx...${NC}"
cat > "$DEMO_PATH/src/App.tsx" << EOF
import React from 'react';
import { App as AIReactApp } from '@buildlayer/ai-react';

function App() {
  return <AIReactApp />;
}

export default App;
EOF

# Create tsconfig.json
echo -e "${BLUE}📝 Creating tsconfig.json...${NC}"
cat > "$DEMO_PATH/tsconfig.json" << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Create tsconfig.node.json
cat > "$DEMO_PATH/tsconfig.node.json" << EOF
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
cd "$DEMO_PATH"
pnpm install

# Check if creation was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Demo application created successfully!${NC}"
  echo -e "${BLUE}📁 Location: $DEMO_PATH${NC}"
  echo -e "${YELLOW}🚀 To start the demo:${NC}"
  echo -e "   cd $DEMO_PATH"
  echo -e "   pnpm dev"
  echo -e "   # Open http://localhost:3000 in your browser"
else
  echo -e "${RED}❌ Failed to create demo application${NC}"
  exit 1
fi
