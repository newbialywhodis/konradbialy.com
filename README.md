# konradbialy.com

Prosta stronka z lekkim charakterkiem
Wymagane Bun 1.4.4 i Node.js 24 LTS.

```sh
bun install --frozen-lockfile
bun run dev
```

## Kontrole

```sh
bun run lint
bun run format:check
bun run check
bun run build
```

`bun run format` formatuje źródła. `build` sprawdza typy przed generowaniem statycznego `dist/`.

## Deployment na Cloudflare Workers

Projekt pozostaje Astro SSG. `wrangler.jsonc` publikuje `dist/` jako Workers Static Assets
pod nazwą `konradbialy-com`, bez adaptera Cloudflare i bez skryptu backendowego Workera.
Konfiguracja odpowiada [zaleceniom Cloudflare dla Static Assets](https://developers.cloudflare.com/workers/static-assets/binding/).

```sh
bun run build
bunx wrangler deploy --dry-run
bunx wrangler login
bunx wrangler deploy
```

`--dry-run` sprawdza konfigurację bez publikowania. Przed deploymentem zawsze zbuduj `dist/`.
W Cloudflare Workers Builds ustaw build command na `bun run build`, a deploy command na
`bunx wrangler deploy` (instalacja zależności: `bun install --frozen-lockfile`).
Po publikacji przypisz `konradbialy.com` w ustawieniach Workera: Settings → Domains & Routes → Add → Custom Domain.
Domena musi być aktywną strefą na tym samym koncie Cloudflare.
Adresy SEO (canonical, Open Graph, sitemap i robots.txt) wskazują `https://konradbialy.com`.

`check` uruchamia `astro sync && tsc --noEmit --runExternalCode`.
Oficjalny `@astrojs/ts-content-mapper` pozwala jednemu kompilatorowi sprawdzać
`.astro` i TS/TSX z tego samego `tsconfig.json` w trybie strict.
`astro sync` generuje wymagane typy Astro przed sprawdzeniem projektu.

To docelowy kierunek integracji Astro z TypeScript, obecnie eksperymentalny.
TypeScript `7.1.0-beta` i mapper `0.2.0` są celowo przypięte do konkretnych wersji.
@TODO
Po wydaniu TS 7.1 zaktualizować zależność i ponownie wykonać kontrole.

## Treści i wygląd

`src/content/site.ts` zawiera dane osobowe, kontakt i opis Lotji.
`src/content/localContext.ts` zawiera lokalizację dla zegara i pogody.
Każda sekcja ma osobny komponent w `src/components/sections/` i scoped CSS.
Kolory, typografia i odstępy mają jedno źródło w `src/styles/tokens.css`.

Font Inter jest serwowany lokalnie z `public/fonts/`.
Strona nie ładuje zewnętrznych fontów, skryptów lub trackerów.
Mały skrypt stopki wyświetla czas w `Europe/Warsaw` i temperaturę dla Koszalina (tutaj mieszkam) z Open-Meteo.
Pogoda odświeża się co 15 minut w aktywnej karcie, z cache'em w localStorage.
Czas pobrania ogranicza zapytania, a czas pomiaru decyduje o świeżości danych.
Dane starsze niż 30 minut są ukrywane; przy błędzie API zostaje zegar, a bez JS - „in Poland”.
Link na temperaturze zapewnia atrybucję Open-Meteo. Zapytania idą bezpośrednio z przeglądarki do API.
