import { Component, DivElement, InputElement } from "typecomposer";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { searchBox, hits, configure } from "instantsearch.js/es/widgets";

// Algolia credentials - these should be replaced with actual values
const ALGOLIA_APP_ID = "YOUR_APP_ID";
const ALGOLIA_SEARCH_API_KEY = "YOUR_SEARCH_API_KEY";
const ALGOLIA_INDEX_NAME = "typecomposer_docs";

export class AlgoliaSearch extends Component {
  private searchInstance: any;
  private searchContainer: DivElement;

  constructor() {
    super({
      className: "algolia-search-container",
    });

    // Create container for search
    this.searchContainer = new DivElement({
      className: "search-wrapper",
    });
  }

  onInit(): void {
    // Initialize Algolia search client
    const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

    // Create InstantSearch instance
    this.searchInstance = instantsearch({
      indexName: ALGOLIA_INDEX_NAME,
      searchClient,
      insights: false,
    });

    // Configure search widgets
    this.searchInstance.addWidgets([
      configure({
        hitsPerPage: 8,
      }),

      searchBox({
        container: "#searchbox",
        placeholder: "Search documentation...",
        showReset: true,
        showSubmit: false,
        cssClasses: {
          root: "search-box-root",
          form: "search-box-form",
          input: "search-box-input",
          reset: "search-box-reset",
        },
      }),

      hits({
        container: "#hits",
        cssClasses: {
          root: "hits-root",
          list: "hits-list",
          item: "hits-item",
        },
        templates: {
          item: (hit: any, { html, components }: any) => html`
            <a href="${`#/docs/${hit.path}`}" class="hit-link">
              <div class="hit-title">${components.Highlight({ hit, attribute: "title" })}</div>
              <div class="hit-content">${components.Snippet({ hit, attribute: "content" })}</div>
            </a>
          `,
          empty: (results: any, { html }: any) => html`
            <div class="hits-empty">
              No results found for <strong>${results.query}</strong>.
            </div>
          `,
        },
      }),
    ]);

    // Create search elements
    const searchBoxDiv = new DivElement({ id: "searchbox" });
    const hitsDiv = new DivElement({ id: "hits" });

    this.searchContainer.append(searchBoxDiv, hitsDiv);
    this.append(this.searchContainer);

    // Start InstantSearch
    this.searchInstance.start();
  }

  onDestroy(): void {
    // Clean up InstantSearch instance when component is destroyed
    if (this.searchInstance) {
      this.searchInstance.dispose();
    }
  }
}
