import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
// @ts-ignore
import { mdx as borderPanelContent } from "../../../content/border-panel.mdx";

export class BorderPanelView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, borderPanelContent).catch(error => {
			console.error('Error rendering border panel content:', error);
		});
	}
}
