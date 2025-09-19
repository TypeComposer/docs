import { NavBar } from "@/components/navbar/NavBar";
import { PlaygroundView } from "@/views/playground/PlaygroundView";
import { BorderPanel } from "typecomposer";



export class PlaygroundPage extends BorderPanel {
	constructor() {
		super({
			className: "w-screen h-screen overflow-hidden",
		});
		this.top = new NavBar();
		this.center = new PlaygroundView();

	}
}