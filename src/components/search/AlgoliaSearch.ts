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
  private searchBoxDiv: DivElement;
  private hitsDiv: DivElement;

  constructor() {
    super({
      className: "algolia-search-container",
    });

    // Create container for search
    this.searchContainer = new DivElement({
      className: "search-wrapper",
    });

    // Create search elements with unique IDs
    this.searchBoxDiv = new DivElement({ id: "searchbox" });
    this.hitsDiv = new DivElement({ id: "hits" });

    this.searchContainer.append(this.searchBoxDiv, this.hitsDiv);
    this.append(this.searchContainer);
  }

  onInit(): void {
    // Wait for next tick to ensure DOM is ready
    setTimeout(() => this.initializeSearch(), 0);
  }

  private initializeSearch(): void {
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
