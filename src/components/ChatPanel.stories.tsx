import type { Meta, StoryObj } from '@storybook/react';
import { ChatPanel } from './ChatPanel.js';
import { ChatStore } from '../core/mocks/ai-core';

// Mock chat controller for stories
const mockChatController = {
  sessionId: 'story-session',
  messages: [
    {
      id: '1',
      role: 'user' as const,
      content: [{ type: 'text' as const, text: 'Hello, how are you?' }],
      createdAt: Date.now() - 60000,
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: [
        {
          type: 'text' as const,
          text: "I'm doing well, thank you for asking! How can I help you today?",
        },
      ],
      createdAt: Date.now() - 30000,
    },
  ],
  status: 'idle' as const,
  error: null,
  send: async () => {},
  sendMessage: async () => {},
  runTool: async () => {},
  stop: () => {},
  reset: () => {},
  importHistory: () => {},
  exportHistory: () => [],
  clearHistory: () => {},
  clearMessages: () => {},
  registerTool: () => {},
  subscribe: () => () => {},
};

const meta: Meta<typeof ChatPanel> = {
  title: 'Components/ChatPanel',
  component: ChatPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chatController: mockChatController,
  },
};

export const WithoutToolDrawer: Story = {
  args: {
    chatController: mockChatController,
  },
};

export const Streaming: Story = {
  args: {
    chatController: {
      ...mockChatController,
      status: 'loading' as const,
    },
  },
};
