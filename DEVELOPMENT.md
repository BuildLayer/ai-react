# AI React SDK - Development Guide

## 📋 Development Standards

### TypeScript Requirements

- **NO `any` types allowed** - All types must be explicitly defined
- Use proper TypeScript interfaces and types
- Prefer `unknown` over `any` when type is truly unknown
- Use type guards and assertions when necessary

## 🚀 Quick Start

### Continuous Development Mode

Start the continuous build system with live demo:

```bash
# Build SDK in watch mode + run demo app
pnpm dev:with-demo

# Or run demo separately
pnpm demo:quick
```

### Manual Development

```bash
# Build SDK in watch mode
pnpm dev

# Create new demo app
pnpm demo:create

# Run specific demo
pnpm demo:run
```

## 📦 Build System

### Production Build

```bash
# Clean build
pnpm clean && pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
```

### Bundle Analysis

After building, check `dist/bundle-analysis.html` for:

- Bundle size breakdown
- Gzip/Brotli compression ratios
- Module dependencies
- Optimization opportunities

## 🧪 Testing

### Unit Tests

```bash
# Run tests once
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage

# UI mode
pnpm test:ui
```

### Demo Testing

The demo application (`../ai-react-demo/`) provides:

- Live SDK testing in browser
- Hook functionality verification
- Real-time build updates
- Error boundary testing

## 🏗️ Architecture

### Core Structure

```text
src/
├── core/                 # Core SDK functionality
│   ├── store/           # Zustand stores
│   ├── storage/         # Storage abstraction
│   ├── providers/       # AI provider system
│   └── types/           # TypeScript definitions
├── hooks/               # Custom React hooks
├── components/          # UI components (legacy)
└── utils/               # Utility functions
```

### Key Features

- **State Management**: Zustand with Immer for immutable updates
- **Storage**: Pluggable adapters (localStorage, sessionStorage, memory)
- **Type Safety**: Strict TypeScript with zero `any` types
- **Performance**: Optimized builds with tree shaking
- **Testing**: Comprehensive test coverage

## 🔧 Development Workflow

1. **Make Changes**: Edit source files in `src/`
2. **Auto Build**: Vite watches and rebuilds automatically
3. **Live Demo**: Demo app updates in real-time
4. **Test**: Verify functionality in browser
5. **Commit**: Changes are ready for commit

## 📊 Performance Targets

- **Bundle Size**: < 100KB gzipped
- **Load Time**: < 200ms initial load
- **Memory**: < 50MB peak usage
- **Re-renders**: Minimal with optimized selectors

## 🐛 Debugging

### Browser DevTools

- **React DevTools**: Inspect component state
- **Zustand DevTools**: Monitor store changes
- **Network**: Check API calls and storage
- **Console**: View logs and errors

### Common Issues

1. **Build Errors**: Check TypeScript types
2. **Runtime Errors**: Verify peer dependencies
3. **Storage Issues**: Check adapter availability
4. **Performance**: Use bundle analyzer

## 📝 Contributing

1. Follow the coding standards in `docs/CODING_STANDARDS.md`
2. Ensure all tests pass: `pnpm test`
3. Check type safety: `pnpm type-check`
4. Format code: `pnpm format`
5. Update documentation as needed

## 🎯 Next Steps

- Phase 2: Component Architecture (Weeks 3-4)
- Phase 3: Advanced Features (Weeks 5-6)
- Phase 4: Testing & Documentation (Weeks 7-8)
- Phase 5: Performance & Polish (Weeks 9-10)
