import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, LayoutDashboard, Mail, BookOpen, MessagesSquare, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AiDisclaimer } from "@/components/ai-disclaimer";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground",
          }}
        >
          <Icon className="size-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar p-4">
      <Link to="/" onClick={onNavigate} className="mb-8 flex items-center gap-3 px-2 pt-2">
        <span className="brand-gradient flex size-9 items-center justify-center rounded-lg">
          <Sparkles className="size-4 text-primary-foreground" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold text-sidebar-accent-foreground">
            Workplace AI
          </span>
          <span className="block text-xs text-sidebar-foreground/60">Productivity Assistant</span>
        </span>
      </Link>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto rounded-lg bg-sidebar-accent/60 p-3">
        <p className="text-xs font-medium text-sidebar-accent-foreground">Demo workspace</p>
        <p className="mt-1 text-xs leading-relaxed text-sidebar-foreground/60">
          No sign-in needed. Responses are simulated for this prototype.
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarInner />
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="animate-in slide-in-from-left absolute inset-y-0 left-0 w-72 duration-200">
            <SidebarInner onNavigate={() => setOpen(false)} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-2 text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Close navigation"
            >
              <X />
            </Button>
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu />
          </Button>
          <span className="font-display text-sm font-semibold">Workplace AI</span>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
            <p className={cn("mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base")}>
              {description}
            </p>
          </div>
          {children}
          <AiDisclaimer className="mt-10" />
        </main>
      </div>
    </div>
  );
}
