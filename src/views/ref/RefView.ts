import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as refContent } from "../../../content/ref.mdx";

export class RefDocView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, refContent).catch(error => {
			console.error('Error rendering ref content:', error);
		});
	}
}
