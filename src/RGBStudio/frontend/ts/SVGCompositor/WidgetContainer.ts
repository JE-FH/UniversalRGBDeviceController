import { Listener } from "./Event";
import { Widget, Position } from "./Widget";

export abstract class WidgetContainer extends Widget {
	private children: Widget[];
	private listeners: Map<Widget, Listener<[]>>

	constructor(relative_pos: Position) {
		super(relative_pos);
		this.children = [];
		this.listeners = new Map();
	}

	update() {
		this.children.forEach((widget) => {
			widget.update();
		})
	}

	add(widget: Widget) {
		if ((widget as any).parent != null) {
			throw new Error("Widget cannot be child of multiple parents, since its a tree structure");
		}
		
		(widget as WidgetContainer).set_parent(this);
		
		this.children.push(widget);
		widget.update();

		let listener = () => {
			this.changed_visual_tree.call();
		};

		widget.changed_visual_tree.add_listener(listener);
		this.listeners.set(widget, listener);

		this.changed_visual_tree.call();
	}

	remove(widget: Widget) {
		this.children = this.children.filter((v) => {
			(widget as WidgetContainer).set_parent(null);
			return v == widget;
		});

		let listener = this.listeners.get(widget);

		if (listener != null) {
			widget.changed_visual_tree.remove_listener(listener);
			this.listeners.delete(widget);
		}

		this.changed_visual_tree.call();
	}

	get_children(): readonly Widget[] {
		return this.children;
	}
	
	tree_walk(operation: (widget: Widget) => void): void {
		operation(this);
		this.children.forEach((widget) => {
			widget.tree_walk(operation);
		});
	}
}