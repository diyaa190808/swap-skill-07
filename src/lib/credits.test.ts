import { describe, expect, it } from "vitest";
import { canAfford, isDuplicate, markDone, sessionCost, settle, type Session } from "./credits";

const base: Session = { id: "s1", peer: "aarav_codes", skill: "Python", role: "learn", date: "2026-10-20", time: "18:00", duration: 60, cost: 10, payment: "credits", status: "confirmed", meDone: false, peerDone: false, settled: false };

describe("credit policy", () => {
  it("charges 10 credits per hour", () => expect(sessionCost(60)).toBe(10));
  it("rounds 90 minutes up to 15 credits", () => expect(sessionCost(90)).toBe(15));
  it("blocks credit payment when balance is too low", () => expect(canAfford(5, 10)).toBe(false));
  it("needs both participants before verifying", () => {
    const once = markDone(base, "me");
    expect(once.status).toBe("awaiting_confirmation");
    expect(markDone(once, "peer").status).toBe("verified");
  });
  it("does not settle an unverified session", () => expect(settle(markDone(base, "me"))).toBeNull());
  it("learner spends credits once, never twice", () => {
    const v = markDone(markDone(base, "me"), "peer");
    const r = settle(v)!;
    expect(r.delta).toBe(-10);
    expect(settle(r.session)).toBeNull();
  });
  it("teacher earns credits", () => {
    const v = markDone(markDone({ ...base, role: "teach" }, "me"), "peer");
    expect(settle(v)!.delta).toBe(10);
  });
  it("money payment moves no credits", () => {
    const v = markDone(markDone({ ...base, payment: "money" }, "me"), "peer");
    expect(settle(v)!.delta).toBe(0);
  });
  it("flags duplicate bookings", () => expect(isDuplicate([base], base)).toBe(true));
});
