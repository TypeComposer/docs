import { AnchorElement, Component, DivElement, ImageElement, Router, SvgElement, App } from "typecomposer";
import { Sun, Moon } from "lucide";

class ThemeToggle extends Component {

  constructor() {
    super({
      className: "theme-toggle",
      onclick: () => this.toggleTheme(),
    });

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    App.theme = prefersDark ? 'light' : 'dark';
    this.updateIcon();
  }

  toggleTheme() {
    App.theme = App.theme === 'dark' ? 'light' : 'dark';
    this.updateIcon();
  }
  updateIcon() {
    this.innerHTML = '';
    
    // Get the icon data from lucide
    const iconData = App.theme === 'dark' ? Moon : Sun;
    
    // Create SVG element
    const iconSvg = new SvgElement({
      className: "w-4 h-4 transition-all duration-300",
      style: {
        width: "16px",
        height: "16px",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    });
    
    // Build the SVG content from the icon data
    let svgContent = '';
    console.log(iconData);
    for (const [tag, attrs] of iconData) {
      const attrString = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
      svgContent += `<${tag} ${attrString} />`;
    }
    iconSvg.innerHTML = svgContent;
    
    this.append(
      iconSvg
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
    super({ className: "flex items-center gap-1 nav-links" });
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
