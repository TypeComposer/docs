import { DivElement, SpanElement } from "typecomposer";

export interface RoadmapData {
  id: string;
  title: string;
  description?: string;
  cards: Card[];
}

export interface Card {
  header: { title: string };
  body: string[];
  status?: "completed" | "in-progress" | "planned" | string;
  priority?: "high" | "medium" | "low" | string;
  dueDate?: string;
  tags?: string[];
}

export class Roadmap extends DivElement {
  constructor(readonly data: RoadmapData[]) {
    super({
      className: "road-map flex flex-col p-6 scrollbar-hide h-[600px] w-full max-w-7xl mx-auto",
      style: { backgroundColor: "var(--primary-background-color)" },
    });

    const timeline = new DivElement({
      className: "flex gap-6 overflow-x-auto pb-4 px-2 snap-x snaps-mandatory scrollbar-hide",
    });

    data.forEach((section) => {
      timeline.appendChild(this.createSection(section));
    });

    this.appendChild(timeline);
    setTimeout(() => (timeline.scrollLeft = timeline.scrollWidth), 0);
  }

  private createSection(section: RoadmapData): DivElement {
    const container = new DivElement({
      className:
        "flex-shrink-0 snap-start min-w-[350px] max-w-[300px] border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-y-auto max-h-[600px] roadmap-section scrollbar-hide",
    });

    container.appendChild(this.createSectionHeader(section));
    section.cards.forEach((card) => {
      container.appendChild(new CardElement(card));
    });

    return container;
  }

  private createSectionHeader(section: RoadmapData): DivElement {
    const header = new DivElement({
      className: "mb-4 pb-2 border-b roadmap-section-header",
    });

    header.appendChild(
      new SpanElement({
        className: "text-xl font-bold block roadmap-section-title",
        innerText: section.title,
      })
    );

    if (section.description) {
      header.appendChild(
        new SpanElement({
          className: "text-sm roadmap-section-description mt-1",
          innerText: section.description,
        })
      );
    }

    return header;
  }
}

class CardElement extends DivElement {
  constructor(private card: Card) {
    super({
      className: "card border-l-4 rounded p-4 mb-5 hover:shadow-md transition-shadow duration-200 roadmap-card",
    });

    this.appendChild(this.createHeader());

    if (card.priority) {
      this.appendChild(this.createPriorityBadge());
    }

    this.appendChild(this.createBody());
    this.appendChild(this.createFooter());
  }

  private createHeader(): DivElement {
    const header = new DivElement({
      className: "flex justify-between items-start mb-3",
    });

    header.appendChild(
      new DivElement({
        className: "font-bold text-md",
        style: { color: "var(--text-primary)" },
        innerText: this.card.header.title,
      })
    );

    if (this.card.status) {
      header.appendChild(
        new SpanElement({
          className: `status-badge-${this.card.status} text-xs px-2 py-1 rounded-full whitespace-nowrap`,
          innerText: this.card.status,
        })
      );
    }

    return header;
  }

  private createPriorityBadge(): SpanElement {
    const priority = this.card.priority!;
    return new SpanElement({
      className: `priority-badge-${priority} text-xs px-2 py-0.5 rounded inline-block mb-2`,
      innerText: `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`,
    });
  }

  private createBody(): DivElement {
    const container = new DivElement({ className: "mt-2" });

    this.card.body.forEach((item) => {
      container.appendChild(
        new DivElement({
          className: "flex items-start mb-2",
          children: [
            new SpanElement({
              className: "inline-block w-2 h-2 mt-1.5 mr-2 bg-gray-400 dark:bg-gray-500 rounded-full flex-shrink-0",
            }),
            new DivElement({
              className: "text-sm",
              style: { color: "var(--text-secondary)" },
              innerText: item,
            }),
          ],
        })
      );
    });

    return container;
  }

  private createFooter(): DivElement {
    const footer = new DivElement({
      className: "mt-3 pt-2 border-t flex flex-wrap gap-2",
      style: { borderColor: "var(--border-color)" },
    });

    if (this.card.dueDate) {
      footer.appendChild(this.createDueDateLabel());
    }

    if (this.card.tags?.length) {
      footer.appendChild(this.createTagsContainer());
    }

    return footer;
  }

  private createDueDateLabel(): DivElement {
    const date = new Date(this.card.dueDate!);
    const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return new DivElement({
      className: "flex items-center text-xs",
      style: { color: "var(--text-muted)" },
      innerText: `Due: ${formatted}`,
    });
  }

  private createTagsContainer(): DivElement {
    const container = new DivElement({ className: "flex flex-wrap gap-1 ml-auto" });

    this.card.tags!.forEach((tag) => {
      container.appendChild(
        new SpanElement({
          className: "text-xs px-2 py-0.5 rounded",
          style: {
            backgroundColor: "var(--secondary-background-color)",
            color: "var(--text-secondary)",
          },
          innerText: tag,
        })
      );
    });

    return container;
  }
}
