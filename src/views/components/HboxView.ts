import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as hboxContent } from "../../../content/hbox.mdx";

export class HboxView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, hboxContent).catch(error => {
			console.error('Error rendering hbox content:', error);
		});
	}
}