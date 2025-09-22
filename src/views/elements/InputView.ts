import { BaseView } from "../elements/Base";
import { renderMDX } from "../../utils/mdx";
import { mdx as inputContent } from "../../../content/input.mdx";

export class InputView extends BaseView {
	constructor() {
		super();

		// Render the MDX content to the content wrapper
		renderMDX(this.contentWrapper, inputContent).catch(error => {
			console.error('Error rendering input content:', error);
		});
	}
}