import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Sparkles, TrendingUp, Clock, Gamepad } from "lucide-react";
import heroImg from "@/assets/hero-featured.jpg";
import { GAMES, CATEGORIES } from "@/lib/games";
import { GameRow } from "@/components/GameRow";
import { useLocalStorageList } from "@/hooks/useLocalStorageList";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const recent = useLocalStorageList("gamehub:recent");
  const featured = GAMES.find((g) => g.featured) ?? GAMES[0];
  const trending = GAMES.filter((g) => g.trending);
  const recentlyAdded = [...GAMES].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  const recentlyPlayed = recent.hydrated
    ? (recent.items.map((s) => GAMES.find((g) => g.slug === s)).filter(Boolean) as typeof GAMES)
    : [];

  return (
    <div className="animate-fade-in">
      {/* Featured hero */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <img
              src={heroImg}
              alt=""
              width={1920}
              height={900}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="relative flex flex-col justify-end gap-4 p-6 pt-40 sm:p-10 sm:pt-56 lg:pt-72">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Featured
              </span>
              <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {featured.title}
              </h1>
              <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
                {featured.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/games/$slug"
                  params={{ slug: featured.slug }}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:brightness-110"
                >
                  <Play className="h-4 w-4 fill-current" /> Play now
                </Link>
                <Link
                  to="/library"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-secondary"
                >
                  Browse library
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 sm:py-16">
        {recentlyPlayed.length > 0 && (
          <GameRow
            title="Continue Playing"
            subtitle="Pick up where you left off"
            games={recentlyPlayed}
          />
        )}

        <GameRow
          title="Trending Now"
          subtitle="What everyone's playing this week"
          games={trending}
        />

        <GameRow
          title="Recently Added"
          subtitle="Fresh drops from the arcade"
          games={recentlyAdded}
        />

        {/* Categories */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">Browse Categories</h2>
            <p className="text-sm text-muted-foreground">Pick a genre and dive in</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const count = GAMES.filter((g) => g.category === cat).length;
              const icons: Record<string, typeof TrendingUp> = { Racing: TrendingUp, Action: Gamepad, Arcade: Sparkles, Puzzle: Clock, Sports: TrendingUp };
              const Icon = icons[cat] ?? Gamepad;
              return (
                <Link
                  key={cat}
                  to="/library"
                  search={{ category: cat }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary shadow-glow">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </span>
                  <div className="mt-6">
                    <p className="text-base font-bold">{cat}</p>
                    <p className="text-xs text-muted-foreground">
                      {count} {count === 1 ? "game" : "games"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
