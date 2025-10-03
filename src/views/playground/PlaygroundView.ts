import { Component, IFrameElement, DivElement } from "typecomposer";
import { compileFiles, initializeEsbuild } from "@/utils/browserCompiler";

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
		  "name": "typecomposer-doc",
		  "private": true,
		  "version": "0.0.0",
		  "type": "module",
		  "main": "/index.html",
		  "scripts": {
		   	"dev": "vite",
			"start": "vite",
			"build": "vite build",
			"preview": "vite"
		  },
		  "dependencies": {
			"@codesandbox/sandpack-client": "^2.19.8",
			"markdown-it": "^14.1.0",
			"markdown-it-highlightjs": "^4.2.0",
			"typecomposer": "^0.0.98"
		  },
		  "devDependencies": {
			"@types/markdown-it": "^14.1.2",
			"@types/node": "^22.5.5",
			"autoprefixer": "^10.4.20",
			"csstype": "^3.1.3",
			"sass": "^1.79.4",
			"tailwindcss": "^3.4.17",
			"typecomposer-plugin": "^0.0.35",
			"typescript": "^5.6.2",
			"vite": "^5.4.8"
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
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
	},
	"/src/main.ts": {
		code: `import { AppPage } from "./AppPage";

const app = new AppPage();
document.body.appendChild(app);`,
	},
	"/src/AppPage.ts": {
		code: `import { VBox, DivElement, ButtonElement } from "typecomposer";

export class AppPage extends VBox {
  private clickCount = 0;
  private button: ButtonElement;
  
  constructor() {
    super({
      style: {
        padding: "40px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
      }
    });
    
    // Add title using TypeComposer DivElement
    const title = new DivElement({
      innerText: "🎨 TypeComposer Playground",
      style: {
        color: "white",
        fontSize: "48px",
        fontWeight: "bold",
        margin: "0"
      }
    });
    
    // Add subtitle
    const subtitle = new DivElement({
      innerText: "Browser-based compilation + TypeComposer Components! ✓",
      style: {
        color: "#e0e7ff",
        fontSize: "18px",
        fontWeight: "normal"
      }
    });
    
    // Add interactive button using TypeComposer ButtonElement
    this.button = new ButtonElement({
      innerText: "Click me!",
      style: {
        padding: "12px 24px",
        fontSize: "16px",
        background: "white",
        color: "#667eea",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "transform 0.2s"
      }
    });
    
    this.button.onclick = () => {
      this.clickCount++;
      this.button.innerText = \`Clicked \${this.clickCount} time\${this.clickCount === 1 ? '' : 's'}!\`;
      this.button.style.transform = "scale(1.1)";
      setTimeout(() => {
        this.button.style.transform = "scale(1)";
      }, 150);
    };
    
    // Append all elements
    this.appendChild(title);
    this.appendChild(subtitle);
    this.appendChild(this.button);
  }
}`,
	},
};


export class PlaygroundView extends Component {
	private iframe: IFrameElement;
	private errorContainer: DivElement;
	private isCompiling = false;
	private typeComposerVersion: string = "0.1.53"; // Make this configurable

	constructor() {
		super({ className: "flex flex-col gap-2 overflow-hidden w-full h-full" });
		
		// Create error container
		this.errorContainer = this.appendChild(new DivElement({
			className: "hidden bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative",
			style: { maxHeight: "200px", overflow: "auto" }
		})) as DivElement;

		// Create iframe for preview
		this.iframe = this.appendChild(new IFrameElement({ 
			className: "w-full h-full",
			style: { border: "none" }
		})) as IFrameElement;
	}

	async onInit() {
		// Initialize esbuild
		await initializeEsbuild();
		
		// Compile and run the code
		await this.compileAndRun(files);
	}

	/**
	 * Compile files and inject into iframe
	 */
	async compileAndRun(files: Record<string, { code: string }>) {
		if (this.isCompiling) return;
		
		this.isCompiling = true;
		this.hideError();

		try {
			// Compile the files
			const result = await compileFiles(files);

			if (!result.success) {
				this.showError(`Compilation Error:\n${result.error}`);
				this.isCompiling = false;
				return;
			}

			// Debug: Log the compiled code
			console.log("[PlaygroundView] Compilation successful!");
			console.log("[PlaygroundView] Compiled code length:", result.code.length);
			console.log("[PlaygroundView] First 500 chars:", result.code.substring(0, 500));

			// Create HTML to inject into iframe
			const html = this.createIframeHTML(result.code);
			console.log("[PlaygroundView] Generated HTML length:", html.length);

			// Inject into iframe
			await this.injectCode(html);
			console.log("[PlaygroundView] Code injected into iframe");

		} catch (error) {
			this.showError(`Error: ${error instanceof Error ? error.message : String(error)}`);
		} finally {
			this.isCompiling = false;
		}
	}

