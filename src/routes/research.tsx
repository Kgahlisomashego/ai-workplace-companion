import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Lightbulb, ListChecks, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runResearch, type ResearchResult } from "@/lib/mock-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Paste a topic, question or article and get a clear summary with key points, insights and practical recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content: "Summarise topics and articles into key points, insights and recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

const examples = [
  "How should a hybrid team run effective weekly planning?",
  "Summarise the business case for asynchronous communication.",
  "What are the risks of rolling out AI tools without training?",
];

function ResultList({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Lightbulb;
  title: string;
  items: string[];
}) {
  return (
    <div className="surface-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        {title}
      </h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function toPlainText(r: ResearchResult) {
  return [
    "SUMMARY",
    r.summary,
    "",
    "KEY POINTS",
    ...r.keyPoints.map((p) => `- ${p}`),
    "",
    "INSIGHTS",
    ...r.insights.map((p) => `- ${p}`),
    "",
    "RECOMMENDATIONS",
    ...r.recommendations.map((p) => `- ${p}`),
  ].join("\n");
}

function ResearchPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setResult(await runResearch(input));
    setLoading(false);
  }

  return (
    <AppShell
      title="AI Research Assistant"
      description="Drop in a topic, question or full article and get a structured breakdown you can act on."
    >
      <section className="surface-card p-5 sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic, question or article text</Label>
          <Textarea
            id="topic"
            rows={7}
            placeholder="Paste an article, or ask a question like 'How do we reduce meeting overload across the team?'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setInput(ex)}
              className="cursor-pointer rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {ex}
            </button>
          ))}
        </div>

        <Button
          onClick={submit}
          disabled={loading || !input.trim()}
          className="mt-5 w-full sm:w-auto"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? "Analysing…" : "Analyse"}
        </Button>
      </section>

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="surface-card space-y-3 p-5">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="surface-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold">Summary</h3>
                <CopyButton value={toPlainText(result)} label="Copy all" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ResultList icon={ListChecks} title="Key points" items={result.keyPoints} />
              <ResultList icon={Lightbulb} title="Insights" items={result.insights} />
            </div>
            <ResultList
              icon={CheckCircle2}
              title="Practical recommendations"
              items={result.recommendations}
            />
          </div>
        ) : (
          <div className="surface-card flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft">
              <BookOpen className="size-5 text-primary" />
            </span>
            <p className="mt-4 text-sm font-medium">No analysis yet</p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
              Add a topic above or pick one of the examples to see a summary, key points, insights
              and recommendations.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
