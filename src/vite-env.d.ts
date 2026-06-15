/// <reference types="vite/client" />

// MDX file types
declare module "*.md" {
  const mdx: string;
  const markdown: string;
  const filename: string;
  export { mdx, markdown, filename };
  export default mdx;
}

// WASM ?url import — used by browserCompiler.ts to load esbuild.wasm
// as a content-hashed asset URL served from /assets/
declare module "*.wasm?url" {
  const url: string;
  export default url;
}