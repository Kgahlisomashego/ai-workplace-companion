import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail, type EmailTone } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in a formal, friendly or persuasive tone, then edit and copy the result.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content: "Generate professional workplace emails in seconds, then edit and copy the result.",
      },
    ],
  }),
  component: EmailPage,
});

const tones: Array<{ id: EmailTone; label: string; hint: string }> = [
  { id: "formal", label: "Formal", hint: "Measured and professional" },
  { id: "friendly", label: "Friendly", hint: "Warm and approachable" },
  { id: "persuasive", label: "Persuasive", hint: "Confident and action-driven" },
];

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<EmailTone>("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const result = await generateEmail({ purpose, context, keyPoints, tone });
    setOutput(result);
    setLoading(false);
  }

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the situation in a few lines and get a ready-to-send draft you can edit before copying."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-5 sm:p-6">
          <h2 className="text-base font-semibold">Email details</h2>

          <div className="mt-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of the email</Label>
              <Input
                id="purpose"
                placeholder="e.g. Requesting a deadline extension for the Q3 report"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Recipient & context</Label>
              <Textarea
                id="context"
                rows={3}
                placeholder="e.g. Priya, my project manager — she asked for the report by Friday"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Key points (one per line)</Label>
              <Textarea
                id="points"
                rows={5}
                placeholder={"Data from finance arrived late\nNeed two extra working days\nHappy to share a partial draft Friday"}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={cn(
                      "cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-colors",
                      tone === t.id
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-card hover:bg-accent/50",
                    )}
                  >
                    <span className="block text-sm font-medium">{t.label}</span>
                    <span className="block text-xs text-muted-foreground">{t.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={submit} disabled={loading || !purpose.trim()} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {loading ? "Writing your email…" : "Generate email"}
            </Button>
            {!purpose.trim() && (
              <p className="text-xs text-muted-foreground">Add a purpose to enable generation.</p>
            )}
          </div>
        </section>

        <section className="surface-card flex flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Generated email</h2>
            {output && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={submit} disabled={loading}>
                  <RefreshCw /> Regenerate
                </Button>
                <CopyButton value={output} />
              </div>
            )}
          </div>

          <div className="mt-5 flex-1">
            {loading ? (
              <div className="space-y-3">
                {[92, 78, 96, 64, 88, 72].map((w, i) => (
                  <div
                    key={i}
                    className="h-3.5 animate-pulse rounded bg-muted"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            ) : output ? (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="min-h-[26rem] resize-y font-sans text-sm leading-relaxed"
              />
            ) : (
              <div className="flex h-full min-h-[18rem] flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 text-center">
                <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft">
                  <Mail className="size-5 text-primary" />
                </span>
                <p className="mt-4 text-sm font-medium">Your draft appears here</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Fill in the details on the left and generate — the result stays fully editable.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
