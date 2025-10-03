import * as esbuild from 'esbuild-wasm';

let esbuildInitialized = false;

/**
 * Initialize esbuild-wasm. Must be called before using the compiler.
 */
export async function initializeEsbuild(): Promise<void> {
  if (esbuildInitialized) return;
  
  // Use the bundled WASM from node_modules
  await esbuild.initialize({
    wasmURL: '/node_modules/esbuild-wasm/esbuild.wasm',
  });
  
  esbuildInitialized = true;
}

/**
 * Compile TypeScript/JavaScript files to a single bundle
 * @param files - Object containing file paths and their code
 * @param entryPoint - The main entry file (defaults to '/src/main.ts' or first .ts file)
 * @returns Compiled JavaScript code or error
 */
export async function compileFiles(
  files: Record<string, { code: string }>,
  entryPoint?: string
): Promise<{ success: true; code: string } | { success: false; error: string }> {
  try {
    // Ensure esbuild is initialized
    if (!esbuildInitialized) {
      await initializeEsbuild();
    }

    // Find entry point
    const entry = entryPoint || findEntryPoint(files);
    if (!entry) {
      return {
        success: false,
        error: 'No entry point found. Please provide a /src/main.ts or /src/main.js file.',
      };
    }

    // Create a plugin to resolve virtual files
    const virtualFilePlugin: esbuild.Plugin = {
      name: 'virtual-files',
      setup(build) {
        // Intercept all file imports
        build.onResolve({ filter: /.*/ }, (args) => {
          // Handle relative imports
          if (args.path.startsWith('.')) {
            const basePath = args.importer.replace(/\/[^/]*$/, '');
            let resolvedPath = resolvePath(basePath, args.path);
            
            // Try with various extensions
            const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
            for (const ext of extensions) {
              const testPath = resolvedPath + ext;
              if (files[testPath]) {
                return { path: testPath, namespace: 'virtual' };
              }
            }
            
            // Check if it's a directory with index file
            const indexExtensions = ['/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
            for (const ext of indexExtensions) {
              const testPath = resolvedPath + ext;
              if (files[testPath]) {
                return { path: testPath, namespace: 'virtual' };
              }
            }
          }
          
          // Handle absolute imports
          if (args.path.startsWith('/')) {
            const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
            for (const ext of extensions) {
              const testPath = args.path + ext;
              if (files[testPath]) {
                return { path: testPath, namespace: 'virtual' };
              }
            }
          }
          
          // Handle path aliases like @/
          if (args.path.startsWith('@/')) {
            const resolvedPath = args.path.replace('@/', '/src/');
            const extensions = ['', '.ts', '.tsx', '.js', '.jsx'];
            for (const ext of extensions) {
              const testPath = resolvedPath + ext;
              if (files[testPath]) {
                return { path: testPath, namespace: 'virtual' };
              }
            }
          }
          
          // External modules (like typecomposer) - mark as external
          if (!args.path.startsWith('.') && !args.path.startsWith('/') && !args.path.startsWith('@/')) {
            return { path: args.path, external: true };
          }

          return { path: args.path, namespace: 'virtual' };
        });

        // Load virtual files
        build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => {
          const file = files[args.path];
          if (file) {
            // Determine loader based on file extension
            const loader = getLoader(args.path);
            return {
              contents: file.code,
              loader,
            };
          }
          return {
            contents: '',
            loader: 'js',
          };
        });
      },
    };

    // Build with esbuild
    const result = await esbuild.build({
      stdin: {
        contents: files[entry].code,
        resolveDir: '/',
        sourcefile: entry,
        loader: getLoader(entry),
      },
      bundle: true,
      write: false,
      format: 'esm',
      target: 'es2020',
      minify: false,
      keepNames: true,
      sourcemap: 'inline',
      plugins: [virtualFilePlugin],
      external: ['typecomposer', 'typescript', 'vite', '@codesandbox/sandpack-client'],
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          useDefineForClassFields: true,
          target: 'ES2020',
          module: 'ESNext',
        },
      }
    });

    if (result.outputFiles && result.outputFiles.length > 0) {
      const code = new TextDecoder().decode(result.outputFiles[0].contents);
      
      // Debug log in development
      if (import.meta.env?.DEV) {
        console.log('[Compiler] Successfully compiled:', entry);
        console.log('[Compiler] Output length:', code.length, 'bytes');
      }
      
      return { success: true, code };
    }

    return {
      success: false,
      error: 'Compilation produced no output',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Find the entry point from files
 */
function findEntryPoint(files: Record<string, { code: string }>): string | null {
  // Priority order for entry points
  const candidates = [
    '/src/main.ts',
    '/src/main.tsx',
    '/src/main.js',
    '/src/main.jsx',
    '/src/index.ts',
    '/src/index.tsx',
    '/src/index.js',
    '/src/index.jsx',
  ];

  for (const candidate of candidates) {
    if (files[candidate]) {
      return candidate;
    }
  }

  // Fallback: find any .ts or .js file in /src
  const srcFiles = Object.keys(files).filter(
    (path) => path.startsWith('/src/') && /\.(ts|tsx|js|jsx)$/.test(path)
  );
  
  return srcFiles.length > 0 ? srcFiles[0] : null;
}

/**
 * Get esbuild loader based on file extension
 */
function getLoader(path: string): esbuild.Loader {
  if (path.endsWith('.ts')) return 'ts';
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.jsx')) return 'jsx';
  if (path.endsWith('.json')) return 'json';
  return 'js';
}

/**
 * Resolve relative path
 */
function resolvePath(basePath: string, relativePath: string): string {
  const parts = basePath.split('/').filter(Boolean);
  const relParts = relativePath.split('/').filter(Boolean);

  for (const part of relParts) {
    if (part === '..') {
      parts.pop();
    } else if (part !== '.') {
      parts.push(part);
    }
  }

  return '/' + parts.join('/');
}
