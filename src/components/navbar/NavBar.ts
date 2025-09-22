import { AnchorElement, ButtonElement, Component, DivElement, ImageElement, Router, SvgElement } from "typecomposer";

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
