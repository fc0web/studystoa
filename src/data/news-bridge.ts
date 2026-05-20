/**
 * news-bridge.ts — rei-aios edu-news + research-radar data fetch
 *
 * Phase 1 MVP (2026-05-20, STEP 1090 流用):
 *   Fetches news data from rei-aios deployed site at https://rei-aios.pages.dev/data/...
 *
 *   - At build time (Astro static generation), this runs in Node and fetches HTTP.
 *   - Includes graceful failure (returns sample data if rei-aios fetch fails).
 *
 * Data sources currently bridged:
 *   1. edu-news/latest.json (Inside Higher Ed + The Hechinger Report + HN education)
 *      schemaVersion 2 — STEP 1090 で imageUrl field 追加済
 *
 *   Future bridges (Phase 2+):
 *   - research-radar/philosophy-bites-YYYY-MM-DD.json
 *   - research-radar/daily-nous-YYYY-MM-DD.json
 *   - research-radar/n-cat-cafe-YYYY-MM-DD.json
 *   - research-radar/philarchive-YYYY-MM-DD.json
 *   - research-radar/philsci-archive-YYYY-MM-DD.json
 *
 * Stance (法的):
 *   各 source は元 publisher へ direct link (UTM 等 tracker は付けず)
 *   見出し + 短要約 + image (OG meta) は fair use 範疇 (Yahoo!ニュース / Google ニュース 慣行と整合)
 */

const REI_AIOS_BASE = 'https://rei-aios.pages.dev';

export type Category =
  | 'philosophy'
  | 'thought'
  | 'education'
  | 'learning'
  | 'certification'
  | 'other';

export interface NewsItem {
  source: string;
  sourceLabel?: string;
  title: string;
  url: string;
  published: string;
  summary?: string;
  author?: string;
  imageUrl?: string | null;
  category: Category;
}

/** Simple category assignment heuristic based on source. */
function categorize(source: string): Category {
  if (source === 'inside-higher-ed' || source === 'hechinger') return 'education';
  if (source === 'hn') return 'learning';
  if (source.includes('philosophy') || source.includes('phil')) return 'philosophy';
  if (source === 'daily-nous' || source === 'n-cat-cafe') return 'thought';
  return 'other';
}

const SOURCE_LABELS: Record<string, string> = {
  'hn': 'Hacker News',
  'inside-higher-ed': 'Inside Higher Ed',
  'hechinger': 'The Hechinger Report',
  'philosophy-bites': 'Philosophy Bites',
  'daily-nous': 'Daily Nous',
  'n-cat-cafe': 'n-Category Café',
  'philarchive': 'PhilArchive',
  'philsci-archive': 'PhilSci-Archive',
};

/** Fetch with timeout + graceful failure. */
async function fetchJson(url: string, timeoutMs = 10000): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Fetch edu-news/latest.json from rei-aios (Phase 1 fallback). */
export async function fetchEduNews(): Promise<NewsItem[]> {
  const url = `${REI_AIOS_BASE}/data/edu-news/latest.json`;
  const data = await fetchJson(url);
  if (!data || !Array.isArray(data.items)) {
    console.warn(`[news-bridge] edu-news fetch failed`);
    return [];
  }
  return data.items.map((item: any) => ({
    source: item.source,
    sourceLabel: SOURCE_LABELS[item.source] || item.source,
    title: item.title,
    url: item.url,
    published: item.published,
    summary: item.summary,
    author: item.author,
    imageUrl: item.imageUrl ?? null,
    category: categorize(item.source),
  }));
}

/**
 * Phase 2 (G): fetch unified studystoa-feed (rei-aios build-studystoa-news-feed.ts output).
 * 5-category aggregation (philosophy + thought + education + learning + certification).
 */
export async function fetchUnifiedFeed(): Promise<NewsItem[]> {
  const url = `${REI_AIOS_BASE}/data/studystoa-feed/latest.json`;
  const data = await fetchJson(url);
  if (!data || !Array.isArray(data.items)) {
    console.warn(`[news-bridge] studystoa-feed fetch failed`);
    return [];
  }
  return data.items.map((item: any) => ({
    source: item.source,
    sourceLabel: item.sourceLabel || SOURCE_LABELS[item.source] || item.source,
    title: item.title,
    url: item.url,
    published: item.published,
    summary: item.summary,
    author: item.author,
    imageUrl: item.imageUrl ?? null,
    category: (item.category as Category) || categorize(item.source),
  }));
}

/**
 * Aggregate all sources with graceful fallback chain:
 *   1. Try unified studystoa-feed (Phase 2: 5 categories, 100 items typical)
 *   2. Fallback to edu-news only (Phase 1: 30 items)
 *   3. Fallback to SAMPLE_NEWS (offline dev)
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  const unified = await fetchUnifiedFeed();
  if (unified.length > 0) {
    return unified.sort((a, b) => (b.published || '').localeCompare(a.published || ''));
  }
  // Fallback 1: edu-news only
  const eduNews = await fetchEduNews();
  if (eduNews.length > 0) {
    return eduNews.sort((a, b) => (b.published || '').localeCompare(a.published || ''));
  }
  // Fallback 2: sample
  console.warn(`[news-bridge] all sources failed, using SAMPLE_NEWS`);
  return SAMPLE_NEWS;
}

/** Filter by category. */
export function filterByCategory(items: NewsItem[], category: Category): NewsItem[] {
  return items.filter(it => it.category === category);
}

/** Sample fallback news (used when rei-aios fetch fails — e.g., offline dev). */
const SAMPLE_NEWS: NewsItem[] = [
  {
    source: 'sample',
    sourceLabel: 'StudyStoa Sample',
    title: 'StudyStoa Phase 1 MVP — data bridge from rei-aios edu-news pending',
    url: 'https://rei-aios.pages.dev/data/edu-news/latest.json',
    published: new Date().toISOString(),
    summary: 'When rei-aios.pages.dev is reachable, this card will be replaced with real edu-news data including OG images. Build environment may need network access.',
    imageUrl: null,
    category: 'other',
  },
];
