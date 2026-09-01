// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * GitHub Pages build.
 *
 * Active only when GITHUB_PAGES=true (set by .github/workflows/deploy-pages.yml),
 * so the normal Lovable / Cloudflare build is completely unaffected.
 *
 * Pages is a static host with no server, so this variant:
 *   - turns nitro off and prerenders every route to a real .html file
 *   - serves from a sub-path (https://<user>.github.io/<repo>/), hence base + basepath
 *   - pins the prerender preview server to IPv4 (GitHub runners vary on ::1)
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basepath = (process.env.PAGES_BASE ?? "/gamehub-glow").replace(/\/$/, "");

const pagesOverrides = {
  nitro: false,
  vite: {
    base: `${basepath}/`,
    preview: { host: "127.0.0.1" as const },
  },
} as const;

export default defineConfig({
  ...(isPages ? pagesOverrides : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isPages
      ? {
          router: { basepath },
          prerender: {
            enabled: true,
            crawlLinks: true,
            autoSubfolderIndex: true,
            failOnError: true,
            // crawlLinks discovers /library and every /games/<slug> from the homepage.
          },
        }
      : {}),
  },
});
