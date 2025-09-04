import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AppProvider } from "../contexts/AppContext";
import { AppRoutes } from "./AppRoutes";

export interface AppNextProps {
  className?: string;
}

export function AppNext({ className = "" }: AppNextProps) {
  return (
    <div className={className}>
      <ThemeProvider defaultTheme="dark">
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ThemeProvider>
    </div>
  );
}
