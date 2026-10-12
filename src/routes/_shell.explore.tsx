import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/explore")({
  head: () => ({ meta: [{ title: "Explore — SwapSkill" }, { name: "description", content: "Explore on SwapSkill." }, { property: "og:title", content: "Explore — SwapSkill" }, { property: "og:description", content: "Explore on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Explore" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{DOMAINS.map((d) => <Card key={d.id}><d.icon className="mb-2 size-6 text-primary" /><p className="font-semibold">{d.name}</p><p className="text-sm text-muted-foreground">{d.description}</p><div className="mt-2 flex flex-wrap gap-1">{d.skills.map((k) => <Chip key={k} tone="plain">{k}</Chip>)}</div></Card>)}</div></div>);
}
