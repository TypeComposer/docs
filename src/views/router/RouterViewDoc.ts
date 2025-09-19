import { CodeComponent } from "@/components/code/CodeComponent";
import { H1Element, ParagraphElement, H2Element, SpanElement } from "typecomposer";
import { BaseView } from "../elements/Base";

export class RouteViewDoc extends BaseView {
	constructor() {
		super();
		this.append(new SpanElement({ innerText: "TypeComposer ∙ RouterView" }));
		// Overview
		this.append(new H1Element({ innerText: "Overview" }));
		this.append(new ParagraphElement({ innerText: "The RouteView component is a dynamic routing element in TypeComposer that automatically updates its view based on the application's active route. It listens for route changes and renders the corresponding component." }));
		this.append(new ParagraphElement({ innerText: "- Automatically updates when the route changes." }));
		this.append(new ParagraphElement({ innerText: "- Supports default views when no matching route is found." }));
		this.append(new ParagraphElement({ innerText: "- Allows custom logic through event-driven updates." }));

		// Usage
		this.append(new H1Element({ innerText: "Usage" }));
		this.append(new H2Element({ innerText: "Basic Example" }));

		this.append(new CodeComponent({
			code: `
import { RouteView, Component } from "typecomposer";

class NotFoundComponent extends Component {
	onInit() {
		this.append("Not Found");
	}
}

export class MyApp extends Component {
	constructor() {
		super();
		this.append(new RouteView({
			defaultView: NotFoundComponent,
			onUpdateView: (view) => console.log("New view loaded:", view),
		}));
	}
}`}));
		this.append(new ParagraphElement({ innerText: "In this example, `RouteView` is placed inside `AppPage`, which acts as the main container for managing the application layout and routing logic. The `defaultView` is displayed when no matching route is found." }));

		// Properties
		this.append(new H1Element({ innerText: "Properties" }));

		this.append(new H2Element({ innerText: "1. defaultView" }));
		this.append(new ParagraphElement({ innerText: "Defines the default component to be displayed when no matching route is found." }));

		this.append(new CodeComponent({
			code: `
new RouteView({
	defaultView: NotFoundComponent,
});
			`
		}));

		this.append(new H2Element({ innerText: "2. onUpdateView" }));
		this.append(new ParagraphElement({ innerText: "Callback function that is triggered whenever the view changes." }));

		this.append(new CodeComponent({
			code: `
new RouteView({
	onUpdateView: (view) => console.log("Current view:", view),
});
			`
		}));

		this.append(new H2Element({ innerText: "3. view" }));
		this.append(new ParagraphElement({ innerText: "Holds the currently rendered component inside `RouteView`." }));

		// Lifecycle Methods
		this.append(new H1Element({ innerText: "Lifecycle Methods" }));

		this.append(new H2Element({ innerText: "connectedCallback()" }));
		this.append(new ParagraphElement({ innerText: "Automatically called when the component is added to the DOM. Initializes and updates the view based on the current route." }));

		this.append(new H2Element({ innerText: "disconnectedCallback()" }));
		this.append(new ParagraphElement({ innerText: "Automatically called when the component is removed from the DOM. Cleans up route watchers to prevent memory leaks." }));

		// Default Behavior
		this.append(new H1Element({ innerText: "Default Behavior" }));
		this.append(new ParagraphElement({ innerText: "By default, RouteView:" }));
		this.append(new ParagraphElement({ innerText: "- Renders the appropriate component based on the active route." }));
		this.append(new ParagraphElement({ innerText: "- Falls back to `defaultView` if no route matches." }));
		this.append(new ParagraphElement({ innerText: "- Removes the previous component when switching views." }));

		// When to Use RouteView
		this.append(new H1Element({ innerText: "When to Use RouteView" }));
		this.append(new ParagraphElement({ innerText: "- When you need dynamic view updates based on routing." }));
		this.append(new ParagraphElement({ innerText: "- To manage component-based navigation within a TypeComposer application." }));
		this.append(new ParagraphElement({ innerText: "- To handle dynamic page rendering without manually managing component mounting/unmounting." }));

		// Conclusion
		this.append(new H1Element({ innerText: "Conclusion" }));
		this.append(new ParagraphElement({ innerText: "The RouteView component is an essential tool for handling dynamic routing in TypeComposer. By automatically updating the displayed component based on the current route, it simplifies navigation management and ensures a seamless user experience." }));
	}
}
