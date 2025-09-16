import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '../hooks/useChat';
import { ChatStore } from '../core/mocks/ai-core';
import type {
  ProviderAdapter,
  ChatRequest,
  Delta,
} from '../core/mocks/ai-core';

// Mock provider adapter
const createMockProvider = (): ProviderAdapter => ({
  async sendMessage(request: ChatRequest) {
    const mockDeltas: Delta[] = [
      { type: 'text', content: 'Hello ' },
      { type: 'text', content: 'world!' },
      { type: 'done', content: 'stop' },
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

describe('useChat', () => {
  let mockProvider: ProviderAdapter;
  let chatStore: ChatStore;

  beforeEach(() => {
    mockProvider = createMockProvider();
    chatStore = new ChatStore(mockProvider);
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useChat(chatStore));

    expect(result.current.messages).toEqual([]);
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeUndefined();
    expect(result.current.sessionId).toBeDefined();
  });

  it('should provide send function', () => {
    const { result } = renderHook(() => useChat(chatStore));

    expect(typeof result.current.send).toBe('function');
  });

  it('should provide other action functions', () => {
    const { result } = renderHook(() => useChat(chatStore));

    expect(typeof result.current.stop).toBe('function');
    expect(typeof result.current.reset).toBe('function');
    expect(typeof result.current.importHistory).toBe('function');
    expect(typeof result.current.exportHistory).toBe('function');
    expect(typeof result.current.clearHistory).toBe('function');
  });

  it('should update state when sending message', async () => {
    const { result } = renderHook(() => useChat(chatStore));

    await act(async () => {
      await result.current.send('Hello');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]?.role).toBe('user');
    expect(result.current.messages[0]?.content[0]).toEqual({
      type: 'text',
      text: 'Hello',
    });
    expect(result.current.messages[1]?.role).toBe('assistant');
    expect(result.current.messages[1]?.content[0]).toEqual({
      type: 'text',
      text: 'Hello world!',
    });
  });

  it('should update loading state during send', async () => {
    const { result } = renderHook(() => useChat(chatStore));

    expect(result.current.status).toBe('idle');

    const sendPromise = act(async () => {
      await result.current.send('Hello');
    });

    expect(result.current.status).toBe('streaming');

    await sendPromise;

    expect(result.current.status).toBe('idle');
  });

  it('should handle send errors', async () => {
    const errorProvider: ProviderAdapter = {
      async sendMessage() {
        throw new Error('Send failed');
      },
    };

    const errorStore = new ChatStore(errorProvider);
    const { result } = renderHook(() => useChat(errorStore));

    await act(async () => {
      try {
        await result.current.send('Hello');
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.status).toBe('error');
  });

  it('should reset state when reset is called', async () => {
    const { result } = renderHook(() => useChat(chatStore));

    await act(async () => {
      await result.current.send('Hello');
    });

    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeUndefined();
  });

  it('should export and import history', async () => {
    const { result } = renderHook(() => useChat(chatStore));

    await act(async () => {
      await result.current.send('Hello');
    });

    const history = result.current.exportHistory();
    expect(history).toHaveLength(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.messages).toEqual([]);

    act(() => {
      result.current.importHistory(history);
    });

    expect(result.current.messages).toEqual(history);
  });

  it('should clear history', async () => {
    const { result } = renderHook(() => useChat(chatStore));

    await act(async () => {
      await result.current.send('Hello');
    });

    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.messages).toEqual([]);
  });

  it('should stop ongoing operations', async () => {
    const { result } = renderHook(() => useChat(chatStore));

    const sendPromise = act(async () => {
      await result.current.send('Hello');
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.status).toBe('idle');

    await sendPromise;
  });

  it('should memoize action functions', () => {
    const { result, rerender } = renderHook(() => useChat(chatStore));

    const firstSend = result.current.send;
    const firstStop = result.current.stop;
    const firstReset = result.current.reset;

    rerender();

    expect(result.current.send).toBe(firstSend);
    expect(result.current.stop).toBe(firstStop);
    expect(result.current.reset).toBe(firstReset);
  });

  it('should update when chat store state changes', async () => {
    const { result } = renderHook(() => useChat(chatStore));

    // Directly modify the chat store
    act(() => {
      chatStore.importHistory([
        {
          id: 'msg_1',
          role: 'user',
          content: [{ type: 'text', text: 'Direct message' }],
          createdAt: Date.now(),
        },
      ]);
    });

    expect(result.current.messages).toHaveLength(1);
    expect((result.current.messages[0]?.content[0] as any).text).toBe(
      'Direct message'
    );
  });
});
