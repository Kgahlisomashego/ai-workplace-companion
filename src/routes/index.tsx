import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Mail, MessagesSquare, ShieldCheck, Zap } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      {
        name: "description",
        content:
          "Draft professional emails, summarise research and get workplace answers with a clean, no-login AI productivity assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft professional emails, summarise research and get workplace answers with a clean, no-login AI productivity assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few bullet points into a polished email in a formal, friendly or persuasive tone.",
    action: "Write an email",
  },
  {
    to: "/research",
    icon: BookOpen,
    title: "AI Research Assistant",
    body: "Summarise a topic, question or article and get key points, insights and recommendations.",
    action: "Start researching",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Workplace Chatbot",
    body: "Ask about meetings, feedback, prioritisation or difficult conversations and get practical guidance.",
    action: "Open chat",
  },
] as const;

const stats = [
  { icon: Zap, label: "Ready instantly", value: "No setup" },
  { icon: ShieldCheck, label: "Nothing stored", value: "No account" },
  { icon: MessagesSquare, label: "Assistants", value: "3 tools" },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Your AI workspace"
      description="Three focused assistants for the writing, reading and thinking work that fills a professional day."
    >
      <section className="brand-gradient relative overflow-hidden rounded-2xl px-6 py-8 sm:px-10 sm:py-12">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary-foreground/70 uppercase">
            Workplace AI
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-primary-foreground sm:text-3xl">
            Do the routine work in minutes, not hours.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">
            Generate emails, digest long documents and get grounded advice — all editable, all
            yours to refine before you send.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link to="/email">
                Generate an email <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              <Link to="/chat">Try the chatbot</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="surface-card flex items-center gap-3 p-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft">
              <Icon className="size-4 text-primary" />
            </span>
            <span>
              <span className="block text-sm font-semibold">{value}</span>
              <span className="block text-xs text-muted-foreground">{label}</span>
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-lg font-semibold">Available tools</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, body, action }) => (
          <Link key={to} to={to} className="surface-card hover-lift group flex flex-col p-5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft">
              <Icon className="size-5 text-primary" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              {action}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
