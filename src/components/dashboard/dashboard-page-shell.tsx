"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { MobileSidebar, Sidebar } from "@/components/layout/sidebar";
import { AiChatPanel } from "@/components/dashboard/ai-chat-panel";

// Shared chrome (sidebar, mobile nav, AI chat panel) for every /dashboard/*
// page — DashboardShell and secondary pages like About both mount inside
// this instead of duplicating the sidebar wiring.
export function DashboardPageShell({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="farm-backdrop relative min-h-screen w-full">
      <div className="relative z-10 flex min-h-screen gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="sticky top-4 hidden h-[calc(100vh-2rem)] shrink-0 lg:block">
          <Sidebar onOpenChat={() => setIsChatOpen(true)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
          <div className="glass-panel-strong flex items-center justify-between rounded-2xl px-4 py-3 lg:hidden">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/images/logo-farm.png"
                  alt="AgroSight logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
              <span className="font-semibold">AgroSight</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
          </div>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      <MobileSidebar
        open={isMobileNavOpen}
        onOpenChange={setIsMobileNavOpen}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <AiChatPanel open={isChatOpen} onOpenChange={setIsChatOpen} />
    </div>
  );
}
