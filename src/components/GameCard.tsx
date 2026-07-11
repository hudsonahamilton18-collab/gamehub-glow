import { Link } from "@tanstack/react-router";
import { Heart, Play } from "lucide-react";
import type { Game } from "@/lib/games";
import { useLocalStorageList } from "@/hooks/useLocalStorageList";

export function GameCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  const favorites = useLocalStorageList("gamehub:favorites");
  const isFav = favorites.hydrated && favorites.has(game.slug);

  return (
    <Link
      to="/games/$slug"
      params={{ slug: game.slug }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.title}
          loading={priority ? "eager" : "lazy"}
          width={1280}
          height={720}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
          {game.category}
        </span>
        <button
          type="button"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.preventDefault();
            favorites.toggle(game.slug);
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/70 backdrop-blur-md transition hover:bg-background"
        >
          <Heart
            className={`h-4 w-4 transition ${isFav ? "fill-primary text-primary" : "text-foreground"}`}
          />
        </button>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
          <h3 className="truncate text-base font-bold sm:text-lg">{game.title}</h3>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-glow transition group-hover:opacity-100">
            <Play className="h-4 w-4 fill-current" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">{game.shortDescription}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <Play className="h-3.5 w-3.5 fill-current" /> Play now
        </span>
      </div>
    </Link>
  );
}
