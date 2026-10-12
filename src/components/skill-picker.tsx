import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ALL_SKILLS } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SkillPicker({ value, onChange, tone, label }: { value: string[]; onChange: (v: string[]) => void; tone: "teach" | "learn"; label: string }) {
  const [q, setQ] = useState("");
  const opts = ALL_SKILLS.filter((s) => !value.includes(s) && s.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  const chip = tone === "teach" ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground";
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="mb-2 flex min-h-9 flex-wrap gap-2">
        {value.length === 0 && <span className="text-sm text-muted-foreground">Nothing yet — pick below.</span>}
        {value.map((s) => (
          <button key={s} onClick={() => onChange(value.filter((x) => x !== s))} className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium", chip)} aria-label={`Remove ${s}`}>
            {s}<X className="size-3" />
          </button>
        ))}
      </div>
      <Input placeholder="Search skills…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {opts.map((s) => (
          <button key={s} onClick={() => { onChange([...value, s]); setQ(""); }} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs hover:bg-muted">
            <Plus className="size-3" />{s}
          </button>
        ))}
      </div>
    </div>
  );
}
