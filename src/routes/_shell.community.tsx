import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/community")({
  head: () => ({ meta: [{ title: "Community — SwapSkill" }, { name: "description", content: "Community on SwapSkill." }, { property: "og:title", content: "Community — SwapSkill" }, { property: "og:description", content: "Community on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Community" /><p className="mb-4">Your friend code: <b>{u.friendCode}</b></p><div className="space-y-3">{DEMO_POSTS.map((p) => <Card key={p.id}><p className="text-sm font-semibold">@{p.author}</p><p>{p.text}</p></Card>)}</div></div>);
}
