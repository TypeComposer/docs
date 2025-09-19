import { AnchorElement, ButtonElement, Component, DivElement, ImageElement, Router, SvgElement } from "typecomposer";

class Logo extends Component {
  constructor() {
    super({
      className: "flex text-2xl font-bold align-middle gap-3 cursor-pointer",
      onclick: () => Router.go("/"),
    });
    this.append(new ImageElement({ src: "/typecomposer.svg", style: { width: "35px", height: "35px" } }));
    this.append("TypeComposer");
  }
}

class NavLinks extends Component {
  constructor() {
    super({ className: "flex gap-4 nav-link" });
    this.append(new AnchorElement({ rlink: "docs", text: "Home", className: "hover:text-[#f7df1e]" }));
    this.append(new AnchorElement({ rlink: "docs", text: "Docs", className: "hover:text-[#f7df1e]" }));
    this.append(new AnchorElement({ rlink: "playground", text: "Playground", className: "hover:text-[#f7df1e]" }));
    this.append(new AnchorElement({ rlink: "contact", text: "Contact", className: "hover:text-[#f7df1e]" }));
  }
}

export class NavBar extends Component {
  open = false;

  constructor() {
    super({ className: "flex items-center justify-between w-screen h-16 px-10 bg-[#1a202c] text-[#fcfffa]" });
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
          width: "30px",
          height: "30px",
          fill: "#afacac",
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
