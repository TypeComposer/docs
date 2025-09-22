import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as headingContent } from "../../../content/heading.mdx";

export class HeadingView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, headingContent).catch(error => {
			console.error('Error rendering heading content:', error);
		});
	}
}