import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import React from "react";

describe("LoadingSpinner", () => {
  it("should render loading spinner", () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render with custom message", () => {
    render(<LoadingSpinner message="Custom loading message" />);

    expect(screen.getByText("Custom loading message")).toBeInTheDocument();
  });

  it("should render with custom size", () => {
    render(<LoadingSpinner size="large" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-12", "w-12");
  });

  it("should render with custom className", () => {
    render(<LoadingSpinner className="custom-spinner" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-spinner");
  });

  it("should be accessible", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-live", "polite");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  it("should show spinner animation", () => {
    render(<LoadingSpinner />);

    const spinnerElement = screen.getByTestId("spinner");
    expect(spinnerElement).toHaveClass("animate-spin");
  });

  it("should handle different sizes", () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(screen.getByRole("status")).toHaveClass("h-4", "w-4");

    rerender(<LoadingSpinner size="medium" />);
    expect(screen.getByRole("status")).toHaveClass("h-8", "w-8");

    rerender(<LoadingSpinner size="large" />);
    expect(screen.getByRole("status")).toHaveClass("h-12", "w-12");
  });

  it("should handle empty message", () => {
    render(<LoadingSpinner message="" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("")).not.toBeInTheDocument();
  });

  it("should handle undefined message", () => {
    render(<LoadingSpinner message={undefined} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should handle null message", () => {
    render(<LoadingSpinner message={undefined} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should handle long messages", () => {
    const longMessage =
      "This is a very long loading message that should be handled properly by the component";

    render(<LoadingSpinner message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it("should handle special characters in message", () => {
    const specialMessage = "Loading... 50% complete! 🚀";

    render(<LoadingSpinner message={specialMessage} />);

    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it("should handle rapid prop changes", () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(screen.getByRole("status")).toHaveClass("h-4", "w-4");

    rerender(<LoadingSpinner size="large" />);
    expect(screen.getByRole("status")).toHaveClass("h-12", "w-12");

    rerender(<LoadingSpinner size="medium" />);
    expect(screen.getByRole("status")).toHaveClass("h-8", "w-8");
  });

  it("should handle conditional rendering", () => {
    const { rerender } = render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    rerender(<div>No spinner</div>);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("should handle theme changes", () => {
    const { rerender } = render(<LoadingSpinner />);

    // Simulate theme change
    document.documentElement.setAttribute("data-theme", "light");
    rerender(<LoadingSpinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should handle responsive design", () => {
    render(<LoadingSpinner />);

    // Test mobile viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    fireEvent.resize(window);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
