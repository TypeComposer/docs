import { AppPage } from "@/pages/AppPage";
import { PlaygroundPage } from "@/pages/Playground";
import { Router } from "typecomposer";
import { loadDocs } from "@/utils/mdx";
import { BaseView } from "@/views/elements/Base";

loadDocs().finally(() => {
  Router.create({
    history: "hash",
    routes: [
      {
        path: "/docs",
        component: AppPage,
        children: [
          { path: "getting-started", component: BaseView },
          { path: "components/component", component: BaseView },
          { path: "elements/div", component: BaseView },
          { path: "elements/button", component: BaseView },
          { path: "elements/input", component: BaseView },
          { path: "elements/table", component: BaseView },
          { path: "elements/label", component: BaseView },
          { path: "elements/span", component: BaseView },
          { path: "elements/heading", component: BaseView },
          { path: "layout/vbox", component: BaseView },
          { path: "layout/hbox", component: BaseView },
          { path: "layout/border-panel", component: BaseView },
          { path: "ref", component: BaseView },
          { path: "router", component: BaseView },
          { path: "router-view", component: BaseView },
          { path: "", component: BaseView },
        ],
      },
      { path: "/playground", component: PlaygroundPage },
      { path: Router.PATH_WILDCARD, redirect: "/docs" },
    ],
  });
});
