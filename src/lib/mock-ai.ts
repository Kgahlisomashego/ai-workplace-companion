/**
 * Mock AI layer.
 *
 * Every function here is async and returns the same shape a real API call
 * would, so swapping these implementations for a real AI endpoint later
 * only requires changing the bodies of these functions.
 */

export type EmailTone = "formal" | "friendly" | "persuasive";

export interface EmailRequest {
  purpose: string;
  context: string;
  keyPoints: string;
  tone: EmailTone;
}

export interface ResearchResult {
  summary: string;
  insights: string[];
  keyPoints: string[];
  recommendations: string[];
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toneOpeners: Record<EmailTone, string> = {
  formal: "I hope this message finds you well.",
  friendly: "Hope you're having a good week!",
  persuasive: "I wanted to reach out with something I believe is worth your time.",
};

const toneClosers: Record<EmailTone, string> = {
  formal: "Thank you for your time and consideration.\n\nKind regards,",
  friendly: "Thanks so much — let me know what you think!\n\nBest,",
  persuasive:
    "I'd welcome the chance to walk you through the details and agree on next steps.\n\nBest regards,",
};

const toneSubjects: Record<EmailTone, (purpose: string) => string> = {
  formal: (p) => `Regarding: ${p}`,
  friendly: (p) => `Quick note about ${p.toLowerCase()}`,
  persuasive: (p) => `An opportunity: ${p}`,
};

function bulletise(raw: string): string[] {
  return raw
    .split(/\n|;|•/)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean);
}

export async function generateEmail(req: EmailRequest): Promise<string> {
  await delay(1200);

  const purpose = req.purpose.trim() || "our recent discussion";
  const context = req.context.trim();
  const points = bulletise(req.keyPoints);

  const lines: string[] = [];
  lines.push(`Subject: ${toneSubjects[req.tone](purpose)}`);
  lines.push("");
  lines.push(context ? `Hi ${(context.split(/[,\n]/)[0] ?? "").trim()},` : "Hi there,");
  lines.push("");
  lines.push(toneOpeners[req.tone]);
  lines.push("");
  lines.push(
    req.tone === "persuasive"
      ? `I'm writing about ${purpose}, and why acting on it now would be valuable for the team.`
      : `I'm writing to you about ${purpose}.`,
  );

  if (context) {
    lines.push("");
    lines.push(`For context: ${context}`);
  }

  if (points.length) {
    lines.push("");
    lines.push(
      req.tone === "formal"
        ? "Please find the main points summarised below:"
        : "Here are the main things to know:",
    );
    lines.push("");
    points.forEach((point) => lines.push(`• ${point}`));
  }

  lines.push("");
  lines.push(
    req.tone === "persuasive"
      ? "If this sounds workable, I can prepare everything needed to move forward this week."
      : "Please let me know if you'd like me to expand on anything or adjust the approach.",
  );
  lines.push("");
  lines.push(toneClosers[req.tone]);
  lines.push("[Your name]");

  return lines.join("\n");
}

export async function runResearch(input: string): Promise<ResearchResult> {
  await delay(1400);

  const topic = input.trim().slice(0, 140) || "the submitted material";
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const isLongForm = words > 60;

  return {
    summary: isLongForm
      ? `The material covers ${topic.toLowerCase()} across roughly ${words} words. Its central argument is that measurable outcomes matter more than activity: teams that define success criteria up front, review them on a fixed cadence, and retire work that no longer serves those criteria consistently outperform teams that simply do more. Supporting detail focuses on process discipline, clear ownership, and short feedback loops rather than tooling.`
      : `"${topic}" is best understood as a practical workplace problem rather than a theoretical one. The strongest available thinking suggests starting narrow, defining what a good outcome looks like in one sentence, and validating that with the people affected before scaling the approach. Most failures here come from unclear ownership and undefined success criteria, not from a lack of effort or tools.`,
    insights: [
      "Outcomes improve fastest when a single owner is named for each workstream.",
      "Short review cycles surface problems while they are still cheap to fix.",
      "Documented decisions reduce repeated debate and speed up onboarding.",
    ],
    keyPoints: [
      `Scope: ${topic}`,
      "Define one measurable success criterion before starting.",
      "Identify stakeholders and the decision-maker early.",
      "Track only the few metrics that would change your decisions.",
    ],
    recommendations: [
      "Run a 30-minute framing session to agree on the success criterion.",
      "Pilot with one team for two weeks before rolling out more widely.",
      "Set a fixed review date and pre-commit to stopping if targets are missed.",
      "Share a one-page summary so decisions stay visible across the team.",
    ],
  };
}

const chatReplies: Array<{ match: RegExp; reply: string }> = [
  {
    match: /meeting|agenda|standup/i,
    reply:
      "Here's a tight agenda structure that works for most workplace meetings:\n\n1. **Purpose (2 min)** — one sentence on the decision to be made.\n2. **Context (5 min)** — the minimum background everyone needs.\n3. **Discussion (15 min)** — timeboxed, one topic at a time.\n4. **Decisions & owners (5 min)** — who does what, by when.\n5. **Close (3 min)** — confirm follow-ups in writing.\n\nSend the agenda 24 hours ahead and note anything attendees should read first.",
  },
  {
    match: /feedback|performance|review/i,
    reply:
      "Try the **Situation – Behaviour – Impact** model:\n\n- **Situation:** when and where it happened.\n- **Behaviour:** what was observed, without interpretation.\n- **Impact:** the effect on the work or the team.\n\nThen pause and ask for their view before agreeing on one specific change. Keeping it to a single behaviour per conversation makes it far more likely to stick.",
  },
  {
    match: /priorit|deadline|workload|busy|time/i,
    reply:
      "When everything feels urgent, separate **impact** from **urgency**:\n\n- High impact + urgent → do it today.\n- High impact + not urgent → schedule it this week, protect the time.\n- Low impact + urgent → delegate or timebox to 30 minutes.\n- Low impact + not urgent → decline explicitly rather than deferring silently.\n\nShare the resulting list with your manager — most re-prioritisation conflicts are really visibility problems.",
  },
  {
    match: /difficult|conflict|colleague|manager|raise/i,
    reply:
      "For a difficult conversation, prepare three things:\n\n1. **Your one sentence** — the point you must land, stated plainly.\n2. **Your evidence** — two or three specific, dated examples.\n3. **Your ask** — the concrete change or decision you want.\n\nOpen with the ask, not the history. Stay factual, allow silence, and close by summarising what you both agreed in writing.",
  },
  {
    match: /present|slide|deck|pitch/i,
    reply:
      "Structure the deck around a single takeaway:\n\n- **Slide 1:** the recommendation, stated as a sentence.\n- **Slides 2–4:** the three reasons it holds.\n- **Slide 5:** cost, risk and timeline.\n- **Slide 6:** the decision you need today.\n\nPut detail in an appendix rather than the main flow, and rehearse the opening ninety seconds out loud.",
  },
];

export async function chatReply(prompt: string): Promise<string> {
  await delay(1000);
  const hit = chatReplies.find((entry) => entry.match.test(prompt));
  if (hit) return hit.reply;

  return `Here's how I'd approach "${prompt.trim().slice(0, 120)}":\n\n1. **Clarify the outcome** — write one sentence describing what "done" looks like.\n2. **Identify constraints** — time, budget, approvals and who must be involved.\n3. **Draft a first version quickly** — a rough draft is easier to react to than a blank page.\n4. **Get one round of input** from the person who will approve it.\n5. **Confirm next steps in writing** so ownership and dates are unambiguous.\n\nTell me more about your specific situation and I can tailor this further.`;
}
