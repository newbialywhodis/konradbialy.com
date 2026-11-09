---
title: "I Don't Like Tailwind. Here's Why."
description: "Why I prefer CSS Modules, dislike styling in JSX, and associate Tailwind with AI slop."
date: 2026-11-09
illustration: styling
---

_On reading components, keeping visual rules in CSS, and choosing how I want to work._

Whenever I open a component full of Tailwind classes, I have the same reaction: I don't like looking at it.

This is about how I read and maintain components, not a claim that Tailwind produces worse websites.

I want JSX to describe structure and component choices. I want visual rules in CSS. Long strings of utility classes put both in the same place, and I find that harder to read.

For a while I thought I was attached to the way I'd always written CSS. Then I noticed that I was cutting back on Mantine's style props, too. And I actually liked those props.

Both approaches put visual instructions directly in the component. That's what was starting to bother me.

## I want to read a component without reading its CSS

Here's a small example. Both versions use the same base reset and Tailwind 4's default theme values. In Tailwind, the button looks like this:

```tsx title="Button.tsx"
export function Button() {
  return (
    <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
      Continue
    </button>
  );
}
```

With CSS Modules, the component could look like this:

```tsx title="Button.tsx"
import styles from "./button.module.css";

export function Button() {
  return <button className={styles.button}>Continue</button>;
}
```

The CSS would live next to it:

```css title="button.module.css"
.button {
  padding-block: 0.5rem;
  padding-inline: 1rem;
  border-radius: 0.5rem;
  background-color: black;
  color: white;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
}
```

The CSS Module version uses more code overall. It keeps the visual rules out of JSX, which is what I want when I'm reading a component.

I see a button. If I want to change how it looks, I open the CSS file. The structure and the visual rules don't compete for my attention.

## It's not just about how many classes there are

`styles.button` tells me what the class represents in this component. A sequence like `px-4 py-2 bg-black rounded-lg` tells me how the element should look.

Utilities put property choices in JSX. A CSS Module gives that collection of choices a local name. That's the level of abstraction I want when I'm reading a component.

Tailwind supports reusable components, design tokens, custom CSS, and automatic class sorting. Those tools help organize a project.

But even a perfectly sorted list of utility classes is still a list of visual instructions inside my markup. That's the part that doesn't click for me.

## Mantine made me notice another problem

Mantine is a good example because I actually enjoyed its styling props. Writing `mt="md"` or `p="xl"` is convenient.

I started using them less because they gave me too many places to look when changing a component's appearance.

Imagine this:

```tsx title="Button.tsx"
<Button className={styles.button} mt="lg" c="white" radius="md" style={{ fontWeight: 600 }}>
  Continue
</Button>
```

Here, `radius` is a component prop, `mt` and `c` are style props, and `style` adds an inline declaration. The CSS Module and theme also contribute to the final appearance.

Suppose I add this to the stylesheet:

```css title="button.module.css"
.button {
  color: black;
}
```

The text stays white. `c="white"` sets `color` inline, so the ordinary class declaration cannot override it. To change the color in CSS, I first need to remove the conflicting prop or use `!important`. The rule I'm editing is in one file; the reason it has no effect is in another.

