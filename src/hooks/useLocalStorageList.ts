import { useCallback, useEffect, useState } from "react";

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useLocalStorageList(key: string) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read(key));
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setItems(read(key));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const persist = useCallback(
    (next: string[]) => {
      setItems(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ignore
      }
    },
    [key],
  );

  const toggle = useCallback(
    (id: string) => {
      const next = items.includes(id) ? items.filter((i) => i !== id) : [...items, id];
      persist(next);
    },
    [items, persist],
  );

  const push = useCallback(
    (id: string, max = 12) => {
      const next = [id, ...items.filter((i) => i !== id)].slice(0, max);
      persist(next);
    },
    [items, persist],
  );

  const has = useCallback((id: string) => items.includes(id), [items]);

  return { items, hydrated, toggle, push, has };
}
