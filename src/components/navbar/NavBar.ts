import { AnchorElement, Component, DivElement, ImageElement, Router, SvgElement, App, ref, computed, ButtonElement, BorderPanel } from "typecomposer";
import { Sun, Moon, createElement, Menu, Search } from "lucide";
import { SearchModal } from "@/components/search/SearchModal";
import "@/components/search/search.scss";

class ThemeToggle extends Component {
  constructor() {
    super({
      className: "theme-toggle",
      onclick: () => this.toggleTheme(),
    });
    const iconSunSvg = createElement(Sun);
    const iconMoonSvg = createElement(Moon);
    this.append(computed(() => (App.theme.value === "dark" ? iconSunSvg : iconMoonSvg)));
  }

  toggleTheme() {
    App.theme.value = App.theme.value === "dark" ? "light" : "dark";
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
    super({ className: "flex items-center nav-links" });
    this.append(new AnchorElement({ rlink: "docs", text: "Docs" }));
    this.append(new AnchorElement({ rlink: "playground", text: "Playground" }));
    this.append(new AnchorElement({ text: "GitHub", href: "https://github.com/typecomposer/typecomposer" }));
  }
}

export class NavBar extends Component {
  open = false;
  private searchModal: SearchModal;

  constructor() {
    super({ className: "flex items-center justify-between w-screen h-16 px-6 navbar" });
    this.append(new Logo());
    this.append(new NavLinks());
    
    // Add search button
    this.append(
      new ButtonElement({
        className: "search-button flex items-center gap-2 px-3 py-2 rounded-md",
        children: [
          createElement(Search),
          new DivElement({ 
            className: "search-shortcut hidden md:block", 
            textContent: "⌘K" 
          })
        ],
        onclick: () => this.searchModal.open(),
      })
    );
    
    this.append(new ThemeToggle());
    
    this.append(
      new ButtonElement({
        className: "btn-sidebar m-2",
        children: [createElement(Menu)],
        onclick: () => {
          const parent = this.getParent<BorderPanel>();
          parent?.left.toggleAttribute("open");
        },
      })
    );
    this.btn();
    
    // Add search modal
    this.searchModal = new SearchModal();
    this.append(this.searchModal);
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
      svg.src = this.open ? "close-lg-svgrepo-com.svg" : "menu-svgrepo-com.svg";
      this.emitEvent("menu-bar", { open: this.open });
    };
  }
}
