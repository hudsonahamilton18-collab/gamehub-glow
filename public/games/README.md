# Games Folder

Each subfolder here is a self-contained HTML5 game. To add a new game:

1. Create a new subfolder: `public/games/my-game/`
2. Drop the game files inside. The entry point must be `index.html`.
3. Register the game in `src/lib/games.ts`:

```ts
{
  slug: "my-game",
  title: "My Game",
  category: "Arcade",
  shortDescription: "One-liner shown on cards.",
  description: "Long-form description.",
  thumbnail: myGameThumb, // imported from src/assets
  embedUrl: local("my-game/index.html"),
  addedAt: "2026-07-11",
  trending: false,
  featured: false,
}
```

`local()` resolves the site's base path and the games folder name for you.

That's it — the site picks it up automatically in the library, categories, and search.
