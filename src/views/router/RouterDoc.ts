import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as routerContent } from "../../../content/router.mdx";

export class RouterDoc extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, routerContent).catch(error => {
			console.error('Error rendering router content:', error);
		});
	}
}