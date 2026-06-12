import { Component, IFrameElement, DivElement, HBox, VBox } from "typecomposer";
import { compileFiles, initializeEsbuild } from "@/utils/browserCompiler";
import { MonacoEditor } from "@/components/editor/MonacoEditor";

/**
 * TypeComposer CDN version loaded by the playground iframe.
 * Keep in sync with the `typecomposer` version in package.json.
 */
const TYPECOMPOSER_VERSION = "0.1.56";

const files = {
	"/tsconfig.json": {
		code: `
		{
		  "compilerOptions": {
			"target": "ESNext",
			"useDefineForClassFields": true,
			"module": "ESNext",
			"lib": ["ES2021", "DOM", "DOM.Iterable"],
			"skipLibCheck": true,
			"moduleResolution": "node",
			"allowImportingTsExtensions": true,
			"resolveJsonModule": true,
			"isolatedModules": true,
			"noEmit": true,
			"allowSyntheticDefaultImports": true,
			"strict": true,
			"noUnusedLocals": true,
			"noUnusedParameters": true,
			"noFallthroughCasesInSwitch": true,
			"experimentalDecorators": true,
			"emitDecoratorMetadata": true,
			"baseUrl": ".",
			"paths": {
			  "@/*": ["src/*"]
			},
			"types": ["vite/client", "typecomposer-plugin/client", "typecomposer/typings"]
		  },
		  "include": ["src"]
		}
	  `,
	},
	"/vite.config.js": {
		code: `
		import { defineConfig } from "vite";
		import typeComposerPlugin from "typecomposer-plugin";
		import path from "path";
  
		export default defineConfig({
		  plugins: [typeComposerPlugin()],
		  resolve: {
			alias: {
			  "@": path.resolve(__dirname, "./src"),
			},
		  },
		  css: {
			preprocessorOptions: {
			  scss: {
				api: "modern-compiler",
			  },
			},
		  },
		});
	  `,
	},
	"/package.json": {
		code: `
		{
		  "name": "typecomposer-playground",
		  "private": true,
		  "version": "0.0.0",
		  "type": "module",
		  "scripts": {
		    "dev": "vite",
			"start": "vite",
			"build": "vite build",
			"preview": "vite"
		  },
		  "dependencies": {
			"typecomposer": "^${TYPECOMPOSER_VERSION}"
		  },
		  "devDependencies": {
			"@types/node": "^22.0.0",
			"typescript": "^5.6.0",
			"vite": "^6.0.0",
			"typecomposer-plugin": "^1.0.0"
		  }
		}
	  `,
	},
	"/index.html": {
		code: `<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/typecomposer.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TypeCompose</title>
  </head>
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
	},
	"/src/main.ts": {
		code: `import { App, ButtonElement, Component, H1Element, ref, VBox } from "typecomposer";

class AppPage extends Component {
  count = ref(0);

  constructor() {
    super({
      style: {
        width: "100dvw",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#242424",
      },
    });

    const vbox = this.appendChild(
      new VBox({ style: { alignItems: "center", gap: "1rem" } })
    );

    vbox.append(
      new H1Element({ text: "TypeComposer", style: { color: "#fcfffa" } })
    );

    vbox.append(
      new ButtonElement({
        text: this.count,
        onclick: () => this.count.value++,
      })
    );
  }
}

// In a real project the typecomposer-plugin registers components for you.
// The playground compiles without it, so register the element explicitly.
customElements.define("app-page", AppPage);

App.setPage(new AppPage());
`,
	},
};


export class PlaygroundView extends Component {
	private iframe: IFrameElement;
	private errorContainer: DivElement;
	private editor: MonacoEditor;
	private currentFileName: string = "/src/main.ts";
	private files: Record<string, { code: string }>;
	private isCompiling = false;
	private compileTimeout: number | null = null;
	/** Blob URLs pending revocation — cleared at the start of each compile run. */
	private pendingBlobUrls: string[] = [];

	constructor() {
		super({ className: "flex flex-col overflow-hidden w-full h-full" });
		
		this.files = files;
		
		// Create error container
		this.errorContainer = this.appendChild(new DivElement({
			className: "hidden bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative",
		})) as DivElement;
		this.errorContainer.style.maxHeight = "200px";
		this.errorContainer.style.overflow = "auto";

		// Create main container with split view
		const mainContainer = this.appendChild(new HBox({ 
			className: "flex-1 overflow-hidden"
		})) as HBox;
		
		// Left panel - Editor
		const editorPanel = mainContainer.appendChild(new VBox({
			className: "flex-1 flex flex-col border-r border-gray-300 overflow-hidden"
		})) as VBox;
		
		// Monaco Editor
		this.editor = editorPanel.appendChild(new MonacoEditor({
			value: this.files[this.currentFileName].code,
			language: "typescript",
			onChange: (value) => this.onEditorChange(value),
			className: "flex-1"
		})) as MonacoEditor;
		
		// Right panel - Preview
		const previewPanel = mainContainer.appendChild(new VBox({
			className: "flex-1 flex flex-col overflow-hidden"
		})) as VBox;
		
		// Create iframe for preview.
		// sandbox="allow-scripts": user code runs in a sandboxed context without
		// access to window.parent, cookies, or the docs page DOM.
		// allow-same-origin is intentionally omitted so user code cannot reach the
		// docs site's storage/cookies or un-sandbox itself. The trade-off: the
		// document gets an opaque origin, so (a) real localStorage throws a
		// SecurityError — handled by the in-memory shim injected into the iframe
		// HTML (see createIframeHTML) — and (b) a blob: URL created in the parent
		// origin is not importable here, which is why the user-code blob is built
		// inside the iframe rather than passed in from the parent.
		this.iframe = previewPanel.appendChild(new IFrameElement({ 
			className: "flex-1",
		})) as IFrameElement;
		this.iframe.setAttribute("sandbox", "allow-scripts");
		this.iframe.style.border = "none";
	}

	/** Lifecycle: called when element is connected to the DOM. */
	disconnectedCallback() {
		// Clean up any pending blob URLs and timers
		this.revokePendingBlobUrls();
		if (this.compileTimeout !== null) {
			clearTimeout(this.compileTimeout);
			this.compileTimeout = null;
		}
	}

	async onInit() {
		// Initialize esbuild
		await initializeEsbuild();
		
		// Compile and run the code
		await this.compileAndRun(files);
	}

	/**
	 * Compile files and inject into iframe.
	 * Revokes leftover blob URLs from the previous run before starting.
	 */
	async compileAndRun(files: Record<string, { code: string }>) {
		if (this.isCompiling) return;
		
		this.isCompiling = true;
		this.hideError();

		// Revoke blob URLs from the previous compile run
		this.revokePendingBlobUrls();

		try {
			const result = await compileFiles(files);

			if (!result.success) {
				this.showError(`Compilation Error:\n${result.error}`);
				this.isCompiling = false;
				return;
			}

			const html = this.createIframeHTML(result.code);
			await this.injectCode(html);

		} catch (error) {
			this.showError(`Error: ${error instanceof Error ? error.message : String(error)}`);
		} finally {
			this.isCompiling = false;
		}
	}

	/**
	 * UTF-8-safe base64 encode. btoa() alone throws on multi-byte characters
	 * (e.g. emoji in the default AppPage), so encode to UTF-8 bytes first.
	 */
	private encodeUtf8Base64(str: string): string {
		const bytes = new TextEncoder().encode(str);
		let binary = "";
		for (let i = 0; i < bytes.length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	}

	/**
	 * Create HTML document for iframe.
	 * The compiled user code is embedded as base64 and turned into a blob: URL
	 * *inside* the iframe (see the module script below), then run via dynamic
	 * import(). The blob must be created in the iframe: the document runs under an
	 * opaque origin (sandbox without allow-same-origin), and a blob: URL created
	 * here in the parent origin is not fetchable from that opaque-origin context
	 * (import fails with "Failed to fetch dynamically imported module").
	 * The import map resolves `typecomposer` to the jsDelivr CDN (+esm single bundle).
	 * esm.sh is broken for this package (HTTP 500 on its generated core.mjs due to
	 * a circular re-export); jsDelivr bundles it correctly with Rollup.
	 *
	 * An in-memory localStorage shim is injected before the import map so that
	 * TypeComposer's runtime can probe storage without throwing a SecurityError in
	 * the sandboxed iframe (sandbox="allow-scripts" without allow-same-origin blocks
	 * real localStorage; the shim keeps state within the iframe lifetime only).
	 */
	private createIframeHTML(compiledCode: string): string {
		// jsdelivr +esm bundles the package into a single ES module without the
		// split-entry pattern that esm.sh uses — esm.sh@0.1.56 fails with HTTP 500
		// on its generated core.mjs due to a circular re-export in the package.
		const typecomposerUrl = `https://cdn.jsdelivr.net/npm/typecomposer@${TYPECOMPOSER_VERSION}/+esm`;

		// Embed the compiled user code as base64. The iframe decodes it and
		// creates its own blob: URL (see the module script below). base64's
		// alphabet has no "<", so it is safe to inline inside a <script>.
		const compiledCodeBase64 = this.encodeUtf8Base64(compiledCode);

		const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TypeComposer Preview</title>
  <script>
    // In-memory localStorage shim — required because the iframe runs under
    // sandbox="allow-scripts" without allow-same-origin, which causes the
    // browser to throw a SecurityError on any localStorage access.
    // This shim provides a Map-backed storage that behaves like the real API
    // for the lifetime of the iframe document (not persisted across reloads).
    (function () {
      try {
        // Quick probe: if this succeeds, real localStorage is available.
        void window.localStorage;
      } catch (_e) {
        // Real localStorage is inaccessible — install the in-memory shim.
        var _store = Object.create(null);
        var _length = 0;
        var _shimStorage = {
          get length() { return _length; },
          key: function (index) {
            return Object.keys(_store)[index] !== undefined ? Object.keys(_store)[index] : null;
          },
          getItem: function (key) {
            return Object.prototype.hasOwnProperty.call(_store, key) ? _store[key] : null;
          },
          setItem: function (key, value) {
            if (!Object.prototype.hasOwnProperty.call(_store, key)) _length++;
            _store[key] = String(value);
          },
          removeItem: function (key) {
            if (Object.prototype.hasOwnProperty.call(_store, key)) {
              delete _store[key];
              _length--;
            }
          },
          clear: function () { _store = Object.create(null); _length = 0; }
        };
        try {
          Object.defineProperty(window, 'localStorage', {
            value: _shimStorage,
            writable: false,
            configurable: true
          });
          Object.defineProperty(window, 'sessionStorage', {
            value: _shimStorage,
            writable: false,
            configurable: true
          });
        } catch (_defineErr) {
          // Last resort: assign directly (older browsers / CSP edge cases)
          window.localStorage = _shimStorage;
          window.sessionStorage = _shimStorage;
        }
      }
    })();
  </script>
  <script type="importmap">
  {
    "imports": {
      "typecomposer": "${typecomposerUrl}"
    }
  }
  </script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      overflow: auto;
    }
    #app {
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <script>
    // Global error handling
    window.addEventListener("error", (event) => {
      console.error("Runtime Error:", event.error);
      event.preventDefault();
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText = "color: #dc2626; padding: 20px; font-family: monospace; white-space: pre-wrap; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; margin: 20px;";
      errorDiv.innerHTML = "<strong>Runtime Error:</strong><br><pre>" + (event.error?.stack || event.message) + "</pre>";
      const appDiv = document.getElementById("app");
      if (appDiv) {
        appDiv.innerHTML = "";
        appDiv.appendChild(errorDiv);
      } else {
        document.body.appendChild(errorDiv);
      }
    });
    
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled Promise Rejection:", event.reason);
      event.preventDefault();
      const errorDiv = document.createElement("div");
      errorDiv.style.cssText = "color: #dc2626; padding: 20px; font-family: monospace; white-space: pre-wrap; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; margin: 20px;";
      errorDiv.innerHTML = "<strong>Unhandled Promise:</strong><br><pre>" + (event.reason?.stack || event.reason) + "</pre>";
      const appDiv = document.getElementById("app");
      if (appDiv) {
        appDiv.appendChild(errorDiv);
      } else {
        document.body.appendChild(errorDiv);
      }
    });
  </script>
  
  <script type="module">
    try {
      // Import TypeComposer library — resolved via import map above
      const typecomposer = await import('typecomposer');
      
      // Make TypeComposer available globally
      window.TypeComposer = typecomposer.TypeComposer || globalThis.TypeComposer;
      
      // Small delay to ensure all components are fully registered
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Decode the embedded user code and create a blob: URL *inside* this
      // iframe so the dynamic import resolves under this document's own
      // (opaque) origin. The import map above still applies to its imports.
      const _bin = atob("${compiledCodeBase64}");
      const _bytes = new Uint8Array(_bin.length);
      for (let _i = 0; _i < _bin.length; _i++) _bytes[_i] = _bin.charCodeAt(_i);
      const _codeUrl = URL.createObjectURL(new Blob([_bytes], { type: 'text/javascript' }));
      await import(_codeUrl);
      URL.revokeObjectURL(_codeUrl);
      
    } catch (error) {
      console.error('[Playground] Initialization failed:', error);
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'color: #dc2626; padding: 20px; font-family: monospace; white-space: pre-wrap; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; margin: 20px;';
      errorDiv.innerHTML = '<strong>Initialization Error:</strong><br><pre>' + (error.stack || error.message || error) + '</pre>';
      document.body.appendChild(errorDiv);
      throw error;
    }
  </script>
