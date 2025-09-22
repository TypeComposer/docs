import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as gettingStartedContent } from "../../../content/getting-started.mdx";

export class GettingStartedView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, gettingStartedContent).catch(error => {
			console.error('Error rendering getting started content:', error);
		});
	}
}