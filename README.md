# StudyStoa

Global philosophy / thought / education / learning / certification news portal.

**Operator**: Nobuki Fujimoto (Founder of [Rei-AIOS](https://rei-aios.pages.dev))
**Status**: Phase 1 MVP (2026-05-20 init)
**Target URL**: `https://studystoa.pages.dev` (pending Cloudflare Pages deployment)

---

## Concept

A daily-updated portal aggregating signal from world-class philosophy/thought/education/learning/certification sources.

- **Role separation from Rei-AIOS**:
  - **Rei-AIOS**: research / formulas / code / formal proofs / non-commercial academic
  - **StudyStoa**: commentary / news / multilingual / curated reading lists (commercial-friendly)
- **Image-first card layout**: Microsoft Start / Apple News pattern
- **Multilingual from day 1**: English (`/`) + Japanese (`/ja/`)
- **Data source**: Bridged from [rei-aios.pages.dev/data/edu-news/latest.json](https://rei-aios.pages.dev/data/edu-news/latest.json) (Inside Higher Ed + The Hechinger Report + HN education)
- **Growing gradually**: Phase 1 (weekly) → Phase 2 (daily) → Phase 3 (multilingual expand) → Phase 4+ (world-class recognition target)

## Tech stack

- [Astro 4.x](https://astro.build/) (static site generator, i18n routing built-in)
- TypeScript (strict mode)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/) (free tier)
- No external CMS — content fetched at build time from rei-aios

---

## Setup (Nobuki 側 手動 step)

### 1. Local dev

```bash
cd C:/Users/user/studystoa
npm install
npm run dev
```

Then open http://localhost:4321 in your browser.

### 2. GitHub repo 作成

```bash
cd C:/Users/user/studystoa
git init
git add -A
git commit -m "init: Phase 1 MVP skeleton (Astro + i18n + edu-news bridge)"
# GitHub.com で新 repo `studystoa` 作成 (public でも private でも OK)
git remote add origin https://github.com/fc0web/studystoa.git
git branch -M main
git push -u origin main
```

★ **Rei-AIOS と別 repo にすること重要** (commit 履歴を分離).

### 3. Cloudflare Pages connect

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. GitHub `studystoa` repo を select
3. Build settings:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (empty / repo root)
   - **Node version**: `18` or `20` (環境変数 `NODE_VERSION=20` を Settings → Environment variables で追加)
4. **Save and Deploy**
5. 完成後 `studystoa.pages.dev` でアクセス可能

### 4. Build production locally (optional 動作確認)

```bash
npm run build
npm run preview
```

`dist/` 配下に静的ファイル生成. `npm run preview` で http://localhost:4321 で確認.

---

## Project structure

```
studystoa/
├── package.json
├── astro.config.mjs           # i18n: en (default) + ja
├── tsconfig.json
├── README.md                  # 本 file
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── pages/
    │   ├── index.astro        # English home (top)
    │   ├── about.astro        # English about (Role separation 明示)
    │   └── ja/
    │       ├── index.astro    # Japanese home
    │       └── about.astro    # Japanese about
    ├── layouts/
    │   └── Base.astro          # base layout + OG meta + hreflang + footer
    ├── components/
    │   ├── NewsCard.astro      # image-first card (16:9 + title + source + summary)
    │   ├── NewsGrid.astro      # responsive grid
    │   └── LangSwitch.astro    # 日英切替
    ├── data/
    │   └── news-bridge.ts      # rei-aios.pages.dev/data/edu-news fetch + graceful fallback
    └── i18n/
        ├── en.json             # English strings
        └── ja.json             # Japanese strings
```

---

## Phase roadmap

| Phase | timeline | scope |
|---|---|---|
| **Phase 1 (本 init)** | 2026-05〜 | MVP: 1 source (edu-news from rei-aios) + 日英 + image-first card |
| **Phase 2** | 2026-Q3〜Q4 | research-radar 全 source bridge (philosophy-bites / daily-nous / n-cat-cafe / philarchive 等) + Giscus コメント + AdSense 申請 |
| **Phase 3** | 2027〜 | 5 分野横断 8 値分類 lens + 多言語拡張 (中 / 西 / 仏 / 独 / アラビア) + 資格 source 拡張 |
| **Phase 4+** | 2028〜 | World-class portal target + community building |

---

## Honest scope

- **Phase 1 MVP** — content quality builds gradually
- **Sources**: Headlines + short summaries + OG image (元 source 公開意図 meta tag), each card links back to original publisher (fair use範疇, Yahoo!ニュース / Google ニュース 慣行と整合)
- **No automated article writing** — all articles point to third-party sources
- **No paywall** — free portal with future ads / affiliate (Phase 2+)
- **Operated by 1 person + AI** — automated data fetch but editorial curation gradual
- **No PII / no tracking** — except standard hosting analytics (Cloudflare Pages basic)

## Source Policy

Full per-source verification (robots.txt, Terms of Service, OG image policy, defensive measures) is documented at:

**[Rei-AIOS docs/source-policy.md](https://github.com/fc0web/rei-aios/blob/main/docs/source-policy.md)** — single source of truth (shared between Rei-AIOS + StudyStoa).

Phase 1 source verification summary (2026-05-20):

| source | crawling | AI-bot ban | RSS/API | verdict |
|---|---|---|---|---|
| Inside Higher Ed | ✅ Allow | ⚠ AI training bots banned + `ai-train=no` | RSS public | Grey zone — defensive measures applied (UA / 200-char summary / direct link / no AI training use) |
| The Hechinger Report | ✅ Allow | ✅ no restriction | RSS `/feed/` allowed | Clear OK |
| HN Algolia | ✅ public API | ✅ free, CORS open | JSON API ~10k/hr | Clear OK |

Open Graph images are hot-linked from publisher CDNs (industry-standard fair use, same as Yahoo / Google News / Smartnews / Apple News). If any publisher requests removal, contact `fc2webb@gmail.com` for compliance within 7 days.

## License & Attribution

- This site's **own** code: MIT or AGPL-3.0 (TBD)
- All third-party news headlines / summaries / images remain copyright of original publishers
- Each card explicitly displays source label + direct link to original article

## Related

- [Rei-AIOS](https://rei-aios.pages.dev) — research frontier · Zenodo papers · Lean 4 formal verification
- [Nobuki Fujimoto's ORCID](https://orcid.org/0009-0008-0775-3960)

---

## Maintenance

- News data refresh: rei-aios `edu-news` is updated daily (cron). studystoa re-builds when pushed (Cloudflare Pages auto-deploy).
- For periodic re-fetch of news data, set up Cloudflare Pages **Scheduled deployment** (Settings → Builds & deployments → Cron) e.g. daily.
- Or manual: `git commit --allow-empty -m "trigger rebuild"` + `git push`.