[Mantine's documentation](https://mantine.dev/styles/styles-overview/) explicitly recommends limiting style props to roughly three or four per component and moving more complex styling into a separate stylesheet. It recommends [CSS Modules](https://mantine.dev/styles/css-modules/) for most styles.

A prop such as `variant="filled"` or `size="md"` exposes a meaningful component choice. Describing every margin, color, and font weight through props puts individual CSS decisions back into the markup.

My convention is to use component props for behavior and intentional variants, CSS for most visual rules, and shared variables for tokens and dynamic values.

## The case for Tailwind is stronger than I used to admit

Tailwind has practical advantages that explain its appeal.

You don't spend time inventing class names for individual styling rules. Changing the utilities on one element doesn't require editing a shared CSS rule. Responsive styles and hover states are close to the element they belong to. The utility scale encourages consistency instead of random values everywhere.

It can also be fast to experiment with. Change a class, check the result, repeat. I understand why that workflow feels good, especially when you're building a new interface from scratch.

In a standard build integration, [Tailwind scans source files and generates static CSS](https://tailwindcss.com/docs/installation/using-vite). It does not need a runtime style generator in the browser. Tailwind 4 also supports [CSS-based configuration](https://tailwindcss.com/blog/tailwindcss-v4), including design tokens defined with `@theme`.

With utility classes, the property choices are visible immediately. With `styles.card`, I open the stylesheet to inspect them. I accept that extra step to keep the component's structure readable on its own.

## I associate Tailwind with AI slop

Tailwind has started to remind me of AI slop. Lucide icons have picked up a similar association for me. I see them and start wondering how much of the interface reflects a deliberate choice, and how much came with the generated starting point.

That reaction can be unfair. Neither a utility class nor an icon tells me whether someone thought carefully about the design. Tailwind can be part of a distinctive, carefully built interface. Moving the same generated page into CSS Modules wouldn't suddenly give it a point of view.

But there's a way of working with AI that bothers me: ask for an interface, accept what the agent produces, and carry on because it looks finished. The layout, components, and styling system get accepted as a package. A project ends up using Tailwind because the agent reached for it, without anyone deciding whether that is how they want to maintain the code.

I don't want "the agent picked it" to become my architectural reasoning. If I accept its choices without questioning them, I've let it decide how I'll work on the next change, too.

When an agent writes code for me, I still want to recognize the conventions I chose: existing tokens, meaningful component variants, and visual rules where I expect to find them. I have to read and maintain the result. I care whether I can explain why it is built that way.

## Why I keep choosing CSS Modules

Right now, for a React or Next.js project that I control, I'd usually start with CSS Modules, CSS custom properties, and a small set of consistent design tokens.

The appeal is that I can keep writing CSS. [CSS Modules scope class names locally](https://github.com/css-modules/css-modules), so I can call a class `button` without coordinating that name across the project. The rules live beside the component, and I can read either file without reading the other.

That separation doesn't do the design work for me. I still have to name things, decide what belongs in a shared component, and keep tokens consistent. I'd rather make those decisions in a stylesheet than keep moving individual properties into JSX.

For an Astro site, [scoped styles](https://docs.astro.build/en/guides/styling/) give me the separation I want within the component file. The physical file boundary matters less to me than being able to read the markup without reading the visual rules.

I can imagine considering [StyleX](https://stylexjs.com/docs/learn) for a large, complex platform where typed styles and themes could help keep the codebase consistent. I'm not sure where I'd draw that line yet. Its type support interests me, but I'd need to understand what it would improve in that particular project before choosing to write my styles as JavaScript objects.

And if I joined a team that was productive with Tailwind and had clear conventions, I wouldn't insist on rewriting everything to match my preference.

## I don't need Tailwind to be bad

Tailwind makes individual visual decisions easy to apply right where you use an element. I want to open a component and understand its structure and intent at a glance, then follow its class names into the visual details. That's the workflow I keep coming back to.

I owe CSS Modules the same scrutiny. They still make me name classes, switch files, and work out how styles interact. Those are tradeoffs I'm willing to make because I prefer reading the resulting components.

For my own projects, that's enough reason to choose them. If I use Tailwind, I want to be able to explain that choice, too.

<footer class="article-sources">

### Sources and further reading

- [Tailwind CSS - Styling with utility classes](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Tailwind CSS - Build integration](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind CSS - What's new in v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [CSS Modules - Project documentation](https://github.com/css-modules/css-modules)
- [Mantine - Styles overview](https://mantine.dev/styles/styles-overview/)
- [Mantine - CSS Modules](https://mantine.dev/styles/css-modules/)
- [StyleX - Introduction](https://stylexjs.com/docs/learn)
- [Astro - Styles and CSS](https://docs.astro.build/en/guides/styling/)

</footer>
