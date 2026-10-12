import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CREDIT_POLICY, markDone, settle, type Session, type Tx } from "./credits";
import { findStudent } from "./data";

export type Msg = { id: string; from: "me" | "peer"; text: string; at: string; demo?: boolean };
export type Post = { id: string; author: string; text: string; likes: number; at: string; liked?: boolean };
export type Goal = { id: string; title: string; target: number; done: number };

export type User = {
  name: string;
  email: string;
  username: string;
  bio: string;
  teach: string[];
  learn: string[];
  languages: string[];
  friendCode: string;
  credits: number;
  goals: Goal[];
};

export type State = {
  accounts: { email: string; hash: string }[];
  user: User | null;
  prefs: { lang: string; theme: "light" | "dark"; setupDone: boolean; guideDone: boolean; reducedMotion: boolean; largeText: boolean };
  sessions: Session[];
  tx: Tx[];
  chats: Record<string, Msg[]>;
  friends: string[];
  incoming: string[];
  outgoing: string[];
  posts: Post[];
  groups: string[];
  suggestions: { skill: string; domain: string; status: "pending review" }[];
};

const KEY = "swapskill-demo-v1";
export const uid = () => Math.random().toString(36).slice(2, 10);
export const now = () => new Date().toISOString();

const initial: State = {
  accounts: [],
  user: null,
  prefs: { lang: "en", theme: "light", setupDone: false, guideDone: false, reducedMotion: false, largeText: false },
  sessions: [],
  tx: [],
  chats: {},
  friends: [],
  incoming: ["ananya_speaks"],
  outgoing: [],
  posts: [],
  groups: [],
  suggestions: [],
};

export async function hashPassword(p: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("swapskill:" + p));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function makeUser(name: string, email: string): User {
  return {
    name, email, username: "", bio: "", teach: [], learn: [], languages: ["English"],
    friendCode: "SWAP-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
    credits: CREDIT_POLICY.welcomeCredits,
    goals: [{ id: uid(), title: "Complete my first learning session", target: 1, done: 0 }],
  };
}

type Ctx = {
  state: State;
  ready: boolean;
  set: (fn: (s: State) => State) => void;
  advanceSession: (id: string, who: "me" | "peer") => void;
};
const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch { /* corrupt storage: start fresh */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
    const root = document.documentElement;
    root.classList.toggle("dark", state.prefs.theme === "dark");
    root.style.fontSize = state.prefs.largeText ? "112.5%" : "";
    root.lang = state.prefs.lang;
  }, [state, ready]);

  const set = useCallback((fn: (s: State) => State) => setState(fn), []);

  const advanceSession = useCallback((id: string, who: "me" | "peer") => {
    setState((s) => {
      const cur = s.sessions.find((x) => x.id === id);
      if (!cur || !s.user) return s;
      let next = markDone(cur, who);
      let user = s.user;
      let tx = s.tx;
      const res = settle(next);
      if (res) {
        next = res.session;
        const peer = findStudent(next.peer)?.name ?? next.peer;
        if (res.delta !== 0) {
          user = { ...user, credits: user.credits + res.delta, goals: user.goals.map((g, i) => (i === 0 && next.role === "learn" ? { ...g, done: Math.min(g.target, g.done + 1) } : g)) };
          tx = [{ id: uid(), at: now(), amount: res.delta, label: `${res.delta > 0 ? "Taught" : "Learned"} ${next.skill} with ${peer} (simulated)`, sessionId: next.id, kind: res.delta > 0 ? "earn" : "spend" }, ...tx];
        } else {
          tx = [{ id: uid(), at: now(), amount: 0, label: `${next.skill} with ${peer} — paid ₹${next.price} directly (no credits moved)`, sessionId: next.id, kind: "info" }, ...tx];
        }
      }
      return { ...s, user, tx, sessions: s.sessions.map((x) => (x.id === id ? next : x)) };
    });
  }, []);

  return <AppCtx.Provider value={{ state, ready, set, advanceSession }}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
}
