import { DivElement, SpanElement } from "typecomposer";

interface RoadmapData {
  id: string;
  title: string;
  cards: Card[];
}

interface Card {
  header: {
    title: string;
  };
  body: string[];
}

export class Roadmap extends DivElement {
  constructor(
    readonly data: RoadmapData[]
  ) {
    super({ className: `flex justify-center gap-2 h-[500px] overflow-x-auto overflow-y-hidden p-4 scrollbar-hide` });
    for (const section of this.data) {
        const sectionDiv = new DivElement({ className: "flex-shrink-0 min-w-80 border border-gray-300 rounded-xl p-4 m-5 overflow-y-auto scrollbar-hide" });
        sectionDiv.append(new SpanElement({ className: "text-lg font-semibold mb-4 block border-b pb-2 text-gray-800 dark:text-gray-200", innerText: section.title }));
        this.appendChild(sectionDiv);
        for (const card of section.cards) {
            sectionDiv.appendChild(new CardElement(card));
        }
    }
  }
}

class CardElement extends DivElement {
  constructor(readonly card: Card) {
    super({
      className:
        "card border border-gray-200 rounded p-3 mb-5 bg-white shadow-sm [max-width:300px]"
    });
    this.appendChild(
      new DivElement({
        className: "card-title font-medium text-sm mb-2",
        innerText: card.header.title,
      })
    );
    for (const item of card.body) {
      this.appendChild(
        new DivElement({
          className: "card-body-item text-xs text-gray-600 mb-1",
          innerText: item,
        })
      );
    }
  }
}
