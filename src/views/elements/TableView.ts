import { CodeComponent } from "@/components/code/CodeComponent";
import { SpanElement, H1Element, ParagraphElement, H2Element, TableElement } from "typecomposer";
import { BaseView } from "../elements/Base";


export class TableView extends BaseView {
	constructor() {
		super();
		this.contentWrapper.append(new SpanElement({ innerText: "TypeComposer ∙ TableElement" }));
		this.contentWrapper.append(new H1Element({ innerText: "Overview" }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "The TableElement is a flexible component in TypeComposer, designed for creating dynamic and styled tables. It extends the functionality of the standard HTML table, allowing property-driven customization for headers, rows, and overall table styling." }));

		this.contentWrapper.append(new H1Element({ innerText: "1. Key Features" }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- Allows for dynamic configuration of headers and rows using properties." }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- Supports customization of styles for table, headers, and cells." }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- Provides integration with other TypeComposer components for flexible layouts." }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- Includes responsive and interactive features, such as row highlighting." }));

		this.contentWrapper.append(new H1Element({ innerText: "2. Basic Example" }));
		this.contentWrapper.append(new CodeComponent({
			code: `import { TableElement } from "typecomposer";
		
class ExampleTable extends TableElement {
	constructor() {
	super({
		headers: ["Name", "Age", "Occupation"],
		rows: [
		["Alice", "30", "Engineer"],
		["Bob", "25", "Designer"],
		["Charlie", "35", "Manager"],
		],
		className: "border border-gray-300",
	});
	}
}

export default ExampleTable;`
		}));

		this.contentWrapper.append(new H1Element({ innerText: "3. Properties" }));
		this.contentWrapper.append(new TableElement({
			headers: ["Property", "Type", "Description", "Example"],
			rows: [
				["headers", "string[]", "An array of column headers for the table.", `["Name", "Age", "Occupation"]`],
				["rows", "string[][]", "A 2D array representing the rows of the table.", `[["Alice", "30"], ["Bob", "25"]]`],
				["className", "string", "CSS class for styling the table.", `"border border-gray-300"`],
				["cellClassName", "string", "CSS class for styling individual cells.", `"px-4 py-2 text-left"`],
				["striped", "boolean", "Enables striped rows for better readability.", `true`],
				["hoverable", "boolean", "Adds hover effects to rows.", `true`],
				["onclick", "function", "Event handler triggered on row clicks.", `(row) => console.log(row)`]
			],
			className: "border border-gray-300"
		}));

		this.contentWrapper.append(new H1Element({ innerText: "4. Examples" }));
		this.contentWrapper.append(new H2Element({ innerText: "Basic Table with Headers and Rows" }));
		this.contentWrapper.append(new CodeComponent({
			code: `new TableElement({
	headers: ["Name", "Age", "City"],
	rows: [
	["John", "28", "New York"],
	["Jane", "32", "San Francisco"],
	["Sam", "24", "Los Angeles"],
	],
	className: "border border-gray-300",
});`
		}));

		this.contentWrapper.append(new H2Element({ innerText: "Striped and Hoverable Table" }));
		this.contentWrapper.append(new CodeComponent({
			code: `new TableElement({
	headers: ["Product", "Price", "Stock"],
	rows: [
	["Laptop", "$1000", "Available"],
	["Smartphone", "$700", "Out of Stock"],
	["Tablet", "$500", "Limited"],
	],
	striped: true,
	hoverable: true,
	className: "border border-gray-300",
});`
		}));

		this.contentWrapper.append(new H2Element({ innerText: "Interactive Table with Row Click Event" }));
		this.contentWrapper.append(new CodeComponent({
			code: `new TableElement({
	headers: ["Task", "Status"],
	rows: [
	["Design Homepage", "Completed"],
	["Implement API", "In Progress"],
	["Write Documentation", "Pending"],
	],
	onclick: (row) => console.log("Row clicked:", row),
	className: "border border-gray-300",
});`
		}));

		this.contentWrapper.append(new H1Element({ innerText: "5. Default Behavior" }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "By default, the TableElement:" }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- Displays a basic table without any additional styling." }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- Does not apply row hover or striping unless explicitly enabled." }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- Allows for dynamic header and row definitions through properties." }));

		this.contentWrapper.append(new H1Element({ innerText: "6. When to Use TableElement" }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- When you need to create dynamic, data-driven tables with minimal effort." }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- For creating styled and interactive tables in your application." }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "- When you want to integrate tables with other TypeComposer components." }));

		this.contentWrapper.append(new H1Element({ innerText: "Conclusion" }));
		this.contentWrapper.append(new ParagraphElement({ innerText: "The TableElement simplifies the process of creating structured, styled, and interactive tables in TypeComposer. Its property-driven approach allows for easy customization and integration, making it ideal for displaying tabular data in a clean and efficient way." }));

	}
}