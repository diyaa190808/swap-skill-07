import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREDIT_POLICY } from "@/lib/credits";
import { STUDENTS, matchScore } from "@/lib/data";
import { useApp, type State } from "@/lib/store";
import { fmtDate } from "./session-ui";
import { cn } from "@/lib/utils";

type M = { from: "me" | "nova"; text: string };

/** Rule-based helper that reads the student's own data. No AI model is connected. */
export function novaReply(q: string, s: State): string {
  const t = q.toLowerCase();
  const u = s.user!;
  if (/match|partner|who|find/.test(t)) {
    const top = STUDENTS.map((st) => ({ st, m: matchScore(u, st) })).filter((x) => x.m.score > 0).sort((a, b) => b.m.score - a.m.score).slice(0, 3);
    if (!top.length) return "I couldn't find a match yet. Add more skills to your learn list on your Profile and I'll look again.";
    return "Your best matches right now:\n" + top.map((x) => `• ${x.st.name} (@${x.st.username}) — ${x.m.reasons[0]}`).join("\n");
  }
  if (/credit|cost|pay|wallet|earn/.test(t))
    return `You have ${u.credits} credits. Teaching earns ${CREDIT_POLICY.creditsPerHour} credits/hour and learning spends the same. Credits only move after BOTH of you mark a session completed. If you're short, some students accept direct payment — you'll always choose explicitly.`;
  if (/session|schedule|upcoming|calendar|week/.test(t)) {
    const up = s.sessions.filter((x) => ["proposed", "confirmed", "awaiting_confirmation"].includes(x.status));
    if (!up.length) return "You have no upcoming sessions. Open a profile from Explore and tap “Propose session”.";
    return "Your upcoming sessions:\n" + up.map((x) => `• ${x.skill} with @${x.peer} — ${fmtDate(x.date, x.time)}`).join("\n");
  }
  if (/path|plan|learn|goal|roadmap/.test(t)) {
    const l = u.learn[0];
    if (!l) return "Add a skill to your learn list first, then I'll suggest a path.";
    return `A simple path for ${l}:\n1. One intro session (60 min) with a peer who teaches it\n2. A practice mini-project on your own\n3. A feedback session to review it\n4. Join a Skill Circle to keep momentum\nThat's about ${CREDIT_POLICY.creditsPerHour * 2} credits for the two peer sessions.`;
  }
  if (/friend|code|community/.test(t)) return `Your friend code is ${u.friendCode}. Share it, or enter someone else's on the Community page to send a request.`;
  return "I can help with: finding partners, credits, your upcoming sessions, a learning plan, or friend codes. Try one of the suggestions below.";
}

const SUGGEST = ["Find me a partner", "How do credits work?", "My upcoming sessions", "Plan my learning path"];

export function Nova() {
  const { state } = useApp();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<M[]>([{ from: "nova", text: "Hi, I'm Nova 👋 I can help you find partners, plan sessions and understand credits." }]);
  const [q, setQ] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const ask = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "me", text }, { from: "nova", text: novaReply(text, state) }]);
    setQ("");
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label={open ? "Close Nova" : "Open Nova assistant"} className="fixed bottom-20 right-4 z-40 grid size-14 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow transition hover:scale-105 md:bottom-6 md:right-6">
        {open ? <X /> : <Sparkles />}
      </button>
      {open && (
        <div role="dialog" aria-label="Nova assistant" className="fixed bottom-36 right-4 z-40 flex h-[min(560px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-card shadow-glow animate-rise md:bottom-24 md:right-6">
          <div className="bg-brand p-4 text-primary-foreground">
            <p className="flex items-center gap-2 font-display text-lg font-bold"><Sparkles className="size-5" />Nova</p>
            <p className="text-xs opacity-90">Offline helper · answers from your SwapSkill data · no AI model connected yet</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={cn("max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm", m.from === "me" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted")}>{m.text}</div>
            ))}
            <div ref={end} />
          </div>
          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {SUGGEST.map((s) => <button key={s} onClick={() => ask(s)} className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted">{s}</button>)}
            <Link to="/explore" onClick={() => setOpen(false)} className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted">Go to Explore →</Link>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="flex gap-2 border-t p-3">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask Nova…" aria-label="Message Nova" />
            <Button type="submit" size="icon" variant="hero" aria-label="Send"><Send /></Button>
          </form>
        </div>
      )}
    </>
  );
}
