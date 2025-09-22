import { AnchorElement, Component, DivElement, Router } from "typecomposer";
import { SidebarItem } from "../sidebar/Sidebar";
import data from "@/assets/data.json";

function getURL(): string {
  return window.location.hash.charAt(0) === "#" ? window.location.hash.slice(1) : window.location.hash;
}

interface RouterProps {
  title: string;
  link: string;
}

export class Navigation extends Component {
  constructor() {
    super({ className: "page-navigation" });
    const { prevew, next } = this.getPath();
    this.append(this.routerLink("prev", prevew));
    this.append(this.routerLink("next", next));
  }

  routerLink(type: "prev" | "next", props?: RouterProps): Component {
    const div = new DivElement({ className: type === "prev" ? "flex-1" : "flex-1 flex justify-end" });
    if (props) {
      const link = div.appendChild(
        new AnchorElement({
          rlink: props.link,
          className: "flex flex-col",
          onclick: () => SidebarItem.removeSelected(),
        })
      );
      link.append(new DivElement({ className: "nav-label", text: type === "prev" ? "Previous" : "Next" }));
      link.append(new DivElement({ className: "nav-title", text: props.title }));
    }
    this.append(div);
    return div;
  }

  getPath(): {
    prevew?: RouterProps;
    next?: RouterProps;
  } {
    const url = getURL().charAt(0) === "/" ? getURL().slice(1) : getURL();
    let prevew: RouterProps | undefined = undefined;
    let next: RouterProps | undefined = undefined;
    let item: RouterProps | undefined = undefined;
    const items = data.sidebar;
    for (let i = 0; i < items.length; i++) {
      if (items[i].link) items[i].items = [{ title: items[i].title, link: items[i].link || "" }];
      for (let j = 0; j < items[i].items.length; j++) {
        if (items[i].items[j].link === url) {
          item = items[i].items[j];
          continue;
        }
        if (!item) prevew = items[i].items[j];
        else if (item) {
          next = items[i].items[j];
          return { prevew: prevew, next: next };
        }
      }
    }
    return { prevew: prevew, next: next };
  }
}
