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
		code: `import { BorderPanel } from "typecomposer";

export class AppPage extends BorderPanel {
  constructor() {
    super({ 
      style: { 
        width: "100vw", 
        height: "100vh", 
        backgroundColor: "#ef4444",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "24px",
        fontWeight: "bold"
      }
    });
    
    this.innerText = "Hello from TypeComposer!";
  }
}`,
	},
};


export class PlaygroundView extends Component {
	private iframe: IFrameElement;
	private errorContainer: DivElement;
	private isCompiling = false;

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

			// Create HTML to inject into iframe
			const html = this.createIframeHTML(result.code);

			// Inject into iframe
			await this.injectCode(html);

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
		// Create HTML with the compiled code as a separate module script
		const html = '<!DOCTYPE html>\n' +
			'<html lang="en">\n' +
			'<head>\n' +
			'  <meta charset="UTF-8" />\n' +
			'  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
			'  <title>TypeComposer Preview</title>\n' +
			'  <script type="importmap">\n' +
			'  {\n' +
			'    "imports": {\n' +
			'      "typecomposer": "https://esm.sh/typecomposer@0.1.53"\n' +
			'    }\n' +
			'  }\n' +
			'  </script>\n' +
			'  <style>\n' +
			'    * {\n' +
			'      margin: 0;\n' +
			'      padding: 0;\n' +
			'      box-sizing: border-box;\n' +
			'    }\n' +
			'    body {\n' +
			'      font-family: system-ui, -apple-system, sans-serif;\n' +
			'    }\n' +
			'  </style>\n' +
			'</head>\n' +
			'<body>\n' +
			'  <script type="module">\n' +
			'    // Error handling\n' +
			'    window.addEventListener("error", (event) => {\n' +
			'      console.error("Runtime Error:", event.error);\n' +
			'      const errorDiv = document.createElement("div");\n' +
			'      errorDiv.style.cssText = "color: #dc2626; padding: 20px; font-family: monospace; white-space: pre-wrap; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; margin: 20px;";\n' +
			'      errorDiv.textContent = "Error: " + (event.error?.stack || event.message);\n' +
			'      if (document.body.children.length === 0) {\n' +
			'        document.body.appendChild(errorDiv);\n' +
			'      }\n' +
			'    });\n' +
			'    \n' +
			'    window.addEventListener("unhandledrejection", (event) => {\n' +
			'      console.error("Unhandled Promise Rejection:", event.reason);\n' +
			'    });\n' +
			'  </script>\n' +
			'  <script type="module">\n' +
			compiledCode + '\n' +
			'  </script>\n' +
			'</body>\n' +
			'</html>';
		return html;
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