import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Coins, MessagesSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand";
import { useApp } from "@/lib/store";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SwapSkill — Peer-to-peer skill exchange for students" },
      { name: "description", content: "Teach what you know, learn what you don't. Fair, credit-based skill swaps between students." },
      { property: "og:title", content: "SwapSkill — Peer-to-peer skill exchange for students" },
      { property: "og:description", content: "Teach what you know, learn what you don't. Fair, credit-based skill swaps between students." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { state, ready } = useApp();
  const nav = useNavigate();
  useEffect(() => {
    if (ready && state.user) nav({ to: state.prefs.setupDone ? "/dashboard" : "/setup" });
  }, [ready, state.user, state.prefs.setupDone, nav]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-soft">
      {[12, 28, 64, 82, 46].map((l, i) => (
        <span key={l} aria-hidden className="absolute size-2 rounded-full bg-primary/40 animate-float-dot" style={{ left: `${l}%`, top: `${15 + i * 14}%`, animationDelay: `${i * 0.5}s` }} />
      ))}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Button asChild variant="ghost"><Link to="/auth" search={{ mode: "login" }}>Log in</Link></Button>
      </header>
      <main className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-6 md:grid-cols-2 md:pt-14">
        <div className="animate-rise">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-sm font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-success" /> MISSION'26 · Smart Education
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.02] md:text-7xl">
            Learn one.<br />Teach one.<br /><span className="text-brand">Grow together.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Swap skills with fellow students using fair credits — teach Python, learn Figma, and never let money be the barrier.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><Link to="/auth" search={{ mode: "signup" }}>Get started <ArrowRight /></Link></Button>
            <Button asChild variant="outline" size="lg"><Link to="/auth" search={{ mode: "login" }}>I have an account</Link></Button>
          </div>
          <ul className="mt-10 grid max-w-md grid-cols-3 gap-3 text-sm">
            {[{ i: Users, t: "Find peers" }, { i: MessagesSquare, t: "Chat & plan" }, { i: Coins, t: "Earn credits" }].map(({ i: I, t }) => (
              <li key={t} className="flex items-center gap-2 font-medium"><I className="size-4 text-primary" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="relative animate-rise [animation-delay:150ms]">
          <img src={hero} alt="Two students exchanging coding and design skills with a friendly assistant" width={1280} height={960} className="w-full rounded-3xl border shadow-glow" />
          <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-card">
            <span className="animate-swap-left font-display font-bold text-primary">Python</span>
            <span className="text-muted-foreground">⇄</span>
            <span className="animate-swap-right font-display font-bold text-primary-glow">Figma</span>
          </div>
        </div>
      </main>
    </div>
  );
}
