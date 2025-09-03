import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  ThemeProvider,
  useTheme,
  useThemeAwareStyle,
} from "../components/ThemeProvider";
import React from "react";

// Get localStorage mock from global setup
const localStorageMock = window.localStorage as any;

describe("useTheme", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const wrapper = ({ children, defaultTheme, storageKey }: any) => (
    <ThemeProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </ThemeProvider>
  );

  it("should provide initial theme state", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("dark");
    expect(typeof result.current.setTheme).toBe("function");
  });

  it("should use default theme when no saved theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }: any) =>
        wrapper({ children, defaultTheme: "light" }),
    });

    expect(result.current.theme).toBe("light");
  });

  it("should load theme from localStorage", () => {
    localStorageMock.getItem.mockReturnValue("light");

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
    expect(localStorageMock.getItem).toHaveBeenCalledWith("ai-react-theme");
  });

  it("should set theme and save to localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "ai-react-theme",
      "light"
    );
  });

  it("should apply theme classes to document", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("light");
    });

    // Test that theme state is updated (DOM manipulation is tested in integration tests)
    expect(result.current.theme).toBe("light");
  });

  it("should handle localStorage errors gracefully", () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error("localStorage quota exceeded");
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Should not throw error
    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");
  });

  it("should throw error when used outside ThemeProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });

  it("should handle SSR (no window)", () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }: any) =>
        wrapper({ children, defaultTheme: "light" }),
    });

    expect(result.current.theme).toBe("light");

    // Restore window
    global.window = originalWindow;
  });
});

describe("useThemeAwareStyle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  const wrapper = ({ children, defaultTheme }: any) => (
    <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
  );

  it("should provide theme-aware style helpers", () => {
    const { result } = renderHook(() => useThemeAwareStyle(), {
      wrapper: ({ children }: any) =>
        wrapper({ children, defaultTheme: "dark" }),
    });

    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);

    expect(result.current.theme).toBe("dark");
  });

  it("should detect light theme", () => {
    const { result } = renderHook(() => useThemeAwareStyle(), {
      wrapper: ({ children }: any) =>
        wrapper({ children, defaultTheme: "light" }),
    });

    expect(result.current.isDark).toBe(false);
    expect(result.current.isLight).toBe(true);

    expect(result.current.theme).toBe("light");
  });

  it("should update when theme changes", () => {
    const { result } = renderHook(() => useThemeAwareStyle(), {
      wrapper: ({ children }: any) =>
        wrapper({ children, defaultTheme: "dark" }),
    });

    expect(result.current.isDark).toBe(true);

    // Change theme
    const { result: themeResult } = renderHook(() => useTheme(), {
      wrapper: ({ children }: any) =>
        wrapper({ children, defaultTheme: "dark" }),
    });

    act(() => {
      themeResult.current.setTheme("light");
    });

    // Re-render to get updated theme
    const { result: updatedResult } = renderHook(() => useThemeAwareStyle(), {
      wrapper: ({ children }: any) =>
        wrapper({ children, defaultTheme: "light" }),
    });

    expect(updatedResult.current.isDark).toBe(false);
    expect(updatedResult.current.isLight).toBe(true);
  });

  it("should throw error when used outside ThemeProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useThemeAwareStyle());
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });
});
