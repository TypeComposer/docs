import { AnchorElement, Component, DetailsElement, NavElement, SpanElement, SummaryElement, DivElement, Router, ElementType } from "typecomposer";
import data from "@/assets/data.json";
import { ChevronUp, ChevronDown, createElement } from "lucide";

interface SidebarData {
  title: string;
  items: {
    title: string;
    link: string;
  }[];
  link?: undefined;
}

export class SidebarItem extends DetailsElement {
  icon: SpanElement = new SpanElement({ className: "right" });

  constructor(private data: SidebarData) {
    super({ className: "menu" });
    if (data.items?.length) {
      this.icon.append(createElement(ChevronDown));
      this.addEventListener("toggle", () => {
        this.icon.innerHTML = "";
        this.icon.append(this.open ? createElement(ChevronUp) : createElement(ChevronDown));
      });
    }
  }

  onInit(): void {
    const summary = new SummaryElement();
    summary.append(new SpanElement({ className: "label", style: { paddingLeft: "20px" }, textContent: this.data.title }));
    summary.appendChild(this.icon);
    this.appendChild(summary);
    if (this.data.link) {
      summary.onclick = () =>  Router.go(this.data.link!);
    }
    if(this.data.items) {
      const li = new DivElement({ className: "submenu", role: "group", ariaLabel: this.data.title });
      for (const item of this.data.items) {
        li.append(new AnchorElement({ rlink: item.link, textContent: item.title }));
      }
      this.appendChild(li);
    }
  }
}

export class Sidebar extends Component {
  constructor(props?: ElementType) {
    super({ ...props, className: "sidebar" });
    this.append(new DivElement({ className: "lib-header", textContent: "TypeComposer" }));
    const nav = this.appendChild(new NavElement());
    for (const menu of data.sidebar) {
      nav.append(new SidebarItem(menu as SidebarData));
    }
  }

}
