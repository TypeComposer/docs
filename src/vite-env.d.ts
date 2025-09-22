/// <reference types="vite/client" />

// MDX file types
declare module "*.md" {
  const mdx: string;
  const markdown: string;
  const filename: string;
  export { mdx, markdown, filename };
  export default mdx;
}