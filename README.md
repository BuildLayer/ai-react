# @buildlayer/ai-react

> Minimal React UI components for AI chat assistants with light/dark themes and full TypeScript support

[![npm version](https://img.shields.io/npm/v/@buildlayer/ai-react.svg)](https://www.npmjs.com/package/@buildlayer/ai-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
# npm
npm install @buildlayer/ai-react @buildlayer/ai-core

# pnpm
pnpm add @buildlayer/ai-react @buildlayer/ai-core

# yarn
yarn add @buildlayer/ai-react @buildlayer/ai-core
```

> **Note**: You also need to install `@buildlayer/ai-core` which provides the AI chat engine and provider adapters.

## Quick Start

```tsx
import React from 'react';
import { App } from '@buildlayer/ai-react';

function MyApp() {
  return <App />;
}

export default MyApp;
```

## Screenshots

### Main Application

![Main App](screenshots/Screenshot%202025-09-02%20at%2023-34-29%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Complete AI chat application with dark theme*

### Light Theme

![Light Theme](screenshots/Screenshot%202025-09-02%20at%2023-48-26%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Clean light theme interface*

### Dark Theme

![Dark Theme](screenshots/Screenshot%202025-09-02%20at%2023-48-58%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Modern dark theme interface*

### Using Individual Components

```tsx
import React from 'react';
import { ChatPanel, useChat, ThemeProvider } from '@buildlayer/ai-react';
import { createOpenAIAdapter, ChatStore } from '@buildlayer/ai-core';

function CustomApp() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chatController = new ChatStore(adapter);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen">
        <ChatPanel chatController={chatController} />
      </div>
    </ThemeProvider>
  );
}

export default CustomApp;
```

## Provider Configuration

### Supported AI Providers

The package works with multiple AI providers through `@buildlayer/ai-core`:

#### OpenAI

```tsx
import { createOpenAIAdapter, ChatStore } from '@buildlayer/ai-core';

const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
const chatController = new ChatStore(adapter);
```

#### Anthropic

```tsx
import { createAnthropicAdapter, ChatStore } from '@buildlayer/ai-core';

const adapter = createAnthropicAdapter(process.env.ANTHROPIC_API_KEY!);
const chatController = new ChatStore(adapter);
```

#### Mistral

```tsx
import { createMistralAdapter, ChatStore } from '@buildlayer/ai-core';

const adapter = createMistralAdapter(process.env.MISTRAL_API_KEY!);
const chatController = new ChatStore(adapter);
```

#### Grok

```tsx
import { createGrokAdapter, ChatStore } from '@buildlayer/ai-core';

const adapter = createGrokAdapter(process.env.GROK_API_KEY!);
const chatController = new ChatStore(adapter);
```

#### Local LLM (Ollama)

```tsx
import { createLocalLLMAdapter, ChatStore } from '@buildlayer/ai-core';

const adapter = createLocalLLMAdapter({
  baseURL: "http://localhost:11434/v1", // Ollama default
  apiKey: "ollama", // Optional
});
const chatController = new ChatStore(adapter);
```

#### Custom Provider URL

```tsx
// For custom OpenAI-compatible endpoints
const adapter = createOpenAIAdapter(apiKey, {
  baseURL: "https://your-custom-endpoint.com/v1"
});
const chatController = new ChatStore(adapter);
```

## Core Components

### App

The main application component with built-in provider configuration:

![App Component](screenshots/Screenshot%202025-09-03%20at%2005-06-38%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Complete application with provider selection*

```tsx
import { App } from '@buildlayer/ai-react';

function MyApp() {
  return <App />;
}
```

### ChatPanel

The main chat interface component:

![ChatPanel Component](screenshots/Screenshot%202025-09-03%20at%2005-06-47%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Main chat interface with message history and input*

```tsx
import { ChatPanel } from '@buildlayer/ai-react';
import { createOpenAIAdapter, ChatStore } from '@buildlayer/ai-core';

