import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo, Card } from "@/components/brand";
import { hashPassword, makeUser, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ mode: s["mode"] === "login" ? ("login" as const) : ("signup" as const) }),
  head: () => ({
    meta: [
      { title: "Sign in or join — SwapSkill" },
      { name: "description", content: "Create your SwapSkill account or log back in." },
      { property: "og:title", content: "Sign in or join — SwapSkill" },
      { property: "og:description", content: "Create your SwapSkill account or log back in." },
    ],
  }),
  component: AuthPage,
});

export function passwordStrength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

function AuthPage() {
  const { mode } = Route.useSearch();
  const { state, set } = useApp();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const strength = passwordStrength(pw);
  const labels = ["Too weak", "Weak", "Okay", "Good", "Strong"];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const em = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(em)) return setErr("Enter a valid email address.");
    const hash = await hashPassword(pw);
    if (mode === "signup") {
      if (name.trim().length < 2) return setErr("Tell us your name.");
      if (strength < 3) return setErr("Choose a stronger password: 8+ characters with a mix of letters, numbers and symbols.");
      if (state.accounts.some((a) => a.email === em)) return setErr("An account with this email already exists. Try logging in.");
      set((s) => ({ ...s, accounts: [...s.accounts, { email: em, hash }], user: makeUser(name.trim(), em), prefs: { ...s.prefs, setupDone: false, guideDone: false } }));
      nav({ to: "/setup" });
    } else {
      const acc = state.accounts.find((a) => a.email === em);
      if (!acc || acc.hash !== hash) return setErr("Email or password is incorrect.");
      if (!state.user || state.user.email !== em) return setErr("This demo keeps one profile per browser. Sign up again to start fresh.");
      toast.success(`Welcome back, ${state.user.name.split(" ")[0]}!`);
      nav({ to: state.prefs.setupDone ? "/dashboard" : "/setup" });
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-soft px-4 py-10">
      <div className="w-full max-w-md animate-rise">
        <Link to="/" className="mb-6 flex justify-center"><Logo /></Link>
        <Card className="p-7">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-semibold">
            {(["signup", "login"] as const).map((m) => (
              <Link key={m} to="/auth" search={{ mode: m }} className={cn("rounded-lg py-2 text-center transition", mode === m ? "bg-card shadow-card" : "text-muted-foreground")}>
                {m === "signup" ? "Create account" : "Log in"}
              </Link>
            ))}
          </div>
          <Button variant="outline" className="w-full" onClick={() => toast.info("Google sign-in will be switched on once the secure account backend is connected. Use email for now.")}>
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden><path fill="currentColor" d="M21.35 11.1H12v2.95h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.25 12 6.25c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.55 2.75 12 2.75 6.89 2.75 2.75 6.89 2.75 12S6.89 21.25 12 21.25c5.33 0 8.86-3.75 8.86-9.02 0-.6-.07-1.06-.15-1.13z" /></svg>
            Continue with Google
          </Button>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or with email<span className="h-px flex-1 bg-border" /></div>
          <form onSubmit={submit} className="space-y-4" noValidate>
            {mode === "signup" && (
              <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>
            )}
            <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
            <div className="space-y-1.5">
              <Label htmlFor="pw">Password</Label>
              <div className="relative">
                <Input id="pw" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="pr-10" />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-2 grid place-items-center text-muted-foreground">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </div>
              {mode === "signup" && pw && (
                <div aria-live="polite">
                  <div className="mt-2 grid grid-cols-4 gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className={cn("h-1.5 rounded-full", i < strength ? (strength >= 3 ? "bg-success" : "bg-warning") : "bg-muted")} />)}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{labels[strength]} · use 8+ characters, mixed case, a number and a symbol.</p>
                </div>
              )}
            </div>
            {err && <p role="alert" className="text-sm font-medium text-destructive">{err}</p>}
            <Button type="submit" variant="hero" className="w-full" size="lg">{mode === "signup" ? "Create account" : "Log in"}</Button>
          </form>
          <p className="mt-5 flex gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground"><Info className="size-4 shrink-0" />Demo mode: your account is saved only in this browser, with the password stored as a hash — never as plain text.</p>
        </Card>
      </div>
    </div>
  );
}
