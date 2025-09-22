import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as vboxContent } from "../../../content/vbox.mdx";

export class VboxView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, vboxContent).catch(error => {
			console.error('Error rendering vbox content:', error);
		});
	}
}