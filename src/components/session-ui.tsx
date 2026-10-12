import { useState } from "react";
import { CalendarClock, CheckCircle2, Coins, IndianRupee, Link2, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, DemoBadge } from "@/components/brand";
import { CREDIT_POLICY, canAfford, isDuplicate, sessionCost, type Payment, type Session } from "@/lib/credits";
import { findStudent, type Student } from "@/lib/data";
import { now, uid, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS: Record<Session["status"], { l: string; c: string }> = {
  proposed: { l: "Waiting for reply", c: "bg-warning/20 text-warning-foreground dark:text-warning" },
  confirmed: { l: "Confirmed", c: "bg-primary/15 text-primary" },
  awaiting_confirmation: { l: "Awaiting both confirmations", c: "bg-accent text-accent-foreground" },
  verified: { l: "Completed & verified", c: "bg-success/15 text-success" },
  declined: { l: "Declined", c: "bg-destructive/15 text-destructive" },
  cancelled: { l: "Cancelled", c: "bg-muted text-muted-foreground" },
};

export function StatusPill({ s }: { s: Session["status"] }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS[s].c)}>{STATUS[s].l}</span>;
}

export const fmtDate = (d: string, t: string) => new Date(`${d}T${t}`).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export function SessionCard({ s, compact }: { s: Session; compact?: boolean }) {
  const { set, advanceSession } = useApp();
  const peer = findStudent(s.peer);
  const [link, setLink] = useState(s.link ?? "");
  const patch = (p: Partial<Session>) => set((st) => ({ ...st, sessions: st.sessions.map((x) => (x.id === s.id ? { ...x, ...p } : x)) }));

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <Avatar name={peer?.name ?? s.peer} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{s.role === "learn" ? "Learn" : "Teach"} {s.skill}</p>
            <StatusPill s={s.status} />
          </div>
          <p className="text-sm text-muted-foreground">with {peer?.name} · {fmtDate(s.date, s.time)} · {s.duration} min</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {s.payment === "credits" ? <><Coins className="size-3" />{s.cost} credits {s.role === "learn" ? "on completion" : "earned on completion"}</> : <><IndianRupee className="size-3" />₹{s.price} paid directly to {peer?.name.split(" ")[0]}</>}
          </p>
          {s.link && <a href={s.link} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"><Video className="size-4" />Join meeting</a>}
        </div>
      </div>
      {!compact && (
        <div className="mt-3 space-y-2 border-t pt-3">
          {s.status === "proposed" && (
            <div className="flex flex-wrap items-center gap-2">
              <DemoBadge label="Simulate peer" />
              <Button size="sm" variant="success" onClick={() => { patch({ status: "confirmed" }); toast.success("Session confirmed"); }}>Accept</Button>
              <Button size="sm" variant="outline" onClick={() => patch({ status: "declined" })}>Decline</Button>
              <Button size="sm" variant="ghost" onClick={() => patch({ status: "cancelled" })}>Cancel request</Button>
            </div>
          )}
          {(s.status === "confirmed" || s.status === "awaiting_confirmation") && (
            <>
              <div className="flex gap-2">
                <div className="relative flex-1"><Link2 className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-8 pl-8 text-sm" placeholder="Paste Google Meet / Zoom link" value={link} onChange={(e) => setLink(e.target.value)} aria-label="Meeting link" /></div>
                <Button size="sm" variant="outline" onClick={() => { if (!/^https?:\/\//.test(link)) { toast.error("Enter a full link starting with https://"); return; } patch({ link }); toast.success("Meeting link saved"); }}>Save</Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant={s.meDone ? "secondary" : "hero"} disabled={s.meDone} onClick={() => advanceSession(s.id, "me")}><CheckCircle2 />{s.meDone ? "You confirmed" : "Mark completed"}</Button>
                {!s.peerDone && <><DemoBadge label="Simulate peer" /><Button size="sm" variant="outline" onClick={() => advanceSession(s.id, "peer")}>Peer confirms</Button></>}
                {s.peerDone && <span className="text-xs text-muted-foreground">Peer confirmed ✓</span>}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function ProposeDialog({ peer, open, onOpenChange, defaultSkill }: { peer: Student; open: boolean; onOpenChange: (o: boolean) => void; defaultSkill?: string }) {
  const { state, set } = useApp();
  const me = state.user!;
  const learnable = peer.teaches;
  const teachable = me.teach.filter((t) => peer.learns.includes(t));
  const [role, setRole] = useState<"learn" | "teach">("learn");
  const [skill, setSkill] = useState(defaultSkill ?? learnable[0]);
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState("18:00");
  const [duration, setDuration] = useState(60);
  const cost = sessionCost(duration);
  const enough = canAfford(me.credits, cost);
  const [payment, setPayment] = useState<Payment>(enough ? "credits" : "money");
  const price = peer.pricePerHour ? Math.round((peer.pricePerHour * duration) / 60) : undefined;
  const skills = role === "learn" ? learnable : teachable;

  function submit(): void {
    const fail = (m: string) => { toast.error(m); };
    if (!skill) return fail("Pick a skill");
    if (date < new Date().toISOString().slice(0, 10)) return fail("Choose a future date");
    if (role === "learn" && payment === "credits" && !enough) return fail("Not enough credits");
    if (role === "learn" && payment === "money" && !price) return fail(`${peer.name} doesn't accept money payments`);
    if (isDuplicate(state.sessions, { peer: peer.username, skill, date, time })) return fail("You already have this session booked");
    const s: Session = { id: uid(), peer: peer.username, skill, role, date, time, duration, cost, payment: role === "teach" ? "credits" : payment, price: payment === "money" ? price : undefined, status: "proposed", meDone: false, peerDone: false, settled: false };
    set((st) => ({
      ...st,
      sessions: [...st.sessions, s],
      chats: { ...st.chats, [peer.username]: [...(st.chats[peer.username] ?? []), { id: uid(), from: "me", text: `📅 Proposed: ${role === "learn" ? "learn" : "teach"} ${skill} on ${fmtDate(date, time)} (${duration} min)`, at: now() }] },
    }));
    toast.success("Session proposed — it's waiting for a reply");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><CalendarClock className="size-5 text-primary" />Propose a session with {peer.name.split(" ")[0]}</DialogTitle>
          <DialogDescription>Nothing is charged until both of you confirm the lesson happened.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-semibold">
            {(["learn", "teach"] as const).map((r) => (
              <button key={r} onClick={() => { setRole(r); setSkill((r === "learn" ? learnable : teachable)[0]); }} className={cn("rounded-lg py-1.5", role === r ? "bg-card shadow-card" : "text-muted-foreground")}>I want to {r}</button>
            ))}
          </div>
          {skills.length === 0 ? <p className="text-sm text-muted-foreground">{peer.name.split(" ")[0]} isn't looking for any skill you teach yet.</p> : (
            <div className="space-y-1.5"><Label>Skill</Label>
              <div className="flex flex-wrap gap-1.5">{skills.map((k) => <button key={k} onClick={() => setSkill(k)} className={cn("rounded-full border px-3 py-1 text-sm", skill === k && "border-primary bg-primary/10 text-primary")}>{k}</button>)}</div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1 space-y-1.5"><Label htmlFor="d">Date</Label><Input id="d" type="date" min={tomorrow} value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="t">Time</Label><Input id="t" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="du">Minutes</Label>
              <select id="du" value={duration} onChange={(e) => setDuration(+e.target.value)} className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm">{[30, 60, 90, 120].map((m) => <option key={m}>{m}</option>)}</select>
            </div>
          </div>
          <div className="rounded-xl border bg-soft p-3 text-sm">
            {role === "teach" ? (
              <p className="flex items-center gap-2"><Coins className="size-4 text-primary" />You'll <b>earn {cost} credits</b> once both confirm completion.</p>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold">How will you pay? <span className="font-normal text-muted-foreground">({CREDIT_POLICY.creditsPerHour} credits / hour)</span></p>
                <label className={cn("flex items-center gap-2 rounded-lg border bg-card p-2", !enough && "opacity-60")}>
                  <input type="radio" name="pay" disabled={!enough} checked={payment === "credits"} onChange={() => setPayment("credits")} />
                  <span><b>{cost} credits</b> · you have {me.credits}{!enough && ` — you need ${cost - me.credits} more`}</span>
                </label>
                <label className={cn("flex items-center gap-2 rounded-lg border bg-card p-2", !price && "opacity-60")}>
                  <input type="radio" name="pay" disabled={!price} checked={payment === "money"} onChange={() => setPayment("money")} />
                  <span>{price ? <><b>₹{price}</b> paid directly to {peer.name.split(" ")[0]} (no credits)</> : "Money payment not offered by this student"}</span>
                </label>
                {!enough && !price && <p className="text-xs text-muted-foreground">Tip: teach a session to earn credits first.</p>}
              </div>
            )}
          </div>
          <Button variant="hero" className="w-full" disabled={!skills.length} onClick={submit}>Send proposal</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