function MyChatApp() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chatController = new ChatStore(adapter);

  return (
    <ChatPanel 
      chatController={chatController}
      model="gpt-4"
      className="max-w-4xl mx-auto"
    />
  );
}
```

### MessageList

Display chat messages:

![MessageList Component](screenshots/Screenshot%202025-09-03%20at%2005-07-05%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Message display with conversation history*

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

![Composer Component](screenshots/Screenshot%202025-09-03%20at%2005-07-13%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Message input with send button and model selection*

```tsx
import { Composer } from '@buildlayer/ai-react';

function MessageInput({ chatController }) {
  return (
    <Composer 
      chatController={chatController}
      model="gpt-4"
      placeholder="Type your message..."
    />
  );
}
```

### ChatHeader

Chat header with session information:

![ChatHeader Component](screenshots/Screenshot%202025-09-02%20at%2023-34-29%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Header with session info and clear history button*

```tsx
import { ChatHeader } from '@buildlayer/ai-react';

function ChatHeaderComponent({ chatController }) {
  return (
    <ChatHeader 
      chatController={chatController}
      onClearHistory={() => chatController.clearHistory()}
    />
  );
}
```

### ThemeSwitcher

Theme toggle component:

![ThemeSwitcher Component](screenshots/Screenshot%202025-09-02%20at%2023-48-26%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Theme toggle button for switching between light and dark modes*

```tsx
import { ThemeSwitcher } from '@buildlayer/ai-react';

function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>AI Assistant</h1>
      <ThemeSwitcher />
    </header>
  );
}
```

## Hooks

### useChat

Basic chat functionality:

```tsx
import { useChat } from '@buildlayer/ai-react';
import { createOpenAIAdapter, ChatStore } from '@buildlayer/ai-core';

function ChatComponent() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chatController = new ChatStore(adapter);
  const chat = useChat(chatController);

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

### useChatWithSingleSession

Single session management with persistence:

```tsx
import { useChatWithSingleSession } from '@buildlayer/ai-react';
import { createOpenAIAdapter, ChatStore } from '@buildlayer/ai-core';

function ChatWithPersistence() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chatController = new ChatStore(adapter);
  const { session, clearSession, exportSession } = useChatWithSingleSession(chatController);

  return (
    <div>
      <div>Session: {session?.name}</div>
      <button onClick={clearSession}>Clear Session</button>
      <button onClick={() => console.log(exportSession())}>Export</button>
    </div>
  );
}
```

### useApp

Application state management:

```tsx
import { useApp } from '@buildlayer/ai-react';

function AppComponent() {
  const { state, connect, disconnect } = useApp();

  return (
    <div>
      <div>Connected: {state.isConnected ? 'Yes' : 'No'}</div>
      <div>Provider: {state.selectedProvider.name}</div>
      <div>Model: {state.selectedModel}</div>
    </div>
  );
}
```

## Theme Support

### Theme Comparison

