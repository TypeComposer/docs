import { CodeComponent } from "@/components/code/CodeComponent";
import { SpanElement, H1Element, ParagraphElement, TableElement } from "typecomposer";
import { BaseView } from "../elements/Base";

export class RefDocView extends BaseView {
	constructor() {
		super();
		this.append(new SpanElement({ innerText: "TypeComposer ∙ Ref" }));

		this.append(new H1Element({ innerText: "Overview" }));
		this.append(new ParagraphElement({
			innerText: "In TypeComposer, `ref` is a reactive reference system used to track and manage state. It wraps primitive values, objects, and collections, allowing automatic updates in dependent components when the value changes."
		}));

		this.append(new H1Element({ innerText: "1. Key Features" }));
		this.append(new ParagraphElement({ innerText: "- Supports primitive values (`string`, `number`, `boolean`)." }));
		this.append(new ParagraphElement({ innerText: "- Supports complex types such as `Array`, `Map`, `Set`, and objects." }));
		this.append(new ParagraphElement({ innerText: "- Automatically tracks dependencies and triggers updates." }));
		this.append(new ParagraphElement({ innerText: "- Provides `subscribe()` and `unsubscribe()` methods for reactivity." }));
		this.append(new ParagraphElement({ innerText: "- Supports computed values with `computed()`." }));

		this.append(new H1Element({ innerText: "2. Creating a Ref" }));
		this.append(new ParagraphElement({
			innerText: "A `ref` can be created using the `ref()` function. The provided value is wrapped in a reactive reference that can be accessed via `.value`."
		}));

		this.append(new H1Element({ innerText: "3. Example Usage" }));
		this.append(new CodeComponent({
			code: `import { ref } from "typecomposer";

const count = ref(0);
console.log(count.value); // 0

count.value = 5;
console.log(count.value); // 5`
		}));

		this.append(new H1Element({ innerText: "4. Reactive Data Types" }));
		this.append(new TableElement({
			headers: ["Type", "Ref Type", "Description", "Example"],
			rows: [
				["string", "RefString", "Reactive string reference.", `const name = ref("John");`],
				["number", "RefNumber", "Reactive number reference.", `const age = ref(30);`],
				["boolean", "RefBoolean", "Reactive boolean reference.", `const isActive = ref(true);`],
				["Array<T>", "RefList<T>", "Reactive array reference.", `const list = ref(["a", "b", "c"]);`],
				["Map<K, V>", "RefMap<K, V>", "Reactive map reference.", `const map = ref(new Map());`],
				["Set<T>", "RefSet<T>", "Reactive set reference.", `const set = ref(new Set());`],
				["Object", "RefObject<T>", "Reactive object reference.", `const obj = ref({ key: "value" });`]
			],
			className: "border border-gray-300"
		}));

		this.append(new H1Element({ innerText: "5. Example with Reactive Objects" }));
		this.append(new CodeComponent({
			code: `const data = ref({
  history: "hash",
  ob: { tes: "test" }
});

console.log(data.value.history); // "hash"
data.value.history = "history";
console.log(data.value.history); // "history"`
		}));

		this.append(new H1Element({ innerText: "6. Using Ref as a List" }));
		this.append(new ParagraphElement({
			innerText: "Refs can also be used to manage reactive lists. The `.value` property is still required when modifying the array."
		}));
		this.append(new CodeComponent({
			code: `const l = ref(["a", "b"]);

// Adding a new element to the list
l.value.push("c");

console.log(l.value); // ["a", "b", "c"]`
		}));

		this.append(new H1Element({ innerText: "7. Computed Properties" }));
		this.append(new ParagraphElement({
			innerText: "The `computed()` function allows creating reactive derived values based on existing refs."
		}));
		this.append(new CodeComponent({
			code: `import { computed, ref } from "typecomposer";

const num = ref(5);
const squared = computed(() => num.value * num.value, [num]);

console.log(squared.value); // 25

num.value = 10;
console.log(squared.value); // 100`
		}));

		this.append(new H1Element({ innerText: "8. Subscribing to Changes" }));
		this.append(new ParagraphElement({
			innerText: "Refs support subscriptions to reactively track changes."
		}));
		this.append(new CodeComponent({
			code: `const count = ref(0);

count.subscribe((newValue) => {
  console.log("Updated:", newValue);
});

count.value = 10; // Logs: "Updated: 10"`
		}));

		this.append(new H1Element({ innerText: "9. Unsubscribing from Changes" }));
		this.append(new CodeComponent({
			code: `const name = ref("Alice");

const logName = (value) => {
  console.log("Name changed to:", value);
}

name.subscribe(logName);
name.value = "Bob"; // Logs: "Name changed to: Bob"

name.unsubscribe(logName);
name.value = "Charlie"; // No log output`
		}));

		this.append(new H1Element({ innerText: "10. Default Behavior" }));
		this.append(new ParagraphElement({ innerText: "- `ref` wraps a value and makes it reactive." }));
		this.append(new ParagraphElement({ innerText: "- `.value` must be used to access or modify the wrapped value." }));
		this.append(new ParagraphElement({ innerText: "- Changes in a `ref` trigger updates to subscribed functions or components." }));

		this.append(new H1Element({ innerText: "11. When to Use `ref`" }));
		this.append(new ParagraphElement({ innerText: "- When managing reactive state in components." }));
		this.append(new ParagraphElement({ innerText: "- When tracking changes to primitive values, objects, or collections." }));
		this.append(new ParagraphElement({ innerText: "- When computing derived values that should update reactively." }));

		this.append(new H1Element({ innerText: "Conclusion" }));
		this.append(new ParagraphElement({
			innerText: "The `ref` system in TypeComposer provides a simple and efficient way to manage reactivity. With support for primitive and complex data structures, `ref` enables seamless state management and automatic updates across components."
		}));
	}
}
