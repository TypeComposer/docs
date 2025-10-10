import { Component, DivElement, ButtonElement } from "typecomposer";
import { X, createElement } from "lucide";
import { AlgoliaSearch } from "./AlgoliaSearch";

export class SearchModal extends Component {
  private modal: DivElement;
  private backdrop: DivElement;
  private searchComponent: AlgoliaSearch;

  constructor() {
    super({
      className: "search-modal-wrapper",
      style: {
        display: "none",
      },
    });

    // Create backdrop
    this.backdrop = new DivElement({
      className: "search-modal-backdrop",
      onclick: () => this.close(),
    });

    // Create modal
    this.modal = new DivElement({
      className: "search-modal",
    });

    // Create close button
    const closeButton = new ButtonElement({
      className: "search-modal-close",
      children: [createElement(X)],
      onclick: () => this.close(),
    });

    // Create search component
    this.searchComponent = new AlgoliaSearch();

    this.modal.append(closeButton, this.searchComponent);
    this.append(this.backdrop, this.modal);
  }

  open(): void {
    this.style.display = "flex";
    document.body.style.overflow = "hidden";
    
    // Focus on search input after a small delay
    setTimeout(() => {
      const searchInput = this.querySelector<HTMLInputElement>(".ais-SearchBox-input");
      searchInput?.focus();
    }, 100);
  }

  close(): void {
    this.style.display = "none";
    document.body.style.overflow = "";
  }

  // Handle keyboard shortcuts
  onInit(): void {
    const handleKeydown = (e: KeyboardEvent) => {
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        this.open();
      }
      // Close search with Escape
      if (e.key === "Escape" && this.style.display === "flex") {
        this.close();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    // Clean up event listener on destroy
    this.addEventListener("destroy", () => {
      document.removeEventListener("keydown", handleKeydown);
    });
  }
}
