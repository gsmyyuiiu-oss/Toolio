import { ThemeMode } from '../types';

const RECENT_KEY = 'toolio_recent_tools';
const FAVORITES_KEY = 'toolio_favorites';
const THEME_KEY = 'toolio_theme';

export function getRecentTools(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentTool(slug: string): void {
  try {
    const current = getRecentTools().filter(s => s !== slug);
    const updated = [slug, ...current].slice(0, 8); // Keep top 8 recent
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string): boolean {
  try {
    const current = getFavorites();
    let updated: string[];
    let isFav = false;
    if (current.includes(slug)) {
      updated = current.filter(s => s !== slug);
      isFav = false;
    } else {
      updated = [slug, ...current];
      isFav = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return isFav;
  } catch {
    return false;
  }
}

export function getStoredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY) as ThemeMode;
    return saved || 'system';
  } catch {
    return 'system';
  }
}

export function setStoredTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, mode);
  } catch {
    // ignore
  }
}
