import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, def: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : def;
    } catch {
      return def;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [key, state]);

  return [state, setState] as const;
}
