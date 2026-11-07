# konradbialy.com

Static-first personal portfolio and services site. Prioritize semantic HTML, accessibility, SEO, and Core Web Vitals.

## Stack

- Astro (static output) with strict TypeScript; React only for interactive islands that need it.
- Bun owns installs and scripts; commit `bun.lock`. Keep static output.
- `check` runs `astro sync` and TypeScript 7.1 with the official `@astrojs/ts-content-mapper` for `.astro` and TS/TSX in one strict config. TS 7.1 beta and the experimental mapper are deliberately pinned; use stable 7.1 when available. Do not restore TS6, `astro check`, or suppress validation for compatibility.
- Use scoped `<style>` in `.astro` and CSS Modules in React. `src/styles/tokens.css` owns design tokens; `global.css` owns reset and base styles. No Tailwind, StyleX, shadcn/ui, or CSS-in-JS.
- Use Base UI only for complex accessible interactions. Import `@base-ui/react` exclusively inside reusable React primitives in `src/components/ui/`, styled with CSS Modules. Prefer native HTML for simple controls.

## Architecture

- `src/pages/`: thin routes; `src/layouts/`: shared shell and SEO; `src/components/sections/`: page sections; `src/components/ui/`: reusable primitives; `src/content/`: project data; `src/styles/`: global CSS and tokens.
- Each content fact, token, and shared behavior has one authoritative owner. Colocate related code and styles; do not duplicate sources of truth.
- Avoid giant components, barrel files, catch-all utility folders, and speculative layers. Extract abstractions only when reuse is real.

## Quality

- Oxlint + Oxfmt only, with minimal configuration; explicitly enable `.astro` formatting. No ESLint or separate Prettier setup.
- Before finishing relevant changes, run repository lint, format-check, Astro/type-check, and production-build scripts. Fix failures; do not suppress checks.
- Verify keyboard/focus behavior and mobile layout for UI changes.
