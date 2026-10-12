import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/calendar")({
  head: () => ({ meta: [{ title: "Calendar — SwapSkill" }, { name: "description", content: "Calendar on SwapSkill." }, { property: "og:title", content: "Calendar — SwapSkill" }, { property: "og:description", content: "Calendar on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Calendar" /><div className="space-y-3">{state.sessions.length ? state.sessions.map((s) => <SessionCard key={s.id} s={s} />) : <Empty title="No sessions yet" />}</div></div>);
}
