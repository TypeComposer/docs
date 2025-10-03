import { Component } from "typecomposer";
import loader from "@monaco-editor/loader";
import type * as Monaco from "monaco-editor";

export class MonacoEditor extends Component {
	private editor: Monaco.editor.IStandaloneCodeEditor | null = null;
	private monaco: typeof Monaco | null = null;
	private _value: string = "";
	private _language: string = "typescript";
	private _onChange: ((value: string) => void) | null = null;

	constructor(config: {
		value?: string;
		language?: string;
		onChange?: (value: string) => void;
		className?: string;
	} = {}) {
		super({
			className: config.className,
		});

		this.style.width = "100%";
		this.style.height = "100%";

		this._value = config.value || "";
		this._language = config.language || "typescript";
		this._onChange = config.onChange || null;
	}

	async onInit() {
		try {
			// Load Monaco Editor
			this.monaco = await loader.init();

			// Configure TypeScript compiler options
			this.monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
				target: this.monaco.languages.typescript.ScriptTarget.ESNext,
				allowNonTsExtensions: true,
				moduleResolution: this.monaco.languages.typescript.ModuleResolutionKind.NodeJs,
				module: this.monaco.languages.typescript.ModuleKind.ESNext,
				noEmit: true,
				esModuleInterop: true,
				jsx: this.monaco.languages.typescript.JsxEmit.React,
				reactNamespace: "React",
				allowJs: true,
				typeRoots: ["node_modules/@types"],
				experimentalDecorators: true,
				emitDecoratorMetadata: true,
			});

			// Add TypeComposer type definitions (basic)
			this.monaco.languages.typescript.typescriptDefaults.addExtraLib(
				`
declare module 'typecomposer' {
  export class Component extends HTMLElement {
    constructor(config?: any);
    onInit?(): void | Promise<void>;
    appendChild<T extends Node>(node: T): T;
  }
  
  export class DivElement extends Component {}
  export class ButtonElement extends Component {}
  export class VBox extends Component {}
  export class HBox extends Component {}
  export class IFrameElement extends Component {}
}
`,
				"file:///node_modules/@types/typecomposer/index.d.ts"
			);

			// Create the editor
			this.editor = this.monaco.editor.create(this, {
				value: this._value,
				language: this._language,
				theme: "vs-dark",
				automaticLayout: true,
				minimap: { enabled: false },
				fontSize: 14,
				lineNumbers: "on",
				roundedSelection: false,
				scrollBeyondLastLine: false,
				readOnly: false,
				cursorStyle: "line",
				formatOnPaste: true,
				formatOnType: true,
				tabSize: 2,
			});

			// Listen for content changes
			this.editor.onDidChangeModelContent(() => {
				const value = this.editor?.getValue() || "";
				this._value = value;
				if (this._onChange) {
					this._onChange(value);
				}
			});
		} catch (error) {
			console.error("Failed to initialize Monaco Editor:", error);
		}
	}

	/**
	 * Get current editor value
	 */
	public getValue(): string {
		return this.editor?.getValue() || this._value;
	}

	/**
	 * Set editor value
	 */
	public setValue(value: string): void {
		this._value = value;
		if (this.editor) {
			this.editor.setValue(value);
		}
	}

	/**
	 * Set editor language
	 */
	public setLanguage(language: string): void {
		this._language = language;
		if (this.editor && this.monaco) {
			const model = this.editor.getModel();
			if (model) {
				this.monaco.editor.setModelLanguage(model, language);
			}
		}
	}

	/**
	 * Focus the editor
	 */
	public focus(): void {
		this.editor?.focus();
	}

	/**
	 * Cleanup when component is removed
	 */
	disconnectedCallback() {
		this.editor?.dispose();
	}
}

// Only register if not already registered (prevents HMR errors)
if (!customElements.get("monaco-editor")) {
	customElements.define("monaco-editor", MonacoEditor);
}
