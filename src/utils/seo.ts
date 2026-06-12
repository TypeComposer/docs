/**
 * SEO utilities — update <title> and <meta name="description"> on each route
 * transition. Since this is a hash-router SPA with no SSR, these updates help
 * browser history titles, social preview when JS runs, and AI crawlers that
 * execute JS (e.g. Googlebot, GPTBot after rendering).
 *
 * Canonical stays fixed at https://typecomposer.com/ in index.html because
 * hash fragments are not real URLs; there is no per-page canonical benefit.
 */

interface PageMeta {
  title: string;
  description: string;
}

const BASE_TITLE = "TypeComposer";
const BASE_DESC =
  "A zero-HTML TypeScript framework for building web and native user interfaces. Compose UIs from pure TypeScript classes — no JSX, no templates.";

/** Per-route meta map keyed by Router.pathname value (e.g. "docs/getting-started") */
const PAGE_META: Record<string, PageMeta> = {
  "docs/home": {
    title: "Why TypeComposer?",
    description:
      "Learn why TypeComposer takes a zero-HTML approach to building UIs — pure TypeScript classes, no JSX, no templates, full type safety.",
  },
  "docs/getting-started": {
    title: "Getting Started",
    description:
      "Install TypeComposer and scaffold your first project in minutes. Step-by-step guide with npm, Vite, and the typecomposer-plugin.",
  },
  "docs/skills": {
    title: "Agent Skills",
    description:
      "Use TypeComposer to build AI agent skills. Integration guide and examples for connecting your TypeComposer app as a skill endpoint.",
  },
  "docs/components/component": {
    title: "Component",
    description: "Deep-dive into the TypeComposer Component class — the base building block for every UI element.",
  },
  "docs/components/template": {
    title: "Template",
    description: "TypeComposer template system: define reusable, composable UI structures entirely in TypeScript.",
  },
  "docs/components/lifecycle-docs": {
    title: "Component Lifecycle",
    description: "Understand the TypeComposer component lifecycle: onConnected, onDisconnected, and reactive update hooks.",
  },
  "docs/dependency-injection": {
    title: "Dependency Injection",
    description: "Built-in DI container in TypeComposer — inject services and share state across components without global singletons.",
  },
  "docs/reactivity/ref": {
    title: "ref – Reactivity",
    description: "ref is TypeComposer's core reactive primitive. Learn how to create reactive values that automatically update the DOM.",
  },
  "docs/reactivity/refboolean": {
    title: "refBoolean – Reactivity",
    description: "Reactive boolean values in TypeComposer — toggle visibility, classes, and attributes with automatic DOM updates.",
  },
  "docs/reactivity/refnumber": {
    title: "refNumber – Reactivity",
    description: "Reactive numeric values in TypeComposer — bind counters, scores, and numeric state to your UI automatically.",
  },
  "docs/reactivity/refstring": {
    title: "refString – Reactivity",
    description: "Reactive string values in TypeComposer — keep text content in sync with application state effortlessly.",
  },
  "docs/reactivity/reflist": {
    title: "refList – Reactivity",
    description: "Reactive list (array) in TypeComposer — render and update lists automatically as items are added or removed.",
  },
  "docs/reactivity/refmap": {
    title: "refMap – Reactivity",
    description: "Reactive Map in TypeComposer — bind key-value collections to the DOM with automatic change propagation.",
  },
  "docs/reactivity/refset": {
    title: "refSet – Reactivity",
    description: "Reactive Set in TypeComposer — manage unique collections with automatic UI synchronization.",
  },
  "docs/reactivity/computed": {
    title: "computed – Reactivity",
    description: "Derived reactive values in TypeComposer — computed automatically updates whenever its reactive dependencies change.",
  },
  "docs/router": {
    title: "Router",
    description: "TypeComposer's built-in hash router — define typed routes, nested routes, wildcards, and redirects in pure TypeScript.",
  },
  "docs/router-view": {
    title: "RouterView",
    description: "RouterView is the outlet component that renders the active child route inside your layout.",
  },
  "docs/layout/border-panel": {
    title: "BorderPanel – Layout",
    description: "BorderPanel provides a classic top/bottom/left/right/center layout region system for building app shells.",
  },
  "docs/layout/vbox": {
    title: "VBox – Layout",
    description: "VBox stacks children vertically using flexbox. The primary vertical layout container in TypeComposer.",
  },
  "docs/layout/hbox": {
    title: "HBox – Layout",
    description: "HBox arranges children horizontally using flexbox. The primary horizontal layout container in TypeComposer.",
  },
  "docs/elements/div": {
    title: "DivElement",
    description: "DivElement is the TypeComposer wrapper for a div, with reactive props and full component lifecycle support.",
  },
  "docs/elements/button": {
    title: "ButtonElement",
    description: "ButtonElement — accessible, reactive button component in TypeComposer with onClick and state binding.",
  },
  "docs/elements/input": {
    title: "InputElement",
    description: "InputElement — reactive text input in TypeComposer with two-way binding and full type safety.",
  },
  "docs/elements/label": {
    title: "LabelElement",
    description: "LabelElement — accessible form label component in TypeComposer, linkable to inputs via htmlFor.",
  },
  "docs/elements/table": {
    title: "TableElement",
    description: "TableElement — reactive HTML table in TypeComposer, composable with thead, tbody, tr, td, and th.",
  },
  "docs/elements/span": {
    title: "SpanElement",
    description: "SpanElement — inline text container in TypeComposer with reactive innerText and className binding.",
  },
  "docs/elements/heading": {
    title: "HeadingElement",
    description: "HeadingElement — H1–H6 heading components in TypeComposer with semantic HTML and reactive content.",
  },
};

/**
 * Update <title> and <meta name="description"> for the given router pathname.
 * Call this from BaseView constructor or onConnected whenever the route changes.
 */
export function updatePageMeta(pathname: string): void {
  const meta = PAGE_META[pathname];
  if (meta) {
    document.title = `${meta.title} | ${BASE_TITLE}`;
    setMetaDescription(meta.description);
  } else {
    document.title = BASE_TITLE;
    setMetaDescription(BASE_DESC);
  }
}

function setMetaDescription(content: string): void {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "description";
    document.head.appendChild(tag);
  }
  tag.content = content;
}