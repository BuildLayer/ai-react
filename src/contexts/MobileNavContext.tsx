import React, { createContext, useContext, useState, ReactNode } from "react";

export interface MobileNavContextType {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const MobileNavContext = createContext<MobileNavContextType | undefined>(
  undefined
);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <MobileNavContext.Provider value={{ isOpen, toggleMenu, closeMenu }}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav() {
  const context = useContext(MobileNavContext);
  if (context === undefined) {
    throw new Error("useMobileNav must be used within a MobileNavProvider");
  }
  return context;
}
