# React Package Tests

This directory contains comprehensive tests for the AI UI SDK React package.

## Test Structure

```text
src/test/
├── setup.ts                        # React test setup and mocks
├── useChat.test.tsx                # useChat hook tests
├── useChatWithSessions.test.tsx    # Session management hook tests
├── components.test.tsx             # React component tests
└── README.md                      # This file
```

## Test Categories

### 1. Hook Tests

#### useChat Hook Tests (`useChat.test.tsx`)

Tests the core useChat hook functionality:

- **Initialization**: Hook setup and initial state
- **Message Sending**: Sending messages and handling responses
- **State Updates**: State changes during chat operations
- **Loading States**: Loading indicators and status updates
- **Error Handling**: Error scenarios and recovery
- **Action Functions**: All hook action functions
- **State Subscription**: State change notifications

#### useChatWithSessions Hook Tests (`useChatWithSessions.test.tsx`)

Tests session management functionality:

- **Session Creation**: Creating new chat sessions
- **Session Switching**: Switching between sessions
- **Session Deletion**: Removing sessions
- **Session Updates**: Updating session properties
- **Session Persistence**: localStorage integration
- **Session Import/Export**: Session data management
- **Multi-session State**: Managing multiple sessions

### 2. Component Tests (`components.test.tsx`)

Tests all React components:

#### ChatPanel Component

- **Rendering**: Component renders correctly
- **User Interaction**: Message sending and input handling
- **Keyboard Shortcuts**: Ctrl+Enter and other shortcuts
- **Loading States**: Loading indicators during operations
- **Error Handling**: Error display and recovery

#### ChatHeader Component

- **Rendering**: Header displays correctly
- **Session Information**: Session ID and metadata display
- **Export Functionality**: History export functionality

#### MessageList Component

- **Empty State**: No messages display
- **Message Display**: Various message types
- **Message Types**: User, assistant, tool messages
- **Timestamps**: Message timing information

#### Composer Component

- **Input Handling**: Text input and validation
- **Send Button**: Send button functionality
- **Keyboard Events**: Enter key and shortcuts
- **Empty Message Handling**: Preventing empty messages
- **Loading States**: Disabled state during operations
- **Multiline Input**: Multiline text handling

#### ToolDrawer Component

- **Tool Display**: Available tools listing
- **Tool Schema**: Tool schema information
- **Tool Execution**: Tool execution functionality
- **Tool Results**: Tool execution results display
- **Error Handling**: Tool execution errors
- **Empty State**: No tools available state

## Running Tests

### Run All React Tests

```bash
cd packages/react
pnpm test
```

### Run Specific Test Files

```bash
# Run hook tests
pnpm test useChat.test.tsx
pnpm test useChatWithSessions.test.tsx

# Run component tests
pnpm test components.test.tsx
```

### Run Tests with Coverage

```bash
pnpm test --coverage
```

### Run Tests in Watch Mode

```bash
pnpm test --watch
```

## Test Setup

The `setup.ts` file configures the React test environment:

- **React Testing Library**: Component testing utilities
- **Jest DOM**: Additional DOM matchers
- **React Router**: Router mocking
- **localStorage**: Browser storage mocking
- **Window APIs**: Browser API mocking

## Mock Data

Tests use realistic mock data:

- **Chat Messages**: Various message types and formats
- **Session Data**: Different session states and configurations
- **Tool Definitions**: Tool schemas and execution results
- **User Input**: Different user input scenarios
- **Error Scenarios**: Various error conditions

## Test Utilities

### React Testing Utilities

- **render**: Component rendering
- **screen**: DOM querying
- **fireEvent**: User interaction simulation
- **waitFor**: Async operation waiting
- **act**: State update handling

### Custom Test Utilities

- **Mock ChatStore**: Pre-configured chat store mocks
- **Mock Providers**: Provider adapter mocks
- **Test Data**: Reusable test data and fixtures
- **Assertions**: Custom assertions for React components

## Best Practices

### Writing React Tests

1. **Test User Behavior**: Focus on what users can see and do
2. **Use Semantic Queries**: Prefer accessible queries over implementation details
3. **Test Accessibility**: Verify ARIA attributes and keyboard navigation
4. **Mock External Dependencies**: Mock chat stores and providers
5. **Test Error States**: Include error scenarios and recovery

### Component Testing

1. **Test Rendering**: Verify components render correctly
2. **Test Interactions**: Test user interactions and events
3. **Test Props**: Test different prop combinations
4. **Test State Changes**: Verify state updates and side effects
5. **Test Error Boundaries**: Test error handling and recovery

### Hook Testing

1. **Test Hook Behavior**: Focus on hook functionality, not implementation
2. **Test State Updates**: Verify state changes and side effects
3. **Test Dependencies**: Test hook dependencies and effects
4. **Test Error Handling**: Test error scenarios and recovery
5. **Test Memoization**: Verify hook optimization and memoization

## Test Patterns

### Component Test Pattern

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatPanel } from '../components/ChatPanel';

describe('ChatPanel', () => {
  it('should handle user input and send messages', async () => {
    render(<ChatPanel chatController={mockChatStore} />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });
});
```

### Hook Test Pattern

```typescript
import { renderHook, act } from '@testing-library/react';
import { useChat } from '../hooks/useChat';

describe('useChat', () => {
  it('should provide chat functionality', () => {
    const { result } = renderHook(() => useChat(mockChatStore));
    
    expect(result.current.messages).toEqual([]);
    expect(typeof result.current.send).toBe('function');
  });
});
```

## Troubleshooting

### Common Issues

1. **Component Not Rendering**: Check test environment and setup
2. **Mock Not Working**: Verify mock setup and import order
3. **Async Test Hanging**: Ensure proper async/await usage
4. **Event Not Firing**: Check event simulation and component state

### Debugging

1. **Use screen.debug()**: Debug component rendering
2. **Check Console Logs**: Look for error messages and warnings
3. **Verify Mocks**: Ensure mocks are properly configured
4. **Review Test Setup**: Check test environment configuration

## Coverage

### Coverage Targets

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/index.html`
- **JSON Report**: `coverage/coverage-final.json`
- **Text Report**: Console output

## Contributing

### Adding New Tests

1. **Follow Naming Convention**: Use descriptive test names
2. **Add to Appropriate File**: Add tests to the most relevant test file
3. **Update Documentation**: Update this README if adding new test categories
4. **Ensure Coverage**: Verify new tests improve coverage

### Test Review

1. **Code Review**: All tests are reviewed with code changes
2. **Quality Gates**: Test quality is enforced in reviews
3. **Best Practices**: Follow established testing best practices
4. **Documentation**: Keep test documentation up to date
