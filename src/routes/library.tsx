import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Heart, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { GAMES, CATEGORIES, searchGames } from "@/lib/games";
import { GameCard } from "@/components/GameCard";
import { useLocalStorageList } from "@/hooks/useLocalStorageList";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  favorites: z.boolean().optional(),
});

export const Route = createFileRoute("/library")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Game Library — GameHub" },
      {
        name: "description",
        content: "Browse the full GameHub library. Filter by category, search, and pin favorites.",
      },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { q = "", category = "All", favorites: showFav = false } = Route.useSearch();
  const navigate = useNavigate({ from: "/library" });
  const favorites = useLocalStorageList("gamehub:favorites");
  const [localQ, setLocalQ] = useState(q);

  const filtered = useMemo(() => {
    let list = searchGames(localQ, category);
    if (showFav && favorites.hydrated) list = list.filter((g) => favorites.has(g.slug));
    return list;
  }, [localQ, category, showFav, favorites]);

  return (
    <div className="mx-auto max-w-7xl animate-fade-in px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Game Library</h1>
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "game" : "games"} available
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={localQ}
            onChange={(e) => {
              setLocalQ(e.target.value);
              navigate({
                search: (prev: Record<string, unknown>) => ({ ...prev, q: e.target.value || undefined }),
                replace: true,
              });
            }}
            placeholder="Search games..."
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <Chip
            active={category === "All" && !showFav}
            onClick={() =>
              navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, category: undefined, favorites: undefined }) })
            }
          >
            All
          </Chip>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              active={category === cat && !showFav}
              onClick={() =>
                navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, category: cat, favorites: undefined }) })
              }
            >
              {cat}
            </Chip>
          ))}
          <Chip
            active={showFav}
            onClick={() =>
              navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, favorites: showFav ? undefined : true }) })
            }
          >
            <Heart className={`h-3.5 w-3.5 ${showFav ? "fill-current" : ""}`} /> Favorites
          </Chip>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-lg font-semibold">No games found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or clear the filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((g) => (
            <GameCard key={g.slug} game={g} />
          ))}
        </div>
      )}

      {/* SEO discoverability of total collection */}
      <p className="sr-only">
        Total {GAMES.length} games across categories {CATEGORIES.join(", ")}.
      </p>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
