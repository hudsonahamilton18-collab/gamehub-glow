import escapeRoadThumb from "@/assets/thumb-escape-road.jpg";
import racerThumb from "@/assets/thumb-racer.jpg";

export type Game = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  addedAt: string; // ISO date
  featured?: boolean;
  trending?: boolean;
};

export const CATEGORIES = ["Racing", "Action", "Arcade", "Puzzle"] as const;
export type Category = (typeof CATEGORIES)[number];

export const GAMES: Game[] = [
  {
    slug: "escape-road",
    title: "Escape Road",
    category: "Action",
    shortDescription: "Outrun the cops through a chaotic open city.",
    description:
      "Slam the pedal down and burn rubber through a wide-open metropolis. Dodge cop cars, smash through traffic and see how long you can stay ahead of the chase in this arcade-style getaway thriller.",
    thumbnail: escapeRoadThumb,
    embedUrl: "/games/escape-road/index.html",
    addedAt: "2026-07-11",
    featured: true,
    trending: true,
  },
  {
    slug: "javascript-racer",
    title: "Neon Racer",
    category: "Racing",
    shortDescription: "Classic pseudo-3D racing at sunset speeds.",
    description:
      "A love letter to the outrun-era arcade racers. Carve through winding roads, hills and tunnels while chasing the horizon. Simple controls, endless nostalgia.",
    thumbnail: racerThumb,
    embedUrl: "/games/javascript-racer/index.html",
    addedAt: "2026-07-10",
    trending: true,
  },
];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function searchGames(query: string, category?: string): Game[] {
  const q = query.trim().toLowerCase();
  return GAMES.filter((g) => {
    if (category && category !== "All" && g.category !== category) return false;
    if (!q) return true;
    return (
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.shortDescription.toLowerCase().includes(q)
    );
  });
}
