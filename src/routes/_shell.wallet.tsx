import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle, Card, Avatar, Chip, Empty } from "@/components/brand";
import { SessionCard } from "@/components/session-ui";
import { STUDENTS, DOMAINS, GROUPS, DEMO_POSTS, matchScore } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_shell/wallet")({
  head: () => ({ meta: [{ title: "Credit Wallet — SwapSkill" }, { name: "description", content: "Credit Wallet on SwapSkill." }, { property: "og:title", content: "Credit Wallet — SwapSkill" }, { property: "og:description", content: "Credit Wallet on SwapSkill." }] }),
  component: Page,
});

function Page() {
  const { state } = useApp();
  const u = state.user!;
  void STUDENTS; void DOMAINS; void GROUPS; void DEMO_POSTS; void matchScore; void Card; void Avatar; void Chip; void Empty; void SessionCard; void Link; void u;
  return (<div><PageTitle title="Credit Wallet" /><Card><p className="text-4xl font-bold">{u.credits} credits</p></Card><div className="mt-4 space-y-2">{state.tx.map((t) => <Card key={t.id}>{t.amount} · {t.label}</Card>)}</div></div>);
}
