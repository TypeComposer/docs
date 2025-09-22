import { BorderPanel, RouteView } from "typecomposer";
import "highlight.js/styles/atom-one-dark.css";
import { NavBar } from "@/components/navbar/NavBar";
import { Sidebar } from "@/components/sidebar/Sidebar";

export class AppPage extends BorderPanel {
  constructor() {
    super({
      className: "w-screen h-screen",
    });
    this.top = new NavBar();
    this.left = new Sidebar();
    this.center = new RouteView({ className: "flex-1 overflow-auto" });
  }
}
