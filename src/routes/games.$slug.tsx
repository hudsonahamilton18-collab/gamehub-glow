import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Expand, Heart, Loader2, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getGame, GAMES } from "@/lib/games";
import { GameCard } from "@/components/GameCard";
import { useLocalStorageList } from "@/hooks/useLocalStorageList";

export const Route = createFileRoute("/games/$slug")({
  loader: ({ params }) => {
    const game = getGame(params.slug);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Game not found — GameHub" }, { name: "robots", content: "noindex" }] };
    const { game } = loaderData;
    return {
      meta: [
        { title: `${game.title} — GameHub` },
        { name: "description", content: game.shortDescription },
        { property: "og:title", content: `${game.title} — GameHub` },
        { property: "og:description", content: game.shortDescription },
        { property: "og:image", content: game.thumbnail },
        { name: "twitter:image", content: game.thumbnail },
      ],
    };
  },
  notFoundComponent: GameNotFound,
  component: GamePage,
});

function GameNotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-black">Game not found</h1>
        <p className="mt-2 text-muted-foreground">This title isn't in our library.</p>
        <Link
          to="/library"
          className="mt-6 inline-flex rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Browse library
        </Link>
      </div>
    </div>
  );
}

function GamePage() {
  const { game } = Route.useLoaderData();
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const favorites = useLocalStorageList("gamehub:favorites");
  const recent = useLocalStorageList("gamehub:recent");

  const related = GAMES.filter((g) => g.slug !== game.slug).slice(0, 4);
  const isFav = favorites.hydrated && favorites.has(game.slug);

  useEffect(() => {
    setStarted(false);
    setLoading(true);
  }, [game.slug]);

  const start = () => {
    setStarted(true);
    recent.push(game.slug);
  };

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Slim game-page header */}
      <div className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => (router.history.length > 1 ? router.history.back() : router.navigate({ to: "/" }))}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="ml-1 min-w-0 flex-1 truncate text-base font-bold sm:text-lg">
            {game.title}
          </h1>
          <button
            type="button"
            onClick={() => favorites.toggle(game.slug)}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card transition hover:bg-secondary"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-primary text-primary" : ""}`} />
          </button>
          {started && (
            <button
              type="button"
              onClick={enterFullscreen}
              className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition hover:bg-secondary sm:inline-flex"
            >
              <Expand className="h-4 w-4" /> Fullscreen
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
        {/* Player */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl border border-border bg-black shadow-glow"
        >
          <div className="relative aspect-video w-full">
            {!started ? (
              <button
                type="button"
                onClick={start}
                className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black"
              >
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-40 transition group-hover:opacity-60"
                />
                <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-primary shadow-glow animate-pulse-glow">
                  <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
                </div>
                <span className="relative text-sm font-semibold uppercase tracking-widest">
                  Click to play
                </span>
              </button>
            ) : (
              <>
                {loading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Loading {game.title}
                    </span>
                  </div>
                )}
                <iframe
                  src={game.embedUrl}
                  title={game.title}
                  onLoad={() => setLoading(false)}
                  allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {game.category}
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">About {game.title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{game.description}</p>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              How to play
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>• Click the player to start</li>
              <li>• Use fullscreen for the best experience</li>
              <li>• Save it to favorites to find it faster</li>
              <li>• Controls appear inside the game</li>
            </ul>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">You might also like</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((g) => (
                <GameCard key={g.slug} game={g} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
