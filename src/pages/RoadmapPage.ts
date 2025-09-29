import { BorderPanel } from "typecomposer";
import "highlight.js/styles/atom-one-dark.css";
import { NavBar } from "@/components/navbar/NavBar";
import { Roadmap } from "@/components/roadmap/roadmap";
import roadmapJson from "@/assets/roadmap.json";

export class RoadmapPage extends BorderPanel {

    constructor() {
        super({
            className: "w-screen h-screen",
          });
          this.top = new NavBar();
          this.center = new Roadmap(roadmapJson.data);
        }
}
