"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BarChart3,
  BookOpen,
  FileText,
  Info,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sparkles,
  Sprout,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Sprout, label: "Fields" },
  { icon: FileText, label: "Reports" },
  { icon: Users, label: "Team" },
  { icon: BookOpen, label: "Knowledge Base" },
  { icon: BarChart3, label: "Analytics" },
];

interface SidebarProps {
  onOpenChat: () => void;
}

export function Sidebar({ onOpenChat }: SidebarProps) {
  return (
    <aside className="glass-panel-strong hidden h-full w-16 shrink-0 flex-col items-center justify-between rounded-2xl py-4 lg:flex">
      <div className="flex flex-col items-center gap-2">
        <div className="mb-3 flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl">
          <Image
            src="/images/logo-farm.png"
            alt="AgroSight logo"
            width={36}
            height={36}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        {NAV_ITEMS.map((item) => (
          <NavIcon key={item.label} {...item} />
        ))}

        <div className="my-1 h-px w-6 bg-border" />

        <NavIcon
          icon={Sparkles}
          label="AI Assistant"
          onClick={onOpenChat}
          highlight
        />
        <NavIcon icon={Settings} label="Settings" />
        <NavIcon icon={Info} label="About" />
      </div>

      <div className="flex flex-col items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </aside>
  );
}

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChat: () => void;
}

export function MobileSidebar({ open, onOpenChange, onOpenChat }: MobileSidebarProps) {
  const closeThen = (fn?: () => void) => () => {
    fn?.();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent showClose={false} side="left" className="flex w-72 flex-col gap-0 p-0">
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b border-border px-4 py-4 text-left">
          <SheetTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/images/logo-farm.png"
                alt="AgroSight logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </span>
            AgroSight
          </SheetTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <MobileNavRow key={item.label} icon={item.icon} label={item.label} active={item.active} onClick={closeThen()} />
          ))}

          <div className="my-2 h-px bg-border" />

          <MobileNavRow icon={Sparkles} label="AI Assistant" highlight onClick={closeThen(onOpenChat)} />
          <MobileNavRow icon={Settings} label="Settings" onClick={closeThen()} />
          <MobileNavRow icon={Info} label="About" onClick={closeThen()} />
        </nav>

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <UserMenu />
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavRow({
  icon: Icon,
  label,
  active,
  highlight,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-primary",
        highlight && "text-primary"
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
      {label}
    </button>
  );
}

function UserMenu() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="rounded-full transition-opacity hover:opacity-80"
        >
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src="/images/famer-user.png" alt="Account avatar" />
            <AvatarFallback className="bg-secondary text-xs">AS</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-48">
        <DropdownMenuLabel className="flex flex-col">
          <span>Adrian Sora</span>
          <span className="text-xs font-normal text-muted-foreground">
            Farm Manager
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="h-3.5 w-3.5" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="h-3.5 w-3.5" />
          Account settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => router.push("/login")}
        >
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <NavIcon
      icon={isDark ? Sun : Moon}
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    />
  );
}

function NavIcon({
  icon: Icon,
  label,
  active,
  highlight,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            active && "bg-accent text-primary",
            highlight && "text-primary"
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
