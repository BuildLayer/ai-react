import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChatPanel, MessageList, Composer } from "../components";
import { ChatStore } from "@buildlayer/ai-core";
import type { ProviderAdapter, ChatRequest, Delta } from "@buildlayer/ai-core";

// Mock provider adapter
const createMockProvider = (): ProviderAdapter => ({
  async chat(request: ChatRequest) {
    const mockDeltas: Delta[] = [
      { type: "text", chunk: "Hello " },
      { type: "text", chunk: "world!" },
      { type: "done", finishReason: "stop" },
    ];

    return {
      async *[Symbol.asyncIterator]() {
        for (const delta of mockDeltas) {
          yield delta;
        }
      },
    };
  },
});

describe("ChatPanel", () => {
  let mockProvider: ProviderAdapter;
  let chatStore: ChatStore;

  beforeEach(() => {
    mockProvider = createMockProvider();
    chatStore = new ChatStore(mockProvider);
  });

  it("should render chat panel with all components", () => {
    render(<ChatPanel chatController={chatStore} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("should handle message sending", async () => {
    render(<ChatPanel chatController={chatStore} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Hello world!")).toBeInTheDocument();
    });
  });

  it("should handle keyboard shortcuts", async () => {
    render(<ChatPanel chatController={chatStore} />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter", ctrlKey: true });

    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });
  });

  it("should show loading state during message sending", async () => {
    render(<ChatPanel chatController={chatStore} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    expect(sendButton).toBeDisabled();
    expect(screen.getByText(/sending/i)).toBeInTheDocument();
  });

  it("should handle errors gracefully", async () => {
    const errorProvider: ProviderAdapter = {
      async chat() {
        throw new Error("Chat error");
      },
    };

    const errorStore = new ChatStore(errorProvider);
    render(<ChatPanel chatController={errorStore} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

describe("MessageList", () => {
  let mockProvider: ProviderAdapter;
  let chatStore: ChatStore;

  beforeEach(() => {
    mockProvider = createMockProvider();
    chatStore = new ChatStore(mockProvider);
  });

  it("should render empty state when no messages", () => {
    render(<MessageList chatController={chatStore} />);

    expect(screen.getByText(/no messages/i)).toBeInTheDocument();
  });

  it("should render messages", async () => {
    await chatStore.send("Hello");

    render(<MessageList chatController={chatStore} />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });

  it("should render different message types", async () => {
    const toolStore = new ChatStore(mockProvider);
    toolStore.registerTool({
      name: "test_tool",
      title: "Test Tool",
      description: "A test tool",
      schema: {
        type: "object",
        properties: {
          input: { type: "string" },
        },
        required: ["input"],
      },
      execute: async (args: Record<string, unknown>, ctx) => ({
        result: args.input as string,
      }),
    });

    await toolStore.send('Use test_tool with input "test"');

    render(<MessageList chatController={toolStore} />);

    expect(
      screen.getByText('Use test_tool with input "test"')
    ).toBeInTheDocument();
  });

  it("should handle message timestamps", async () => {
    await chatStore.send("Hello");

    render(<MessageList chatController={chatStore} />);

    const messages = screen.getAllByText(/Hello/);
    expect(messages).toHaveLength(2);
  });
});

describe("Composer", () => {
  let mockProvider: ProviderAdapter;
  let chatStore: ChatStore;

  beforeEach(() => {
    mockProvider = createMockProvider();
    chatStore = new ChatStore(mockProvider);
  });

  it("should render composer with input and send button", () => {
    render(<Composer chatController={chatStore} />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("should handle text input", () => {
    render(<Composer chatController={chatStore} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello world" } });

    expect(input).toHaveValue("Hello world");
  });

  it("should handle send button click", async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);
    chatStore.send = mockSend;

    render(<Composer chatController={chatStore} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    expect(mockSend).toHaveBeenCalledWith("Hello");
  });

  it("should handle Enter key press", async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);
    chatStore.send = mockSend;

    render(<Composer chatController={chatStore} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockSend).toHaveBeenCalledWith("Hello");
  });

  it("should not send empty messages", () => {
    const mockSend = vi.fn();
    chatStore.send = mockSend;

    render(<Composer chatController={chatStore} />);

    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton);

    expect(mockSend).not.toHaveBeenCalled();
  });

  it("should disable input during loading", async () => {
    // Mock the status property
    Object.defineProperty(chatStore, "status", {
      value: "streaming",
      writable: true,
    });

    render(<Composer chatController={chatStore} />);

    const input = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /\.\.\./i });

    expect(input).toBeDisabled();
    expect(sendButton).toBeDisabled();
  });

  it("should handle multiline input", () => {
    render(<Composer chatController={chatStore} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Line 1\nLine 2" } });

    expect(input).toHaveValue("Line 1\nLine 2");
  });

  it("should handle Ctrl+Enter for new line", () => {
    render(<Composer chatController={chatStore} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter", ctrlKey: true });

    // Should not send message with Ctrl+Enter, but should add newline
    expect(input).toHaveValue("Hello\n");
  });
});