	/**
	 * Create HTML document for iframe
	 */
	private createIframeHTML(compiledCode: string): string {
		// Use esm.sh CDN which properly supports ES modules with CORS
		// Format: https://esm.sh/package@version
		const typecomposerUrl = `https://esm.sh/typecomposer@${this.typeComposerVersion}`;
		
		const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TypeComposer Preview</title>
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
  <div id="app"></div>
  
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
    console.log('[Playground] Starting TypeComposer component registration...');
    
    try {
      // Import TypeComposer library
      const typecomposer = await import('typecomposer');
      console.log('[Playground] TypeComposer loaded:', Object.keys(typecomposer));
      
      // Make TypeComposer available globally (needed for registration)
      window.TypeComposer = typecomposer.TypeComposer || globalThis.TypeComposer;
      
      // Helper function to convert class name to kebab-case tag
      function toKebabCase(str) {
        return str
          .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
          .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
          .toLowerCase();
      }
      
      // Register all TypeComposer components
      const componentsToRegister = [];
      
      for (const [name, exported] of Object.entries(typecomposer)) {
        // Check if it's a class that extends HTMLElement
        if (typeof exported === 'function' && 
            exported.prototype instanceof HTMLElement) {
          
          // Generate tag name from class name
          let tagName = toKebabCase(name);
          
          // Ensure tag has a hyphen (required for custom elements)
          if (!tagName.includes('-')) {
            tagName = tagName + '-element';
          }
          
          // Check if already registered
          if (!customElements.get(tagName)) {
            try {
              customElements.define(tagName, exported);
              componentsToRegister.push({ name, tagName, class: exported });
              console.log(\`[Playground] Registered: \${name} as <\${tagName}>\`);
            } catch (error) {
              console.warn(\`[Playground] Failed to register \${name}:\`, error.message);
            }
          } else {
            console.log(\`[Playground] Already registered: \${name} as <\${tagName}>\`);
          }
        }
      }
      
      console.log(\`[Playground] Successfully registered \${componentsToRegister.length} components\`);
      console.log('[Playground] Registered components:', componentsToRegister.map(c => c.name).join(', '));
      
      // Small delay to ensure all components are fully registered
      await new Promise(resolve => setTimeout(resolve, 50));
      
      console.log('[Playground] Ready to execute user code');
      
      // Now load and execute the user code
      const codeUrl = '${this.createCodeBlobUrl(compiledCode)}';
      console.log('[Playground] Loading user code from blob URL');
      
      await import(codeUrl);
      console.log('[Playground] User code executed successfully ✓');
      
    } catch (error) {
      console.error('[Playground] Initialization failed:', error);
      console.error('[Playground] Error stack:', error.stack);
      
      // Show error in the UI
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
	 * Create a blob URL for the compiled code
	 */
	private createCodeBlobUrl(compiledCode: string): string {
		// Replace bare imports with full CDN URLs since import maps don't work in blob URLs
		// This allows the compiled code to resolve TypeComposer imports
		const typecomposerUrl = `https://esm.sh/typecomposer@${this.typeComposerVersion}`;
		
		console.log('[PlaygroundView] Original code:', compiledCode.substring(0, 800));
		
		const processedCode = compiledCode.replace(
			/from\s+["']typecomposer["']/g,
			`from "${typecomposerUrl}"`
		);
		
		console.log('[PlaygroundView] Processed code:', processedCode.substring(0, 800));
		console.log('[PlaygroundView] Replacement count:', (compiledCode.match(/from\s+["']typecomposer["']/g) || []).length);
		
		const codeBlob = new Blob([processedCode], { type: 'text/javascript' });
		const codeUrl = URL.createObjectURL(codeBlob);
		
		// Store URL to revoke later
		setTimeout(() => URL.revokeObjectURL(codeUrl), 5000);
		
		return codeUrl;
	}

	/**
	 * Inject HTML into iframe
	 */
	private async injectCode(html: string): Promise<void> {
		return new Promise((resolve) => {
			// Create a data URL for the HTML to avoid srcdoc issues
			const blob = new Blob([html], { type: 'text/html' });
			const url = URL.createObjectURL(blob);
			
			// Set the iframe src to the blob URL
			this.iframe.src = url;
			
			// Clean up the URL after loading
			this.iframe.onload = () => {
				URL.revokeObjectURL(url);
				setTimeout(() => resolve(), 100);
			};
			
			// Fallback in case onload doesn't fire
			setTimeout(() => resolve(), 500);
		});
	}

	/**
	 * Show compilation/runtime error
	 */
	private showError(message: string): void {
		this.errorContainer.innerText = message;
		this.errorContainer.className = "bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-2";
		this.errorContainer.style.maxHeight = "200px";
		this.errorContainer.style.overflow = "auto";
	}

	/**
	 * Hide error message
	 */
	private hideError(): void {
		this.errorContainer.className = "hidden";
		this.errorContainer.innerText = "";
	}

	/**
	 * Public method to update files and recompile
	 */
	public async updateFiles(newFiles: Record<string, { code: string }>): Promise<void> {
		await this.compileAndRun(newFiles);
	}
} 