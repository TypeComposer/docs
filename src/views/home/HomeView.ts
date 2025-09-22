import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as homeContent } from "../../../content/home.mdx";

export class HomeView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, homeContent).catch(error => {
			console.error('Error rendering home content:', error);
		});
	}
}