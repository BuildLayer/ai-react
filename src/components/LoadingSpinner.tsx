import React from "react";

export interface LoadingSpinnerProps {
  className?: string;
  message?: string;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "accent";
  inline?: boolean;
  centered?: boolean;
  overlay?: boolean;
}

export function LoadingSpinner({
  className = "",
  message = "Loading...",
  size = "medium",
  color = "accent",
  inline = false,
  centered = false,
  overlay = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
  };

  const containerClasses = [
    "flex items-center justify-center",
    inline && "inline-flex",
    centered && "min-h-screen",
    overlay && "fixed inset-0 bg-black bg-opacity-50 z-50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinnerClasses = [
    "animate-spin rounded-full border-b-2",
    sizeClasses[size],
    colorClasses[color],
  ].join(" ");

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div
          data-testid="spinner"
          className={spinnerClasses}
          role="status"
          aria-live="polite"
          aria-label="Loading"
        />
        {message && <p className="text-secondary mt-2">{message}</p>}
      </div>
    </div>
  );
}
