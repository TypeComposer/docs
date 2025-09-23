import { ButtonElement } from "typecomposer";

type CopyButtonProps = {
  content?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  delay?: number;
  onCopy?: (content: string) => void;
  isCopied?: boolean;
  onCopyChange?: (isCopied: boolean) => void;
  className?: string;
};

export class CopyButton extends ButtonElement {
  private content: string;
  private delay: number = 3000;
  private isCopied: boolean = false;
  private onCopy?: (content: string) => void;
  private onCopyChange?: (isCopied: boolean) => void;

  constructor(options: CopyButtonProps) {
    super({
      className: CopyButton.getButtonClasses(options.size || 'md', options.variant || 'ghost', options.className),
      style: {
        position: 'relative',
        overflow: 'hidden',
        opacity: '0.7',
        transition: 'all 0.2s ease-in-out'
      }
    });

    this.content = options.content || '';
    this.delay = options.delay || 2000;
    this.isCopied = options.isCopied || false;
    this.onCopy = options.onCopy;
    this.onCopyChange = options.onCopyChange;
    
    this.updateIcon();
    this.setupEventListeners();
  }

  private static getButtonClasses(size: 'sm' | 'md' | 'lg', variant: string, className?: string): string {
    const sizeClasses = {
      sm: 'h-8 w-8 p-0',
      md: 'h-10 w-10 p-0',
      lg: 'h-12 w-12 p-0'
    };

    const variantClasses = {
      default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
      muted: 'bg-muted text-muted-foreground hover:bg-muted/80',
      destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
      ghost: 'hover:bg-accent/50 hover:text-accent-foreground text-muted-foreground'
    };

    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 flex-shrink-0';
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant as keyof typeof variantClasses]} ${className || ''}`.trim();
  }

  private createIcon(type: 'copy' | 'check'): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.style.transition = 'all 0.2s ease-in-out';

    if (type === 'copy') {
      // Copy icon (clipboard)
      svg.innerHTML = `
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      `;
    } else {
      // Check icon
      svg.innerHTML = `<path d="m9 12 2 2 4-4"/>`;
    }

    return svg;
  }

  private updateIcon(): void {
    this.innerHTML = '';
    const icon = this.isCopied ? this.createIcon('check') : this.createIcon('copy');
    
    if (this.isCopied) {
      icon.style.color = '#10b981'; // green-500
    }
    
    this.appendChild(icon);
  }

  private setupEventListeners(): void {
    this.addEventListener('click', async () => {
      if (this.isCopied) return;
      
      if (this.content) {
        try {
          await navigator.clipboard.writeText(this.content);
          this.handleIsCopied(true);
          setTimeout(() => this.handleIsCopied(false), this.delay);
          this.onCopy?.(this.content);
        } catch (error) {
          console.error('Error copying content', error);
          
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = this.content;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
            this.handleIsCopied(true);
            setTimeout(() => this.handleIsCopied(false), this.delay);
            this.onCopy?.(this.content);
          } catch (fallbackError) {
            console.error('Fallback copy failed', fallbackError);
          }
          
          document.body.removeChild(textArea);
        }
      }
    });

    // Enhanced hover effects matching your styles
    this.addEventListener('mouseenter', () => {
      this.style.opacity = '1';
      const icon = this.querySelector('svg');
      if (icon && !this.isCopied) {
        icon.style.transform = 'scale(1.05)';
      }
    });

    this.addEventListener('mouseleave', () => {
      this.style.opacity = '0.7';
      const icon = this.querySelector('svg');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });

    this.addEventListener('mousedown', () => {
      const icon = this.querySelector('svg');
      if (icon) {
        icon.style.transform = 'scale(0.95)';
      }
    });

    this.addEventListener('mouseup', () => {
      const icon = this.querySelector('svg');
      if (icon && !this.isCopied) {
        icon.style.transform = 'scale(1.05)';
      }
    });

    // Focus styles
    this.addEventListener('focus', () => {
      this.style.outline = '2px solid hsl(var(--ring))';
      this.style.outlineOffset = '2px';
    });

    this.addEventListener('blur', () => {
      this.style.outline = 'none';
    });
  }

  private handleIsCopied(isCopied: boolean): void {
    this.isCopied = isCopied;
    this.updateIcon();
    this.onCopyChange?.(isCopied);
    
    // Add a subtle animation when copied
    if (isCopied) {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 100);
    }
  }

  // Public methods to match the React component API
  public setContent(content: string): void {
    this.content = content;
  }

  public setIsCopied(isCopied: boolean): void {
    this.handleIsCopied(isCopied);
  }

  public getContent(): string {
    return this.content;
  }

  public getIsCopied(): boolean {
    return this.isCopied;
  }
}