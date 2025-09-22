import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as divContent } from "../../../content/div.mdx";

export class DivView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, divContent).catch(error => {
			console.error('Error rendering div content:', error);
		});
	}
}