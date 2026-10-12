import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings — SwapSkill" }, { name: "description", content: "Settings on SwapSkill." }, { property: "og:title", content: "Settings — SwapSkill" }, { property: "og:description", content: "Settings on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Settings" /><Empty title="Settings" hint="Language and theme preferences are saved from setup." /></div>);
}
