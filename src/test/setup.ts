import { vi } from "vitest";
import "@testing-library/jest-dom";
import React from "react";

// Mock DOM environment
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, "innerHeight", {
  writable: true,
  configurable: true,
  value: 768,
});

// Mock document methods
Object.defineProperty(document, "querySelector", {
  writable: true,
  configurable: true,
  value: vi.fn(() => null),
});

Object.defineProperty(document, "addEventListener", {
  writable: true,
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(document, "removeEventListener", {
  writable: true,
  configurable: true,
  value: vi.fn(),
});

Object.defineProperty(document, "createElement", {
  writable: true,
  configurable: true,
  value: vi.fn(() => ({
    setAttribute: vi.fn(),
    textContent: "",
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  })),
});

// Mock document.documentElement.style for React DOM
Object.defineProperty(document.documentElement, "style", {
  writable: true,
  configurable: true,
  value: new Proxy(
    {},
    {
      get(target, prop) {
        if (typeof prop === "string" && prop.startsWith("Webkit")) {
          return "";
        }
        return vi.fn();
      },
      has(target, prop) {
        if (typeof prop === "string" && prop.startsWith("Webkit")) {
          return true;
        }
        return true;
      },
    }
  ),
});

// Mock document.documentElement.classList
Object.defineProperty(document.documentElement, "classList", {
  writable: true,
  configurable: true,
  value: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
    toggle: vi.fn(),
  },
});

// Mock React Router
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({ pathname: "/" })),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ children }: { children: React.ReactNode }) => children,
  Navigate: ({ to }: { to: string }) =>
    React.createElement("div", { "data-testid": "navigate", "data-to": to }),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
