import type { ShikiConfig } from "astro";
import { codeIcons } from "./icons";

type Transformer = NonNullable<ShikiConfig["transformers"]>[number];
type Element = Parameters<NonNullable<Transformer["pre"]>>[0];

function element(
  tagName: string,
  properties: Element["properties"],
  children: Element["children"] = [],
): Element {
  return { type: "element", tagName, properties, children };
}

const text = (value: string): Element["children"][number] => ({ type: "text", value });

const languages: Record<string, { name: string; icon: keyof typeof codeIcons }> = {
  ts: { name: "TypeScript", icon: "typescript" },
  typescript: { name: "TypeScript", icon: "typescript" },
  tsx: { name: "TSX", icon: "typescript" },
  js: { name: "JavaScript", icon: "javascript" },
  javascript: { name: "JavaScript", icon: "javascript" },
  mjs: { name: "JavaScript", icon: "javascript" },
  jsx: { name: "JSX", icon: "react" },
  css: { name: "CSS", icon: "file" },
  html: { name: "HTML", icon: "file" },
  astro: { name: "Astro", icon: "file" },
  json: { name: "JSON", icon: "file" },
  bash: { name: "Bash", icon: "terminal" },
  sh: { name: "Shell", icon: "terminal" },
  shell: { name: "Shell", icon: "terminal" },
  text: { name: "Plain text", icon: "file" },
  plaintext: { name: "Plain text", icon: "file" },
};

function icon(name: keyof typeof codeIcons, className?: string): Element {
  const { viewBox, size, shapes } = codeIcons[name];
  return element(
    "svg",
    {
      viewBox,
      width: size,
      height: size,
      fill: "currentColor",
      fillRule: "evenodd",
      "aria-hidden": "true",
      ...(className ? { className: [className] } : {}),
    },
    shapes.map(({ tagName, properties }) => element(tagName, properties)),
  );
}

export const codeBlocks: Transformer = {
  name: "article-code-blocks-geist",
  root(root) {
    if (this.pre.tagName !== "pre") return;
    const language = this.options.lang || "text";
    const { name, icon: languageIcon } = languages[language] ?? { name: language, icon: "file" };
    const meta = this.options.meta?.__raw ?? "";
    const title = meta.match(/(?:^|\s)title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/u);
    const filename = title?.[1] ?? title?.[2] ?? title?.[3] ?? name;

    this.pre.properties["aria-label"] = `${filename} - ${name} code`;

    root.children = [
      element("figure", { className: ["code-block"] }, [
        element("figcaption", { className: ["code-block-header"] }, [
          element("span", { className: ["code-block-file"], title: `${filename} - ${name}` }, [
            element("span", { className: ["code-block-language"] }, [icon(languageIcon)]),
            element("span", { className: ["code-block-filename"] }, [text(filename)]),
          ]),
          element("span", { className: ["code-block-status"], role: "status" }),
          element(
            "button",
            {
              type: "button",
              className: ["code-block-copy"],
              "data-copy-code": "",
              "aria-label": `Copy code from ${filename}`,
              title: "Copy code",
              hidden: true,
            },
            [icon("copy", "copy-icon"), icon("check", "copy-check"), icon("error", "copy-error")],
          ),
        ]),
        this.pre,
      ]),
    ];
  },
};
