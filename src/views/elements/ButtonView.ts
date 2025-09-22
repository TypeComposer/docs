import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as buttonContent } from "../../../content/button.mdx";

export class ButtonView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, buttonContent).catch(error => {
			console.error('Error rendering button content:', error);
		});
	}
}