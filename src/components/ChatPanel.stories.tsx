import type { Meta, StoryObj } from "@storybook/react";
import { ChatPanel } from "./ChatPanel.js";
import { ChatStore } from "@buildlayer/ai-core";

// Mock chat controller for stories
const mockChatController = {
  sessionId: "story-session",
  messages: [
    {
      id: "1",
      role: "user" as const,
      content: [{ type: "text" as const, text: "Hello, how are you?" }],
      createdAt: Date.now() - 60000,
    },
    {
      id: "2",
      role: "assistant" as const,
      content: [
        {
          type: "text" as const,
          text: "I'm doing well, thank you for asking! How can I help you today?",
        },
      ],
      createdAt: Date.now() - 30000,
    },
  ],
  status: "idle" as const,
  currentToolCall: undefined,
  error: undefined,
  send: async () => {},
  runTool: async () => {},
  stop: () => {},
  reset: () => {},
  importHistory: () => {},
  exportHistory: () => [],
  clearHistory: () => {},
  subscribe: () => () => {},
  registerTool: () => {},
  unregisterTool: () => {},
  getTools: () => [],
};

const meta: Meta<typeof ChatPanel> = {
  title: "Components/ChatPanel",
  component: ChatPanel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Chat panel title",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chatController: mockChatController,
    title: "AI Assistant",
  },
};

export const WithCustomTitle: Story = {
  args: {
    chatController: mockChatController,
    title: "My Custom Chat",
  },
};

export const WithToolCall: Story = {
  args: {
    chatController: {
      ...mockChatController,
      status: "tool-calling" as const,
      currentToolCall: {
        id: "tool-1",
        name: "weather_lookup",
        args: { location: "New York" },
      },
    },
    title: "AI Assistant",
  },
};

export const Streaming: Story = {
  args: {
    chatController: {
      ...mockChatController,
      status: "streaming" as const,
    },
    title: "AI Assistant",
  },
};
