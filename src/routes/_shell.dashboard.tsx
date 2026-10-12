import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SwapSkill" }, { name: "description", content: "Dashboard on SwapSkill." }, { property: "og:title", content: "Dashboard — SwapSkill" }, { property: "og:description", content: "Dashboard on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Dashboard" /><p className="mb-4 text-lg">Hello {u.name.split(" ")[0]} 👋</p><div className="grid gap-3 md:grid-cols-2">{STUDENTS.map((s) => ({ s, m: matchScore(u, s) })).filter((x) => x.m.score > 0).map(({ s, m }) => <Card key={s.username}><div className="flex gap-3"><Avatar name={s.name} /><div><p className="font-semibold">{s.name}</p><p className="text-sm text-muted-foreground">{m.reasons[0]}</p></div></div></Card>)}</div><div className="mt-6 space-y-3">{state.sessions.map((s) => <SessionCard key={s.id} s={s} />)}</div></div>);
}