![Light Theme](screenshots/Screenshot%202025-09-02%20at%2023-48-26%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Clean and minimal light theme*

![Dark Theme](screenshots/Screenshot%202025-09-02%20at%2023-48-58%20AI%20UI%20SDK%20-%20Professional%20Demo.png)
*Modern and sleek dark theme*

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
import { useTheme, useThemeAwareStyle } from '@buildlayer/ai-react';

function Header() {
  const { theme, setTheme } = useTheme();
  const { isDark, isLight } = useThemeAwareStyle();

  return (
    <header className="flex justify-between items-center p-4">
      <h1>AI Assistant</h1>
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="px-3 py-1 text-sm"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <div>Is Dark: {isDark.toString()}</div>
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

Themes are automatically applied based on the `data-theme` attribute on the HTML element.

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
  ChatHeaderProps,
  ThemeSwitcherProps,
  AppProps,
  Theme,
  ThemeConfig,
  ThemeContextType,
  ThemeProviderProps,
  AppState,
  AppContextType,
  AppProviderProps,
  ChatSession
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
  model?: string;
  className?: string;
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
  model?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  disabledReasons?: string[];
}
```

#### ChatHeaderProps

```tsx
interface ChatHeaderProps {
  chatController: ChatController;
  onClearHistory: () => void;
  className?: string;
}
```

#### AppProps

```tsx
interface AppProps {
  className?: string;
}
```

### Hook APIs

#### useChat API

```tsx
function useChat(chatController: ChatController): {
  sessionId: string;
  messages: Message[];
  status: ChatStatus;
  currentToolCall: ToolCall | null;
  error: string | null;
  send: (input: string | ContentPart[], opts?: SendOpts) => Promise<void>;
  runTool: (call: { name: string; args: any; id: string }) => Promise<void>;
  stop: () => void;
  reset: () => void;
  importHistory: (msgs: Message[]) => void;
  exportHistory: () => Message[];
  clearHistory: () => void;
};
```

#### useChatWithSingleSession API

```tsx
function useChatWithSingleSession(chatController: ChatController): {
  session: SingleChatSession | null;
  isLoaded: boolean;
  clearSession: () => void;
  exportSession: () => ExportData | null;
};
```

#### useTheme API

```tsx
function useTheme(): {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

function useThemeAwareStyle(): {
  isDark: boolean;
  isLight: boolean;
};
```

#### useApp API

```tsx
function useApp(): {
  state: AppState;
  connect: (provider: string, model: string, apiKey?: string) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
};
```

## Examples

### Basic Chat App

```tsx
import React from 'react';
import { App } from '@buildlayer/ai-react';

function BasicChat() {
  return <App />;
}
```

### Custom Chat App

```tsx
import React from 'react';
import { ChatPanel, ThemeProvider } from '@buildlayer/ai-react';
import { createOpenAIAdapter, ChatStore } from '@buildlayer/ai-core';

function CustomChat() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chatController = new ChatStore(adapter);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen flex flex-col">
        <ChatPanel chatController={chatController} model="gpt-4" />
      </div>
    </ThemeProvider>
  );
}
```

### Custom Theme App

```tsx
import React from 'react';
import { ChatPanel, ThemeProvider, useTheme, ThemeSwitcher } from '@buildlayer/ai-react';
import { createOpenAIAdapter, ChatStore } from '@buildlayer/ai-core';

function CustomThemedApp() {
  const adapter = createOpenAIAdapter(process.env.OPENAI_API_KEY!);
  const chatController = new ChatStore(adapter);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen flex flex-col">
        <Header />
        <ChatPanel chatController={chatController} model="gpt-4" />
      </div>
    </ThemeProvider>
  );
}

function Header() {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1>My AI Assistant</h1>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1 text-sm rounded"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
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

This package includes basic chat UI components:

- ✅ `App` - Complete application component
- ✅ `ChatPanel` - Main chat interface
- ✅ `MessageList` - Message display
- ✅ `Composer` - Message input
- ✅ `ChatHeader` - Chat header with session info
- ✅ `ThemeSwitcher` - Theme toggle component
- ✅ `LoadingSpinner` - Loading indicator
- ✅ `useChat` - Basic chat hook
- ✅ `useChatWithSingleSession` - Single session with persistence
- ✅ `useApp` - Application state management
- ✅ `ThemeProvider` - Light/dark themes
- ✅ `useTheme` - Theme management
- ✅ `useThemeAwareStyle` - Theme-aware styling
- ✅ `AppProvider` - Application context provider

### What's Pro-Only

Advanced features are available in `@buildlayer/ai-react-pro` (coming soon):

- 🔒 Tool calling forms and UI
- 🔒 Advanced themes (nebula, plasma, synthwave)
- 🔒 Multi-session management
- 🔒 Advanced UX components
- 🔒 Export/import functionality
- 🔒 Advanced persistence adapters

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [@buildlayer/ai-core](https://www.npmjs.com/package/@buildlayer/ai-core) - AI chat engine

## Made with ❤️ by the BuildLayer.dev team

For advanced features like tool calling, session persistence, and premium themes, check out [@buildlayer/ai-react-pro](https://www.npmjs.com/package/@buildlayer/ai-react-pro) (coming soon).
