import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/groups")({
  head: () => ({ meta: [{ title: "Skill Circles — SwapSkill" }, { name: "description", content: "Skill Circles on SwapSkill." }, { property: "og:title", content: "Skill Circles — SwapSkill" }, { property: "og:description", content: "Skill Circles on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Skill Circles" /><div className="grid gap-3 md:grid-cols-2">{GROUPS.map((g) => <Card key={g.id}><p className="font-semibold">{g.name}</p><p className="text-sm text-muted-foreground">{g.about}</p></Card>)}</div></div>);
}
