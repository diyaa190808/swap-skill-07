/** Central, configurable credit policy. Change values here — nothing else hardcodes them. */
export const CREDIT_POLICY = {
  welcomeCredits: 50,
  creditsPerHour: 10,
  minDurationMin: 30,
};

export type SessionStatus = "proposed" | "confirmed" | "awaiting_confirmation" | "verified" | "declined" | "cancelled";
export type Payment = "credits" | "money";

export type Session = {
  id: string;
  peer: string;
  skill: string;
  role: "learn" | "teach";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  cost: number; // credits
  payment: Payment;
  price?: number; // INR when payment = money
  status: SessionStatus;
  link?: string;
  meDone: boolean;
  peerDone: boolean;
  settled: boolean;
};

export type Tx = { id: string; at: string; amount: number; label: string; sessionId?: string; kind: "earn" | "spend" | "bonus" | "info" };

export function sessionCost(durationMin: number, rate = CREDIT_POLICY.creditsPerHour) {
  const d = Math.max(durationMin, CREDIT_POLICY.minDurationMin);
  return Math.ceil((d / 60) * rate);
}

export const canAfford = (balance: number, cost: number) => balance >= cost;

/** Move a session forward when one side marks it done. Both must confirm before it becomes verified. */
export function markDone(s: Session, who: "me" | "peer"): Session {
  if (s.status !== "confirmed" && s.status !== "awaiting_confirmation") return s;
  const next = { ...s, meDone: who === "me" ? true : s.meDone, peerDone: who === "peer" ? true : s.peerDone };
  next.status = next.meDone && next.peerDone ? "verified" : "awaiting_confirmation";
  return next;
}

/**
 * Settle a verified session exactly once. Returns the credit delta for the current student
 * (learners spend, teachers earn) or null when nothing should change.
 */
export function settle(s: Session): { session: Session; delta: number } | null {
  if (s.status !== "verified" || s.settled) return null;
  const delta = s.payment === "money" ? 0 : s.role === "learn" ? -s.cost : s.cost;
  return { session: { ...s, settled: true }, delta };
}

/** Prevent duplicate bookings: same peer, skill, date and time that is still active. */
export function isDuplicate(list: Session[], s: Pick<Session, "peer" | "skill" | "date" | "time">) {
  return list.some(
    (x) => x.peer === s.peer && x.skill === s.skill && x.date === s.date && x.time === s.time && !["declined", "cancelled"].includes(x.status),
  );
}
