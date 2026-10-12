import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/profile")({
  head: () => ({ meta: [{ title: "Profile — SwapSkill" }, { name: "description", content: "Profile on SwapSkill." }, { property: "og:title", content: "Profile — SwapSkill" }, { property: "og:description", content: "Profile on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Profile" /><Card><p className="font-semibold">{u.name} · @{u.username}</p><div className="mt-2 flex flex-wrap gap-1">{u.teach.map((k) => <Chip key={k} tone="teach">{k}</Chip>)}{u.learn.map((k) => <Chip key={k}>{k}</Chip>)}</div></Card></div>);
}
