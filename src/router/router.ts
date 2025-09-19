import { AppPage } from "@/pages/AppPage";
import { PlaygroundPage } from "@/pages/Playground";
import { ButtonView } from "@/views/elements/ButtonView";
import { DivView } from "@/views/elements/DivView";
import { HeadingView } from "@/views/elements/HeadingView";
import { InputView } from "@/views/elements/InputView";
import { LabelView } from "@/views/elements/LabelView";
import { SpanView } from "@/views/elements/SpanView";
import { TableView } from "@/views/elements/TableView";
import { BorderPanelView } from "@/views/components/BorderPanelView";
import { ComponentView } from "@/views/components/ComponentView";
import { HboxView } from "@/views/components/HboxView";
import { VboxView } from "@/views/components/VboxView";
import { GettingStartedView } from "@/views/getting-started/GettingStartedView";
import { HomeView } from "@/views/home/HomeView";
import { RouterDoc } from "@/views/router/RouterDoc";
import { Router } from "typecomposer";
import { RefDocView } from "@/views/ref/RefView";
import { RouteViewDoc } from "@/views/router/RouterViewDoc";

Router.create({
	history: "hash",
	sitemaps: { baseUrl: "https://typecomposer.com" },
	robots: "auto",
	routes: [
		{
			path: "/",
			component: AppPage,
			children: [
				{ path: "docs/getting-started", component: GettingStartedView },
				{ path: "components/component", component: ComponentView },
				{ path: "elements/div", component: DivView },
				{ path: "elements/button", component: ButtonView },
				{ path: "elements/input", component: InputView },
				{ path: "elements/table", component: TableView },
				{ path: "elements/label", component: LabelView },
				{ path: "elements/span", component: SpanView },
				{ path: "elements/heading", component: HeadingView },
				{ path: "layout/vbox", component: VboxView },
				{ path: "layout/hbox", component: HboxView },
				{ path: "layout/border-panel", component: BorderPanelView },
				{ path: "docs", component: HomeView },
				{ path: "ref", component: RefDocView },
				{ path: "router", component: RouterDoc },
				{ path: "router-view", component: RouteViewDoc },
			]
		},
		{ path: "/playground", component: PlaygroundPage },
		{ path: Router.PATH_WILDCARD, redirect: "/docs" }
	]
})