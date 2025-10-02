import { Component } from "typecomposer";
import hljs from "highlight.js";

type CodeLanguage =
  | "typescript"
  | "javascript"
  | "bash"
  | "html"
  | "css"
  | "scss"
  | "json"
  | "yaml"
  | "xml"
  | "sql"
  | "python"
  | "java"
  | "csharp"
  | "cpp"
  | "c"
  | "php"
  | "ruby"
  | "go"
  | "rust"
  | "swift"
  | "kotlin"
  | "dart"
  | "markdown"
  | "diff"
  | "dockerfile"
  | "shell"
  | "powershell";

export class CodeComponent extends Component {
  constructor(
    public props: {
      language?: CodeLanguage;
      code: string;
    }
  ) {
    super({ className: "overflow-hidden rounded-md" });
    this.className = "code-block";
    this.transformCode(props.language || "typescript", props.code);
  }

  transformCode(language: CodeLanguage, code: string) {
    // Use highlight.js directly for syntax highlighting
    let highlightedCode: string;

    if (hljs.getLanguage(language)) {
      try {
        highlightedCode = hljs.highlight(code.trim(), { language }).value;
      } catch (__) {
        highlightedCode = hljs.highlightAuto(code.trim()).value;
      }
    } else {
      highlightedCode = hljs.highlightAuto(code.trim()).value;
    }

    // Create the structure manually without markdown-it
    this.innerHTML = `
			<pre class="hljs"><code class="hljs language-${language}">${highlightedCode}</code></pre>
		`;
  }
}
