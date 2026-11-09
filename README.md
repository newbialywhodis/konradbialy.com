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

Oxlint sprawdza kod w frontmatter i skryptach `.astro`, ale nie ich szablony HTML.
Plugin `jsx-a11y` obejmuje JSX/TSX; nie zastępuje kontroli dostępności stron Astro.
Po zmianach UI sprawdź wygenerowane strony narzędziem axe, przejście klawiaturą
i układ mobilny.

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
Adresy SEO (canonical, Open Graph, sitemap i robots.txt) korzystają z `site` w `astro.config.mjs`.

`check` uruchamia `astro sync --force && tsc --noEmit --runExternalCode`.
Oficjalny `@astrojs/ts-content-mapper` pozwala jednemu kompilatorowi sprawdzać
`.astro` i TS/TSX z tego samego `tsconfig.json` w trybie strict.
`astro sync --force` odświeża treści i generuje wymagane typy Astro przed sprawdzeniem projektu.
Wymuszenie synchronizacji zapobiega użyciu starego HTML po zmianach transformera Shiki
lub jego ikon, których implementacja nie unieważnia automatycznie cache treści.

To docelowy kierunek integracji Astro z TypeScript, obecnie eksperymentalny.
TypeScript `7.1.0-beta` i mapper `0.2.0` są celowo przypięte do konkretnych wersji.
@TODO
Po wydaniu TS 7.1 zaktualizować zależność i ponownie wykonać kontrole.

## Treści i wygląd

`src/content/site.ts` zawiera dane osobowe, kontakt i opis Lotji.
`src/content/localContext.ts` zawiera lokalizację dla zegara i pogody.
Każda sekcja ma osobny komponent w `src/components/sections/` i scoped CSS.
Kolory, typografia i odstępy mają jedno źródło w `src/styles/tokens.css`.

## Artykuły i eseje

Teksty są w `src/content/essays/*.md`. Kolekcja w `src/content.config.ts` sprawdza
`title`, `description`, `date` i `illustration`; nazwa pliku wyznacza adres `/writing/nazwa-pliku/`.
Nowy artykuł wymaga tylko pliku Markdown i ponownego buildu:

```md
---
title: "Tytuł artykułu"
description: "Krótki opis do listy tekstów i metadanych SEO."
date: 2026-11-09
illustration: styling
---

Pierwszy akapit. Tytuł strony pochodzi z frontmatter, więc nie powtarzaj go jako H1.

## Pierwsza sekcja

Treść artykułu.
```

Strona główna pokazuje trzy najnowsze teksty, a `/writing/` pełną listę, od najnowszego.
Pole `illustration` wybiera SVG pasujące do tematu tekstu. Dostępne nazwy definiuje
`src/components/ui/illustrations.ts`, a rysunki i ich wspólne style - `MiniIllustration.astro`.
Nowy motyw dodaj w obu tych plikach i przypisz go w metadanych artykułu;
brak lub nieznana nazwa zatrzymuje build. Karty Writing i What I do korzystają
ze wspólnego `SurfaceCard.astro`; linki mają cień na hover i fokus klawiatury.
Obrys kart pochodzi z `--shadow-card` i bazowego `--color-foreground`, który zasila
też `--color-text`. Klikalne karty delikatnie zmniejszają się podczas naciskania;
`prefers-reduced-motion` wyłącza ten ruch.
Artykuły automatycznie trafiają do sitemap. Spis treści powstaje z nagłówków H2,
a przybliżony czas czytania jest obliczany z treści, przy założeniu 220 słów na minutę.

Każdy artykuł otrzymuje podczas buildu własny obraz Open Graph pod adresem
`/og/writing/nazwa-pliku.png`. `astro-og-canvas` generuje PNG 1200 × 630 px:
białe tło, ciemny tytuł w Interze SemiBold i duże marginesy. Kolory pochodzą
z tokenów strony, a rozmiar tekstu zmniejsza się dla długich tytułów.
Tytuł z frontmatter jest wspólnym źródłem dla grafiki i jej opisu alternatywnego.
Layout artykułu ustawia bezwzględny adres obrazu w Open Graph i Twitter Cards;
strona główna i lista tekstów zachowują `/og-image.png`.
Generator nie wymaga backendu, JavaScriptu w przeglądarce ani pobierania fontów z sieci.
Po zmianie tytułu trzeba ponownie zbudować i opublikować stronę. Serwisy społecznościowe
mogą zachowywać starszy podgląd we własnym cache nawet po publikacji nowej wersji.

Wygląd grafik definiuje `src/styles/openGraph.ts`, endpoint jest w
`src/pages/og/writing/[...id].png.ts`, a adres obrazu wyznacza `essayImageHref`.
Generator używa `src/assets/fonts/inter-og-semibold.ttf` (65 324 B), statycznej
wersji Intera o wadze 600, scalonej z istniejących subsetów Latin i Polish.
Ten plik służy wyłącznie do buildu i nie jest wysyłany do przeglądarki.
Obowiązuje ta sama licencja `public/fonts/OFL.txt`. Po zmianie źródłowych fontów
odtwórz go poleceniem (uv i FontTools są potrzebne tylko do regeneracji fontu):

```sh
uv run --with 'fonttools[woff]==4.68.0' python scripts/generate-og-font.py
```

Wybór technologii:

