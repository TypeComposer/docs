import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as componentsContent } from "../../../content/components.mdx";

export class ComponentView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, componentsContent).catch(error => {
			console.error('Error rendering components content:', error);
		});

	}
}