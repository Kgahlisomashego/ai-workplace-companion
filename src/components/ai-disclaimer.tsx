import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-3.5 shrink-0" />
      <span>
        AI-generated content can be inaccurate or incomplete. Always review and edit results before
        using them for important workplace decisions or communication.
      </span>
    </p>
  );
}
