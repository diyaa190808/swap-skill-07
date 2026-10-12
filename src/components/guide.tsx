import { useState } from "react";
import { ArrowLeftRight, CalendarDays, Coins, Compass, Handshake, Sparkles, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  { i: ArrowLeftRight, t: "What is SwapSkill?", b: "A peer-to-peer space where students teach what they know and learn from each other." },
  { i: GraduationCap, t: "Teach & learn lists", b: "Add skills you can teach and skills you want. We use both to find great matches." },
  { i: Compass, t: "Explore", b: "Browse 40+ domains, filter by level, language and format, and open student profiles." },
  { i: Coins, t: "Credits", b: "Teaching earns credits, learning spends them. You always see the cost before you confirm." },
  { i: Handshake, t: "Request a session", b: "Chat, propose a time, agree, add a Meet/Zoom link — then both confirm when it's done." },
  { i: Users, t: "Community", b: "Share friend codes, post updates, message peers and join Skill Circles." },
  { i: CalendarDays, t: "Calendar", b: "Every confirmed session lands in your calendar — open it from the top bar anytime." },
  { i: Sparkles, t: "Meet Nova", b: "Tap the Nova bubble for help finding partners, planning a path or understanding credits." },
];

export function Guide({ onFinish }: { onFinish: () => void }) {
  const [i, setI] = useState(0);
  const S = STEPS[i]!;
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Progress value={((i + 1) / STEPS.length) * 100} className="h-2" aria-label="Guide progress" />
        <span className="shrink-0 text-xs font-semibold text-muted-foreground">{i + 1}/{STEPS.length}</span>
      </div>
      <div key={i} className="animate-rise text-center">
        <span className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow"><S.i className="size-8" /></span>
        <h2 className="text-2xl font-bold">{S.t}</h2>
        <p className="mx-auto mt-2 max-w-sm text-muted-foreground">{S.b}</p>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onFinish}>Skip</Button>
        <div className="flex gap-2">
          <Button variant="outline" disabled={i === 0} onClick={() => setI(i - 1)}>Back</Button>
          {i < STEPS.length - 1 ? <Button variant="hero" onClick={() => setI(i + 1)}>Next</Button> : <Button variant="hero" onClick={onFinish}>Finish</Button>}
        </div>
      </div>
    </div>
  );
}
