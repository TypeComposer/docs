import { AnchorElement, ButtonElement, Component, DivElement, ImageElement, Router, SvgElement } from "typecomposer";

class ThemeToggle extends Component {
  private isDark = false;

  constructor() {
    super({
      className: "flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
      onclick: () => this.toggleTheme(),
    });
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    this.updateTheme();
    this.updateIcon();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.updateTheme();
    this.updateIcon();
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  updateTheme() {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }

  updateIcon() {
    this.innerHTML = '';
    const icon = this.isDark ? '☀️' : '🌙';
    const text = this.isDark ? 'Light' : 'Dark';
    this.append(
      new DivElement({ 
        className: "text-lg",
        text: icon 
      }),
      new DivElement({ 
        className: "text-sm font-medium text-gray-700 dark:text-gray-300",
        text: text 
      })
    );
  }
}

class Logo extends Component {
  constructor() {
    super({
      className: "flex items-center gap-2 cursor-pointer logo",
      onclick: () => Router.go("/"),
    });
    this.append(new ImageElement({ src: "/typecomposer.svg", style: { width: "28px", height: "28px" } }));
    this.append("TypeComposer");
  }
}

class NavLinks extends Component {
  constructor() {
    super({ className: "flex gap-1 nav-links" });
    this.append(new AnchorElement({ rlink: "docs", text: "Docs" }));
    this.append(new AnchorElement({ rlink: "playground", text: "Playground" }));
    this.append(new ThemeToggle());
  }
}

export class NavBar extends Component {
  open = false;

  constructor() {
    super({ className: "flex items-center justify-between w-screen h-16 px-6 navbar" });
    this.append(new Logo());
    this.append(new NavLinks());
    this.btn();
  }

  btn() {
    const div = this.appendChild(new DivElement({ className: "cursor-pointer" }));
    const svg = div.appendChild(
      new SvgElement({
        src: "menu-svgrepo-com.svg",
        className: "menu-btn",
        style: {
          width: "24px",
          height: "24px",
          fill: "var(--text-secondary)",
        },
      })
    );
    div.onclick = () => {
      this.open = !this.open;
      console.log("open: ", this.open);
      svg.src = this.open ? "close-lg-svgrepo-com.svg" : "menu-svgrepo-com.svg";
      // @ts-ignore
      this.emitEvent("menu-bar", { open: this.open });
    };
  }
}