| Rozwiązanie                    | Zastosowanie w tym projekcie                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| Markdown + Content Collections | Obecny wybór: pliki w repo, walidacja metadanych i HTML generowany podczas buildu.                |
| MDX                            | Do rozważenia, gdy teksty będą potrzebowały osadzonych komponentów lub interaktywnych przykładów. |
| Zewnętrzny CMS                 | Do rozważenia, jeśli potrzebny będzie panel redakcyjny lub praca wielu autorów.                   |

Używamy domyślnego procesora Markdown Astro 7 (Sätteri) i wbudowanego Shiki
z jasnym motywem. Renderowanie treści i podświetlanie kodu odbywają się podczas buildu.
Widok `/writing/` nie wysyła wykonywalnego JavaScriptu. Artykuły mają mały skrypt
do kopiowania kodu; treść i belki bloków pozostają dostępne bez JavaScriptu.
Układ korzysta z lokalnego Intera i scoped CSS; typografia czytelnicza ma własne tokeny.
Spis treści używa natywnego `details`, a bloki kodu można przewijać klawiaturą.

Tekst artykułów ma rozmiar 17 px i interlinię 1.75. Akapity i elementy list używają
`text-wrap: pretty`, a kod w zdaniach ma neutralne tło i delikatny obrys.
Bibliografię otaczamy `<footer class="article-sources">` z pustymi liniami wokół
znaczników, aby jej nagłówek i lista nadal były parsowane jako Markdown.
Sekcja źródeł ma mniejszy tekst, ciaśniejszą interlinię i stonowane linki.

Blok kodu ma szarą belkę z ikoną języka, nazwą pliku i przyciskiem kopiowania.
Nazwę lub ścieżkę podaj w metadanych bloku, np.:

````md
```tsx title="src/components/Button.tsx"
export function Button() {
  return <button>Continue</button>;
}
```
````

Bez `title` belka pokazuje nazwę języka. Transformacja Shiki i komponent w
`src/components/CodeBlocks/` odpowiadają za HTML, style i kopiowanie.

Wygląd bloków wzoruje się na [Geist Code Block](https://vercel.com/geist/code-block)
i [dokumentacji Next.js](https://nextjs.org/docs/app/guides/view-transitions): belka
40 px, zwykła etykieta 13 px, ikony SVG 14–16 px i potwierdzenie przez zmianę ikony.
Geometrię SVG z renderowanego komponentu Next.js zapisujemy w `icons.ts`; TSX używa
ikony TypeScriptu, JSX - Reacta, a CSS - pliku, tak jak we wskazanej dokumentacji.
Po zmianach w `transformer.ts` lub `icons.ts` wystarczy `bun run build`;
skrypt automatycznie odświeża cache Markdown przed generowaniem stron.

Przejścia między dokumentami korzystają z `@view-transition` i trwają 180 ms.
To zwykła nawigacja przeglądarki, bez `ClientRouter`. Przeglądarki bez obsługi API
otwierają strony standardowo, a `prefers-reduced-motion: reduce` wyłącza przejścia
i płynne przewijanie. Obie strony przejścia muszą pochodzić z tego samego originu.

Dokumentacja: [Content Collections](https://docs.astro.build/en/guides/content-collections/),
[Markdown i MDX](https://docs.astro.build/en/guides/markdown-content/),
[Shiki](https://docs.astro.build/en/guides/syntax-highlighting/),
[`@view-transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition).

Font Inter jest serwowany lokalnie z `public/fonts/`.
Plik Latin zachowuje dotychczasowe litery, cyfry i interpunkcję (w tym `Óó`).
`inter-polish-variable.woff2` dodaje `ĄąĆćĘęŁłŃńŚśŹźŻż`; oba pliki zachowują
zmienną grubość 100–900 i ważą łącznie 53 516 B zamiast 133 324 B.
To stały zestaw dla angielskiego i polskiego, niezależny od aktualnej treści artykułów.

Polski subset powstał z dotychczasowego `inter-latin-ext-variable.woff2`
([źródło w repo](https://github.com/newbialywhodis/konradbialy.com/blob/493af808c175ff49243878be8c0df3a7b9855e3d/public/fonts/inter-latin-ext-variable.woff2)),
Inter 4.001, narzędziem FontTools 4.68.0 z obsługą WOFF2. Po pobraniu pliku źródłowego
można go odtworzyć poleceniem:

```sh
fonttools subset inter-latin-ext-variable.woff2 --unicodes=U+0104-0107,U+0118-0119,U+0141-0144,U+015A-015B,U+0179-017C --layout-features='*' --name-IDs='*' --no-ignore-missing-unicodes --flavor=woff2 --output-file=public/fonts/inter-polish-variable.woff2
```

FontTools jest potrzebny tylko do regenerowania tego assetu; zwykły build używa gotowych plików.
Licencja Intera pozostaje w `public/fonts/OFL.txt`.

Strona nie ładuje zewnętrznych fontów, skryptów lub trackerów.
Mały skrypt stopki wyświetla czas w `Europe/Warsaw` i temperaturę dla Koszalina (tutaj mieszkam) z Open-Meteo.
Pogoda odświeża się co 15 minut w aktywnej karcie, z cache'em w localStorage.
Czas pobrania ogranicza zapytania, a czas pomiaru decyduje o świeżości danych.
Dane starsze niż 30 minut są ukrywane; przy błędzie API zostaje zegar, a bez JS - „in Poland”.
Link na temperaturze zapewnia atrybucję Open-Meteo. Zapytania idą bezpośrednio z przeglądarki do API.
