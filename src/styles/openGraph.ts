import type { OGImageOptions } from "astro-og-canvas";
import tokens from "./tokens.css?raw";

function tokenColor(name: string): [number, number, number] {
  const hex = tokens.match(new RegExp(`${name}:\\s*#([\\da-f]{6});`, "iu"))?.[1];
  if (!hex) throw new Error(`Open Graph image requires a six-digit hex token: ${name}`);
  return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function titleSize(title: string) {
  // Conservatively allow one em per character, including wrapping at word boundaries.
  // The renderer provides 960 px of text width with 80 px padding.
  for (let size = 76; size >= 16; size -= 2) {
    const capacity = Math.floor(960 / size);
    let lines = 1;
    let used = 0;
    for (const word of title.split(/\s+/u)) {
      const length = Array.from(word).length;
      if (used && used + 1 + length > capacity) {
        lines++;
        used = 0;
      }
      lines += Math.floor((length - 1) / capacity);
      used = used ? used + 1 + length : ((length - 1) % capacity) + 1;
    }
    if (lines * size * 1.15 <= 440) return size;
  }
  throw new Error(`Article title is too long to fit its Open Graph image: ${title}`);
}

export function essayImageOptions(title: string): OGImageOptions {
  const text = title.trim().replace(/\s+/gu, " ");
  return {
    // astro-og-canvas decodes HTML entities; preserve literal frontmatter text.
    title: text.replaceAll("&", "&amp;"),
    bgGradient: [tokenColor("--color-surface")],
    padding: 80,
    fonts: ["./src/assets/fonts/inter-og-semibold.ttf"],
    font: {
      title: {
        families: ["Inter"],
        weight: "SemiBold",
        size: titleSize(text),
        lineHeight: 1.15,
        color: tokenColor("--color-foreground"),
      },
    },
  };
}
