import type { Game } from "@/lib/games";
import { GameCard } from "./GameCard";

export function GameRow({
  title,
  subtitle,
  games,
}: {
  title: string;
  subtitle?: string;
  games: Game[];
}) {
  if (games.length === 0) return null;
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {games.map((g) => (
          <GameCard key={g.slug} game={g} />
        ))}
      </div>
    </section>
  );
}
