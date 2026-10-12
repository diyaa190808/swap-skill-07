import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/messages")({
  head: () => ({ meta: [{ title: "Messages — SwapSkill" }, { name: "description", content: "Messages on SwapSkill." }, { property: "og:title", content: "Messages — SwapSkill" }, { property: "og:description", content: "Messages on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Messages" /><Empty title="Messages" hint="Conversations with peers will appear here." /></div>);
}
