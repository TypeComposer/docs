import "@/style.scss";

// interface RouteOutput {
//   path: string;
//   routers: { component?: any; path: string; guard?: any; redirect?: string; title?: string; id: string }[];
// }

// const routes: RouteOutput[] = [
//   {
//     path: "/",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//     ],
//   },
//   {
//     path: "/docs/getting-started",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "/docs/getting-started",
//         id: "/docs/getting-started_2",
//       },
//     ],
//   },
//   {
//     path: "/components/component",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "components/component",
//         id: "components/component_3",
//       },
//     ],
//   },
//   {
//     path: "/elements/div",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/div",
//         id: "elements/div_4",
//       },
//     ],
//   },
//   {
//     path: "/elements/button",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/button",
//         id: "elements/button_5",
//       },
//     ],
//   },
//   {
//     path: "/elements/input",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/input",
//         id: "elements/input_6",
//       },
//     ],
//   },
//   {
//     path: "/elements/*",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/input",
//         id: "elements/input_6",
//       },
//     ],
//   },
//   {
//     path: "/elements/table",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/table",
//         id: "elements/table_7",
//       },
//     ],
//   },
//   {
//     path: "/user/:id/profile",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/profile",
//         id: "elements/profile_12",
//       },
//     ],
//   },
//   {
//     path: "/elements/label",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/label",
//         id: "elements/label_8",
//       },
//     ],
//   },
//   {
//     path: "/elements/span",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/span",
//         id: "elements/span_9",
//       },
//     ],
//   },
//   {
//     path: "/elements/heading",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "elements/heading",
//         id: "elements/heading_10",
//       },
//     ],
//   },
//   {
//     path: "/layout/vbox",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "layout/vbox",
//         id: "layout/vbox_11",
//       },
//     ],
//   },
//   {
//     path: "/layout/hbox",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "layout/hbox",
//         id: "layout/hbox_12",
//       },
//     ],
//   },
//   {
//     path: "/layout/border-panel",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "layout/border-panel",
//         id: "layout/border-panel_13",
//       },
//     ],
//   },
//   {
//     path: "/docs",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "docs",
//         id: "docs_14",
//       },
//     ],
//   },
//   {
//     path: "/ref",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "ref",
//         id: "ref_15",
//       },
//     ],
//   },
//   {
//     path: "/router",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "router",
//         id: "router_16",
//       },
//     ],
//   },
//   {
//     path: "/router-view",
//     routers: [
//       {
//         path: "/",
//         id: "/_1",
//       },
//       {
//         path: "router-view",
//         id: "router-view_17",
//       },
//     ],
//   },
//   {
//     path: "/playground",
//     routers: [
//       {
//         path: "/playground",
//         id: "/playground_18",
//       },
//     ],
//   },
//   {
//     path: "/**",
//     routers: [
//       {
//         path: "**",
//         id: "**_19",
//         redirect: "/docs",
//       },
//     ],
//   },
// ];

// interface RouteMatch {
//   url: string;
//   path: string;
//   routers: any[];
//   params: Record<string, string>;
// }

// function validateRoutePattern(routePattern: string, urlPath: string): boolean {
//   if (routePattern === "/**") return true; // wildcard matches anything
//   const routeSegments = routePattern.split("/").filter(Boolean);
//   const urlSegments = urlPath.split("/").filter(Boolean);
//   if (routeSegments.length !== urlSegments.length) return false;
//   return routeSegments.every((seg, idx) => seg.startsWith(":") || seg === "*" || seg === urlSegments[idx]);
// }

// function getRouterParams(routePattern: string, url: URL): Record<string, string> {
//   const params: Record<string, string> = {};
//   const routeSegments = routePattern.split("/").filter(Boolean);
//   const urlSegments = url.pathname.split("/").filter(Boolean);
//   for (let i = 0; i < routeSegments.length; i++) {
//     const seg = routeSegments[i];
//     if (seg.startsWith(":")) {
//       const paramName = seg.slice(1);
//       params[paramName] = urlSegments[i];
//     }
//   }
//   for (const [key, value] of url.searchParams.entries()) {
//     params[key] = value;
//   }
//   return params;
// }

// function matchRoute(path: string, routes: RouteOutput[]): RouteMatch | null {
//   const url = new URL("http://localhost" + path);
//   console.log("Matching URL:", url.href);
//   for (const route of routes) {
//     if (validateRoutePattern(route.path, url.pathname)) {
//       return { url: url.pathname, path: path, routers: route.routers, params: getRouterParams(route.path, url) };
//     }
//   }
//   return null;
// }

// // test
// // console.log(matchRoute("/elements/button", routes)); // ok
// // console.log(matchRoute("/elements/label", routes));
// // console.log(matchRoute("/elements/heading", routes));
// // console.log(matchRoute("/elements/span", routes));
// // console.log(matchRoute("/elements/div", routes));
// // console.log(matchRoute("#/elements/input22", routes));
// // console.log(matchRoute("/elements/table", routes));
// // console.log(matchRoute("/layout/vbox", routes));
// // console.log(matchRoute("/layout/vbox?view=grid&test=123", routes));
// // console.log(matchRoute("/layout/hbox", routes));
// // console.log(matchRoute("/layout/border-panel", routes));
// // console.log(matchRoute("/docs/getting-started", routes));
// // console.log(matchRoute("/docs", routes));
// // console.log(matchRoute("/ref", routes));
// // console.log(matchRoute("/router", routes));
// // console.log(matchRoute("/router-view", routes));
// // console.log(matchRoute("/", routes));
// // console.log(matchRoute("/playground", routes));
// // console.log(matchRoute("/user/123/profile?view=grid&test=123", routes));
// // console.log(matchRoute("/unknown/path", routes)); // should match the wildcard route and redirect to /docs
// // const urlPath = (true ? window.location.hash.replace(/^#\//, "/") : window.location.pathname) || "/";

// // console.log("Current URL Path:", urlPath);
