import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AppProvider } from "../contexts/AppContext";

export interface NextLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function NextLayout({ children, className = "" }: NextLayoutProps) {
  return (
    <div className={className}>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>{children}</AppProvider>
      </ThemeProvider>
    </div>
  );
}
