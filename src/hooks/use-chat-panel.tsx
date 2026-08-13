"use client";

import { createContext, useContext } from "react";

// Lets any page nested under DashboardPageShell trigger the shared AI chat
// panel (whose open/closed state is owned by the shell) without prop
// drilling — e.g. the Knowledge Base page's "Ask Farm AI" card.
interface ChatPanelContextValue {
  openChat: () => void;
}

const ChatPanelContext = createContext<ChatPanelContextValue | null>(null);

export function ChatPanelProvider({
  openChat,
  children,
}: {
  openChat: () => void;
  children: React.ReactNode;
}) {
  return <ChatPanelContext.Provider value={{ openChat }}>{children}</ChatPanelContext.Provider>;
}

export function useChatPanel() {
  const ctx = useContext(ChatPanelContext);
  if (!ctx) {
    throw new Error("useChatPanel must be used within a ChatPanelProvider");
  }
  return ctx;
}
