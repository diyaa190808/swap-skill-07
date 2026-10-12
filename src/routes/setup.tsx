import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Moon, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Logo } from "@/components/brand";
import { Guide } from "@/components/guide";
import { SkillPicker } from "@/components/skill-picker";
import { LANGUAGES, STUDENTS } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Set up your profile — SwapSkill" },
      { name: "description", content: "Pick a username, your skills, language and look." },
      { property: "og:title", content: "Set up your profile — SwapSkill" },
      { property: "og:description", content: "Pick a username, your skills, language and look." },
    ],
  }),
  component: Setup,
});

export function usernameError(u: string, taken: string[]) {
  if (u.length < 3) return "At least 3 characters.";
  if (u.length > 20) return "20 characters max.";
  if (!/^[a-z0-9._]+$/.test(u)) return "Use lowercase letters, numbers, dots or underscores.";
  if (taken.includes(u)) return "That username is taken.";
  return "";
}

function Setup() {
  const { state, ready, set } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [teach, setTeach] = useState<string[]>([]);
  const [learn, setLearn] = useState<string[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => { if (ready && !state.user) nav({ to: "/auth", search: { mode: "signup" } }); }, [ready, state.user, nav]);
  if (!ready || !state.user) return null;

  const uErr = usernameError(username, STUDENTS.map((s) => s.username));
  const steps = ["Username", "Skills", "Language", "Theme", "Guide"];

  const finish = () => {
    set((s) => ({ ...s, user: s.user && { ...s.user, username, teach, learn }, prefs: { ...s.prefs, setupDone: true, guideDone: true } }));
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-soft px-4 py-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center justify-between"><Logo /><span className="text-sm text-muted-foreground">Step {step + 1} of {steps.length} · {steps[step]}</span></div>
        <Card className="p-7 animate-rise" key={step}>
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold">Hi {state.user.name.split(" ")[0]}! Pick your username</h1>
              <p className="mt-1 text-muted-foreground">It's how peers find you. You can't change it often, so choose well.</p>
              <div className="relative mt-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="pl-7" aria-describedby="u-help" autoFocus />
              </div>
              <p id="u-help" aria-live="polite" className={cn("mt-2 flex items-center gap-1 text-sm", username && (uErr ? "text-destructive" : "text-success"))}>
                {username ? (uErr ? <><X className="size-4" />{uErr}</> : <><Check className="size-4" />Available (checked against this demo's profiles)</>) : "3–20 characters: a–z, 0–9, . or _"}
              </p>
              <Button className="mt-6 w-full" variant="hero" disabled={!!uErr} onClick={() => setStep(1)}>Continue</Button>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-6">
              <div><h1 className="text-2xl font-bold">What can you swap?</h1><p className="mt-1 text-muted-foreground">Add at least one skill to each list.</p></div>
              <SkillPicker label="I can teach" tone="teach" value={teach} onChange={setTeach} />
              <SkillPicker label="I want to learn" tone="learn" value={learn} onChange={setLearn} />
              <div className="flex gap-2"><Button variant="outline" onClick={() => setStep(0)}>Back</Button><Button className="flex-1" variant="hero" disabled={!teach.length || !learn.length} onClick={() => setStep(2)}>Continue</Button></div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold">Which language would you like to use?</h1>
              <div className="relative mt-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search languages" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search languages" /></div>
              <div role="radiogroup" className="mt-3 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
                {LANGUAGES.filter((l) => (l.label + l.native).toLowerCase().includes(q.toLowerCase())).map((l) => (
                  <button key={l.code} role="radio" aria-checked={state.prefs.lang === l.code} onClick={() => set((s) => ({ ...s, prefs: { ...s.prefs, lang: l.code } }))}
                    className={cn("rounded-xl border p-3 text-left transition", state.prefs.lang === l.code ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "hover:bg-muted")}>
                    <span className="block font-semibold">{l.native}</span>
                    <span className="text-xs text-muted-foreground">{l.label} · {l.status === "full" ? "Full" : l.status === "partial" ? "Menus translated" : "Coming soon (English shown)"}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-2"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button className="flex-1" variant="hero" onClick={() => setStep(3)}>Continue</Button></div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold">How would you like SwapSkill to look?</h1>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {(["light", "dark"] as const).map((t) => (
                  <button key={t} onClick={() => set((s) => ({ ...s, prefs: { ...s.prefs, theme: t } }))} aria-pressed={state.prefs.theme === t}
                    className={cn("rounded-2xl border p-3 text-left transition", state.prefs.theme === t ? "border-primary ring-2 ring-primary/30" : "hover:bg-muted")}>
                    <div className={cn("mb-3 h-24 rounded-xl border p-2", t === "dark" ? "dark bg-background" : "bg-background")}>
                      <div className={cn(t === "dark" && "dark")}><div className="h-2 w-1/2 rounded bg-foreground/70" /><div className="mt-2 h-8 rounded-lg bg-brand" /><div className="mt-2 h-2 w-3/4 rounded bg-muted-foreground/40" /></div>
                    </div>
                    <span className="flex items-center gap-2 font-semibold">{t === "light" ? <Sun className="size-4" /> : <Moon className="size-4" />}{t === "light" ? "Light Mode ☀️" : "Dark Mode 🌙"}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-2"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button className="flex-1" variant="hero" onClick={() => setStep(4)}>Continue</Button></div>
            </div>
          )}
          {step === 4 && <Guide onFinish={finish} />}
        </Card>
      </div>
    </div>
  );
}
