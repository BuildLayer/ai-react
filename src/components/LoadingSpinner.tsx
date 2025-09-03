import React from "react";

export interface LoadingSpinnerProps {
  className?: string;
  message?: string;
  size?: "small" | "medium" | "large";
}

export function LoadingSpinner({
  className = "",
  message = "Loading...",
  size = "medium",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const containerClasses = ["flex items-center justify-center", className]
    .filter(Boolean)
    .join(" ");

  const spinnerClasses = [
    "animate-spin rounded-full border-b-2",
    sizeClasses[size],
    "border-accent",
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
