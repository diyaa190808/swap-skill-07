import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-glow">
        <ArrowLeftRight className="size-5" />
      </span>
      {!compact && <span className="font-display text-xl font-bold">Swap<span className="text-brand">Skill</span></span>}
    </span>
  );
}

const tones = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];
export function Avatar({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const i = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % tones.length;
  const initials = name.split(/[\s._]/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  const sz = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-20 text-2xl" : "size-11 text-sm";
  return <span aria-hidden className={cn("grid shrink-0 place-items-center rounded-full font-bold text-primary-foreground", tones[i], sz, className)}>{initials}</span>;
}

export function DemoBadge({ className, label = "Demo data" }: { className?: string; label?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border border-warning/50 bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-warning-foreground dark:text-warning", className)}>{label}</span>;
}

export function Chip({ children, tone = "learn" }: { children: React.ReactNode; tone?: "teach" | "learn" | "plain" }) {
  const t = tone === "teach" ? "bg-primary/10 text-primary" : tone === "learn" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground";
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", t)}>{children}</span>;
}

export function Card({ className, children, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border bg-card p-5 text-card-foreground shadow-card", className)} {...p}>{children}</div>;
}

export function Empty({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed p-6 text-center">
      <p className="font-semibold">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function PageTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        {sub && <p className="mt-1 text-muted-foreground">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
