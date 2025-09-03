# @buildlayer/ai-react

> Minimal React UI components for AI chat assistants with light/dark themes and full TypeScript support

[![npm version](https://badge.fury.io/js/@buildlayer%2Fai-react.svg)](https://badge.fury.io/js/@buildlayer%2Fai-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
# npm
npm install @buildlayer/ai-react

# pnpm
pnpm add @buildlayer/ai-react

# yarn
yarn add @buildlayer/ai-react
```

## Quick Start

```tsx
import React from 'react';
import { ChatPanel, useChat, ThemeProvider } from '@buildlayer/ai-react';
import { createOpenAIAdapter } from '@buildlayer/ai-core';

function App() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chat = useChat(adapter);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen">
        <ChatPanel chatController={chat} title="AI Assistant" />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

## Core Components

### ChatPanel

The main chat interface component:

```tsx
import { ChatPanel, useChat } from '@buildlayer/ai-react';
import { createOpenAIAdapter } from '@buildlayer/ai-core';

function MyChatApp() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chat = useChat(adapter);

  return (
    <ChatPanel 
      chatController={chat}
      title="AI Assistant"
      className="max-w-4xl mx-auto"
    />
  );
}
```

### MessageList

Display chat messages:

```tsx
import { MessageList } from '@buildlayer/ai-react';

function ChatMessages({ chatController }) {
  return (
    <MessageList 
      chatController={chatController}
      className="flex-1 overflow-y-auto"
    />
  );
}
```

### Composer

Message input component:

```tsx
import { Composer } from '@buildlayer/ai-react';

function MessageInput({ chatController }) {
  return (
    <Composer 
      chatController={chatController}
      placeholder="Type your message..."
    />
  );
}
```

## Hooks

### useChat

Basic chat functionality:

```tsx
import { useChat } from '@buildlayer/ai-react';
import { createOpenAIAdapter } from '@buildlayer/ai-core';

function ChatComponent() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chat = useChat(adapter);

  const handleSend = async (message: string) => {
    await chat.send(message);
  };

  return (
    <div>
      <div>
        {chat.messages.map((msg) => (
          <div key={msg.id}>{msg.content[0]?.text}</div>
        ))}
      </div>
      <button onClick={() => handleSend("Hello!")}>
        Send Message
      </button>
    </div>
  );
}
```

## Theme Support

### ThemeProvider

Wrap your app with theme provider:

```tsx
import { ThemeProvider, useTheme } from '@buildlayer/ai-react';

function ThemedApp() {
  return (
    <ThemeProvider defaultTheme="dark">
      <MyChatApp />
    </ThemeProvider>
  );
}
```

### useTheme Hook

Access theme state in your components:

```tsx
import { useTheme } from '@buildlayer/ai-react';

function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex justify-between items-center p-4">
      <h1>AI Assistant</h1>
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="px-3 py-1 text-sm"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
```

## Styling

### Tailwind CSS

The components are built with Tailwind CSS. Make sure to include Tailwind in your project:

```bash
npm install -D tailwindcss
npx tailwindcss init
```

Add to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@buildlayer/ai-react/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Theme Classes

The package includes built-in light and dark theme classes:

- `light-theme` - Light theme styling
- `dark-theme` - Dark theme styling

### Custom Styling

You can customize the appearance using CSS classes:

```tsx
<ChatPanel 
  chatController={chat}
  className="bg-white dark:bg-gray-900 rounded-lg shadow-lg"
/>
```

## TypeScript Support

All components are fully typed:

```tsx
import type { 
  ChatPanelProps, 
  MessageListProps,
  ComposerProps,
  Theme
} from '@buildlayer/ai-react';

interface MyChatProps extends ChatPanelProps {
  customProp?: string;
}
```

## API Reference

### Components

#### ChatPanelProps

```tsx
interface ChatPanelProps {
  chatController: ChatController;
  className?: string;
  title?: string;
}
```

#### MessageListProps

```tsx
interface MessageListProps {
  chatController: ChatController;
  className?: string;
}
```

#### ComposerProps

```tsx
interface ComposerProps {
  chatController: ChatController;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}
```

### Hook APIs

#### useChat API

```tsx
function useChat(chatController: ChatController): ChatController;
```

#### useTheme API

```tsx
function useTheme(): {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};
```

## Examples

### Basic Chat App

```tsx
import React from 'react';
import { ChatPanel, useChat, ThemeProvider } from '@buildlayer/ai-react';
import { createOpenAIAdapter } from '@buildlayer/ai-core';

function BasicChat() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chat = useChat(adapter);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen flex flex-col">
        <ChatPanel chatController={chat} title="AI Assistant" />
      </div>
    </ThemeProvider>
  );
}
```

### Custom Theme App

```tsx
import React from 'react';
import { ChatPanel, useChat, ThemeProvider, useTheme } from '@buildlayer/ai-react';
import { createOpenAIAdapter } from '@buildlayer/ai-core';

function CustomThemedApp() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chat = useChat(adapter);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen flex flex-col">
        <Header />
        <ChatPanel chatController={chat} title="My Custom AI Assistant" />
      </div>
    </ThemeProvider>
  );
}

function Header() {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1>My AI Assistant</h1>
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="px-3 py-1 text-sm rounded"
      >
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/BuildLayer/ai-react.git
cd ai-react

# npm
npm install
npm run dev

# pnpm
pnpm install
pnpm dev

# yarn
yarn install
yarn dev
```

### What's Included (OSS)

This package includes only basic chat UI components:

- ✅ `ChatPanel` - Main chat interface
- ✅ `MessageList` - Message display
- ✅ `Composer` - Message input
- ✅ `useChat` - Basic chat hook
- ✅ `ThemeProvider` - Light/dark themes
- ✅ `useTheme` - Theme management

### What's Pro-Only

Advanced features are available in `@buildlayer/ai-pro`:

- 🔒 Tool calling forms and UI
- 🔒 Advanced themes (nebula, plasma, synthwave)
- 🔒 Session persistence (IndexedDB, localStorage)
- 🔒 Export/import functionality
- 🔒 Advanced UX components
- 🔒 Multi-session management

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [@buildlayer/ai-core](https://www.npmjs.com/package/@buildlayer/ai-core) - AI chat engine

## Made with ❤️ by the BuildLayer.dev team

For advanced features like tool calling, session persistence, and premium themes, check out [@buildlayer/ai-pro](https://www.npmjs.com/package/@buildlayer/ai-pro).
