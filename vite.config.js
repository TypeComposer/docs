import { defineConfig } from "vite";
import typeComposerPlugin from "typecomposer-plugin";
import path from "path";
import fs from "fs";

// Simple MDX plugin for Vite
function mdxPlugin() {
  return {
    name: 'vite-plugin-mdx',
    load(id) {
      if (id.endsWith('.md') || id.endsWith('.mdx')) {
        const content = fs.readFileSync(id, 'utf-8');
        // Export both the raw markdown content and as MDX
        return `
export const mdx = ${JSON.stringify(content)};
export const markdown = ${JSON.stringify(content)};
export const filename = ${JSON.stringify(path.basename(id))};
export default mdx;
        `;
      }
    }
  };
}

export default defineConfig({
  plugins: [
    typeComposerPlugin(),
    mdxPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
