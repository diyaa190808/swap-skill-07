import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/progress")({
  head: () => ({ meta: [{ title: "Progress — SwapSkill" }, { name: "description", content: "Progress on SwapSkill." }, { property: "og:title", content: "Progress — SwapSkill" }, { property: "og:description", content: "Progress on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Progress" /><div className="space-y-2">{u.goals.map((g) => <Card key={g.id}>{g.title}: {g.done}/{g.target}</Card>)}</div></div>);
}
