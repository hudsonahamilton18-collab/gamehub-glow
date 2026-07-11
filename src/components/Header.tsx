import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Gamepad2, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate({ to: "/library", search: q ? { q } : {} });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
            <Gamepad2 className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-black tracking-tight">
            Game<span className="text-primary">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/library">Library</NavLink>
        </nav>

        <form onSubmit={submit} className="ml-auto hidden max-w-sm flex-1 md:block">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full rounded-full border border-border bg-secondary/50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:bg-secondary"
            />
          </label>
        </form>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background/95 px-4 py-4 md:hidden">
          <form onSubmit={submit} className="mb-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full rounded-full border border-border bg-secondary/50 py-2 pl-9 pr-4 text-sm outline-none"
              />
            </label>
          </form>
          <div className="flex flex-col">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/library">Library</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground data-[status=active]:text-foreground"
    >
      {children}
    </Link>
  );
}
