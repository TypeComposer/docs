import { compile } from '@mdx-js/mdx';
import hljs from 'highlight.js';
import { 
  SpanElement, 
  H1Element, 
  H2Element, 
  H3Element, 
  H4Element, 
  H5Element, 
  H6Element, 
  ParagraphElement, 
  DivElement, 
  ButtonElement, 
  InputElement, 
  LabelElement, 
  TableElement,
  Component 
} from 'typecomposer';

// Map HTML tag names to TypeComposer components
const componentMap: Record<string, any> = {
  'h1': H1Element,
  'h2': H2Element,
  'h3': H3Element,
  'h4': H4Element,
  'h5': H5Element,
  'h6': H6Element,
  'p': ParagraphElement,
  'div': DivElement,
  'span': SpanElement,
  'button': ButtonElement,
  'input': InputElement,
  'label': LabelElement,
  'table': TableElement,
};

// Helper function to extract text content from children
function extractTextContent(children: any): string {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(child => 
      typeof child === 'string' ? child : ''
    ).join('');
  }
  return '';
}

// Helper function to append children to a component
function appendChildren(element: Component | HTMLElement, children: any): void {
  if (!children) return;
  
  const appendToElement = (child: any) => {
    if (typeof child === 'string') {
      const textNode = document.createTextNode(child);
      element.appendChild(textNode);
    } else if (child instanceof Node || child instanceof Component) {
      if (element instanceof Component) {
        element.append(child);
      } else {
        element.appendChild(child);
      }
    }
  };

  if (Array.isArray(children)) {
    children.forEach(appendToElement);
  } else {
    appendToElement(children);
  }
}

// JSX runtime functions for MDX compilation
const jsxRuntime = {
  Fragment: (props: any) => {
    const fragment = document.createDocumentFragment();
    if (props.children) {
      appendChildren(fragment as any, Array.isArray(props.children) ? props.children : [props.children]);
    }
    return fragment;
  },

  jsx: (type: any, props: any) => {
    // Handle Fragment calls
    if (type === jsxRuntime.Fragment) {
      return jsxRuntime.Fragment(props);
    }
    
    // Handle code blocks with syntax highlighting
    if (type === 'pre') {
      const element = document.createElement('pre');
      element.className = 'hljs';
      
      if (props) {
        Object.keys(props).forEach(key => {
          if (key === 'children') {
            // Find the code element and apply syntax highlighting
            const codeElement = props.children?.type === 'code' ? props.children : 
                               (Array.isArray(props.children) ? props.children.find((child: any) => child?.type === 'code') : null);
            
            if (codeElement) {
              const codeProps = codeElement.props;
              const className = codeProps.className || '';
              const languageMatch = className.match(/language-(\w+)/);
              const language = languageMatch ? languageMatch[1] : 'typescript';
              const code = codeProps.children || '';
              
              // Apply syntax highlighting
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
              
              // Create the code element with highlighting
              const codeEl = document.createElement('code');
              codeEl.className = `hljs language-${language}`;
              codeEl.innerHTML = highlightedCode;
              element.appendChild(codeEl);
            } else {
              appendChildren(element, props.children);
            }
          } else if (key === 'className') {
            element.className = `${element.className} ${props[key]}`;
          } else if (key.startsWith('on') && typeof props[key] === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, props[key]);
          } else if (key !== 'children') {
            element.setAttribute(key, props[key]);
          }
        });
      }
      
      return element;
    }
    
    // Handle TypeComposer components
    if (typeof type === 'string' && componentMap[type]) {
      const ComponentClass = componentMap[type];
      const componentProps: any = {};
      
      if (props) {
        // Handle text content for text-based components
        const textComponents = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'button', 'label'];
        if (props.children && textComponents.includes(type)) {
          componentProps.innerText = extractTextContent(props.children);
        }
        
        // Map common properties
        if (props.className) componentProps.className = props.className;
        if (props.id) componentProps.id = props.id;
        if (props.style) componentProps.style = props.style;
        
        // Map event handlers
        Object.keys(props).forEach(key => {
          if (key.startsWith('on') && typeof props[key] === 'function') {
            componentProps[key] = props[key];
          }
        });
        
        // Handle input-specific props
        if (type === 'input') {
          if (props.type) componentProps.type = props.type;
          if (props.placeholder) componentProps.placeholder = props.placeholder;
          if (props.value) componentProps.value = props.value;
        }
        
        // Handle label-specific props
        if (type === 'label' && props.htmlFor) {
          componentProps.for = props.htmlFor;
        }
      }
      
      const component = new ComponentClass(componentProps);
      
      // Handle children for container components
      if (type === 'div' && props?.children && !componentProps.innerText) {
        appendChildren(component, props.children);
      }
      
      return component;
    }
    
    // Fallback to vanilla DOM elements for unsupported tags
    if (typeof type === 'string') {
      const element = document.createElement(type);
      
      if (props) {
        Object.keys(props).forEach(key => {
          if (key === 'children') {
            appendChildren(element, props.children);
          } else if (key === 'className') {
            element.className = props[key];
          } else if (key.startsWith('on') && typeof props[key] === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, props[key]);
          } else if (key !== 'children') {
            element.setAttribute(key, props[key]);
          }
        });
      }
      
      return element;
    }
    
    return new DivElement({});
  },

  jsxs: (type: any, props: any) => jsxRuntime.jsx(type, props)
};

// Cache for compiled MDX
const compiledCache = new Map<string, Function>();

/**
 * Compile and render MDX content to TypeComposer components
 */
export async function renderMDX(container: HTMLElement | Component, mdxContent: string): Promise<void> {
  try {
    // Check cache first
    let compiledMDX = compiledCache.get(mdxContent);
    
    if (!compiledMDX) {
      // Compile MDX to JavaScript
      const compiled = await compile(mdxContent, {
        outputFormat: 'function-body',
        development: false,
      });
      
      // Create function from compiled code
      compiledMDX = new Function('jsxRuntime', String(compiled));
      compiledCache.set(mdxContent, compiledMDX);
    }
    
    // Execute the compiled MDX with our JSX runtime
    const result = compiledMDX(jsxRuntime);
    
    // Handle the result
    const content = result?.default ? result.default() : result;
    
    if (content instanceof Node) {
      if (container instanceof Component) {
        container.append(content);
      } else {
        container.appendChild(content);
      }
    }
    
  } catch (error) {
    console.error('Error rendering MDX:', error);
    
    // Fallback: render error message
    const errorDiv = new DivElement({
      innerText: `Error rendering MDX content: ${error}`,
      style: {
        color: 'red',
        padding: '10px',
        border: '1px solid red',
        borderRadius: '4px',
        backgroundColor: '#fee'
      }
    });
    errorDiv.className = 'error-message';
    
    if (container instanceof Component) {
      container.append(errorDiv);
    } else {
      container.appendChild(errorDiv);
    }
  }
}