import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as routerViewContent } from "../../../content/router-view.mdx";

export class RouteViewDoc extends BaseView {
	constructor() {
		super();
		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, routerViewContent).catch(error => {
			console.error('Error rendering router view content:', error);
		});
	}
}
