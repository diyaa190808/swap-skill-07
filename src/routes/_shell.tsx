import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BarChart3, CalendarDays, Coins, Compass, LayoutDashboard, LogOut, MessagesSquare, Settings, User, Users, UsersRound } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo, Empty } from "@/components/brand";
import { Nova } from "@/components/nova";
import { SessionCard } from "@/components/session-ui";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_shell")({ component: Shell });

const NAV = [
  { to: "/dashboard", k: "dashboard", i: LayoutDashboard },
  { to: "/explore", k: "explore", i: Compass },
  { to: "/messages", k: "messages", i: MessagesSquare },
  { to: "/community", k: "community", i: Users },
  { to: "/groups", k: "groups", i: UsersRound },
  { to: "/calendar", k: "calendar", i: CalendarDays },
  { to: "/wallet", k: "wallet", i: Coins },
  { to: "/progress", k: "progress", i: BarChart3 },
  { to: "/profile", k: "profile", i: User },
  { to: "/settings", k: "settings", i: Settings },
] as const;
const MOBILE = ["/dashboard", "/explore", "/messages", "/community", "/profile"];

function Shell() {
  const { state, ready, set } = useApp();
  const nav = useNavigate();
  const t = useT();
  useEffect(() => {
    if (!ready) return;
    if (!state.user) nav({ to: "/auth", search: { mode: "login" } });
    else if (!state.prefs.setupDone) nav({ to: "/setup" });
  }, [ready, state.user, state.prefs.setupDone, nav]);

  if (!ready || !state.user || !state.prefs.setupDone)
    return <div className="grid min-h-screen place-items-center" role="status"><span className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /><span className="sr-only">Loading</span></div>;

  const upcoming = state.sessions.filter((s) => ["proposed", "confirmed", "awaiting_confirmation"].includes(s.status)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const signOut = () => { set((s) => ({ ...s })); nav({ to: "/auth", search: { mode: "login" } }); };

  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r bg-sidebar p-4 md:flex">
        <Link to="/dashboard" className="mb-6 px-2"><Logo /></Link>
        <nav className="flex-1 space-y-1" aria-label="Main">
          {NAV.map(({ to, k, i: I }) => (
            <Link key={to} to={to} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" }}>
              <I className="size-4" />{t(k)}
            </Link>
          ))}
        </nav>
        <button onClick={signOut} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent"><LogOut className="size-4" />Sign out</button>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <Link to="/dashboard" className="md:hidden"><Logo compact /></Link>
          <span className="hidden text-sm text-muted-foreground md:block">@{state.user.username}</span>
          <div className="flex items-center gap-2">
            <Button asChild variant="soft" size="sm"><Link to="/wallet"><Coins />{state.user.credits} credits</Link></Button>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="sm" aria-label="Open calendar"><CalendarDays />{upcoming.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{upcoming.length}</span>}</Button></SheetTrigger>
              <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader><SheetTitle>Upcoming sessions</SheetTitle></SheetHeader>
                <div className="mt-4 space-y-3 px-4 pb-6">
                  {upcoming.length ? upcoming.map((s) => <SessionCard key={s.id} s={s} compact />) : <Empty title="Nothing scheduled" hint="Propose a session from any profile." />}
                  <Button asChild variant="outline" className="w-full"><Link to="/calendar">Open full calendar</Link></Button>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/settings" className="md:hidden" aria-label="Settings"><Settings className="size-5 text-muted-foreground" /></Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pb-12">
          <Outlet />
        </main>
      </div>
      <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card md:hidden">
        {NAV.filter((n) => MOBILE.includes(n.to)).map(({ to, k, i: I }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] text-muted-foreground" activeProps={{ className: "text-primary font-semibold" }}>
            <I className="size-5" />{t(k)}
          </Link>
        ))}
      </nav>
      <Nova />
    </div>
  );
}