</body>
</html>`;
		return html;
	}

	/**
	 * Inject HTML into iframe via a blob URL.
	 * The HTML blob URL is revoked immediately after the iframe loads.
	 */
	private async injectCode(html: string): Promise<void> {
		return new Promise((resolve) => {
			const blob = new Blob([html], { type: 'text/html' });
			const url = URL.createObjectURL(blob);
			
			this.iframe.src = url;
			
			this.iframe.onload = () => {
				URL.revokeObjectURL(url);
				setTimeout(() => resolve(), 100);
			};
			
			// Fallback in case onload doesn't fire
			setTimeout(() => resolve(), 500);
		});
	}

	/** Revoke all tracked blob URLs from previous compile runs. */
	private revokePendingBlobUrls(): void {
		for (const url of this.pendingBlobUrls) {
			URL.revokeObjectURL(url);
		}
		this.pendingBlobUrls = [];
	}

	private showError(message: string): void {
		this.errorContainer.innerText = message;
		this.errorContainer.className = "bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-2";
		this.errorContainer.style.maxHeight = "200px";
		this.errorContainer.style.overflow = "auto";
	}

	private hideError(): void {
		this.errorContainer.className = "hidden";
		this.errorContainer.innerText = "";
	}

	private onEditorChange(value: string): void {
		this.files[this.currentFileName].code = value;
		
		if (this.compileTimeout !== null) {
			clearTimeout(this.compileTimeout);
		}
		
		this.compileTimeout = setTimeout(() => {
			this.compileAndRun(this.files);
		}, 1000) as unknown as number;
	}

	public async updateFiles(newFiles: Record<string, { code: string }>): Promise<void> {
		this.files = newFiles;
		this.editor.setValue(this.files[this.currentFileName].code);
		await this.compileAndRun(newFiles);
	}
}