import escapeRoadThumb from "@/assets/thumb-escape-road.jpg";
import snowRiderThumb from "@/assets/thumb-snow-rider.png";
import slopeThumb from "@/assets/thumb-slope.png";
import driftBossThumb from "@/assets/thumb-drift-boss.png";
import twentyFortyEightThumb from "@/assets/thumb-2048.png";
import subwaySurfersThumb from "@/assets/thumb-subway-surfers.jpg";

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

export const CATEGORIES = ["Racing", "Action", "Arcade", "Puzzle", "Sports"] as const;
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
    slug: "slope",
    title: "Slope",
    category: "Arcade",
    shortDescription: "Roll down an endless neon slope at breakneck speed.",
    description:
      "Guide a rolling ball down a steep, neon-lit slope full of ramps, gaps and red obstacles. Reflexes are everything — one wrong move and it's over. How far can you go before gravity wins?",
    thumbnail: slopeThumb,
    embedUrl: "/games/slope/index.html",
    addedAt: "2026-07-12",
    trending: true,
    featured: true,
  },
  {
    slug: "snow-rider",
    title: "Snow Rider 3D",
    category: "Sports",
    shortDescription: "Carve down a snowy mountain on a runaway sled.",
    description:
      "Grab your sled and rocket down a frosty 3D mountain. Weave past trees, snowmen and giant gifts, collect coins and unlock new sleds. Simple to pick up, tough to master.",
    thumbnail: snowRiderThumb,
    embedUrl: "/games/snow-rider/index.html",
    addedAt: "2026-07-12",
    trending: true,
  },
  {
    slug: "drift-boss",
    title: "Drift Boss",
    category: "Racing",
    shortDescription: "One-tap drifting on a winding sky road.",
    description:
      "Tap to steer. That's it. Keep the car on the twisting road high above the clouds, nail perfect drifts around each corner and push your score higher every run.",
    thumbnail: driftBossThumb,
    embedUrl: "/games/drift-boss/index.html",
    addedAt: "2026-07-12",
  },
  {
    slug: "2048",
    title: "2048",
    category: "Puzzle",
    shortDescription: "Slide tiles, merge numbers, reach 2048.",
    description:
      "The addictive number puzzle. Swipe or arrow-key to slide all tiles in one direction — matching numbers combine. Keep the board alive long enough to hit the legendary 2048 tile.",
    thumbnail: twentyFortyEightThumb,
    embedUrl: "/games/2048/index.html",
    addedAt: "2026-07-12",
  },
  {
    slug: "subway-surfers",
    title: "Subway Surfers",
    category: "Action",
    shortDescription: "Dash across the tracks and outrun the inspector.",
    description:
      "Sprint down endless subway tracks, dodge oncoming trains, grab coins and power-ups, and see how far you can go before the grumpy inspector catches up. A timeless endless runner.",
    thumbnail: subwaySurfersThumb,
    embedUrl: "https://www.madkidgames.com/full/subway-surfers",
    addedAt: "2026-07-12",
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
