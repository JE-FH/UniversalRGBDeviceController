import { Dragifier } from "../SVGCompositor/behavior/Dragifier";
import { SVGCompositor } from "../SVGCompositor/SVGCompositor";
import { ToolWindow } from "../SVGCompositor/ToolWindow";
import { CreateWidget2 as CW } from "../SVGCompositor/WidgetConstructor";
import { FlexBox } from "../SVGCompositor/widgets/FlexBox";
import { PaddedContainer, padding } from "../SVGCompositor/widgets/PaddedContainer";
import { Orientation, StackPanel } from "../SVGCompositor/widgets/StackPanel";
import { TextWidget } from "../SVGCompositor/widgets/TextWidget";
import { GraphNode } from "./GraphNode";
import { TriggerNode, TriggerType } from "./TriggerNode";
import { ActionNode } from "./ActionNode";
import { TextInputWidget } from "../SVGCompositor/widgets/TextInputWidget";

interface IGraphEditorService {
	createTriggerNode(triggerType: TriggerType): void;
	createActionNode(name: string): void;
	connectTriggerToEvent(from: TriggerNode): ActionNode;
}

interface TriggerActionEdge {
	trigger: TriggerNode;
	action: ActionNode;
}

export class GraphEditor implements IGraphEditorService {
	private compositor: SVGCompositor;
	private graph_nodes: GraphNode[];
	private tool_window: ToolWindow;
	private trigger_type: TriggerType[];
	private trigger_display_sp: StackPanel;
	private trigger_action_edges: TriggerActionEdge[];

	constructor(compositor: SVGCompositor, tool_window: ToolWindow) {
		this.tool_window = tool_window;
		this.compositor = compositor;
		this.graph_nodes = [];
		this.trigger_type = [];
		this.trigger_action_edges = [];
		this.trigger_display_sp = CW(StackPanel, { orientation: Orientation.VERTICAL, item_spacing: 10 },
			CW(TextWidget, { text: "Available nodes", classes: ["click-through"] })
		);
		let padded_container = CW(PaddedContainer, { padding: padding(10), background: { classes: ["node-toolbox"] } },
			this.trigger_display_sp
		);

		let dragifier = new Dragifier(padded_container);
		padded_container.Clicked.add_listener((ev) => {
			dragifier.drag(ev);
        })

		this.compositor.add(padded_container);

		let actionCreator = CW(StackPanel, { orientation: Orientation.VERTICAL, item_spacing: 10 },
			CW(TextWidget, { text: "Create event node", classes: ["click-through"] })
		);

		let paddedActionCreatorContainer = CW(PaddedContainer, { padding: padding(10), background: { classes: ["node-toolbox"] } },
			actionCreator
		);
		let dragifier2 = new Dragifier(paddedActionCreatorContainer);
		paddedActionCreatorContainer.Clicked.add_listener((ev) => {
			dragifier2.drag(ev);
        })

		let inputWidget = actionCreator.add(CW(TextInputWidget, { width: 150 }));

		let button = actionCreator.add(CW(PaddedContainer, { padding: padding(5), background: { classes: ["debug-button"] } },
			CW(TextWidget, { text: "Create" })
		));

		button.Clicked.add_listener((ev) => {
			this.createActionNode(inputWidget.TextValue);
		});

		this.compositor.add(paddedActionCreatorContainer);
	}

    createActionNode(name: string): void {
		let actionNode = new ActionNode(this.compositor, name, true);
		this.graph_nodes.push(actionNode);
		this.tool_window.update();
    }

	connectTriggerToEvent(from: TriggerNode): ActionNode {
        throw new Error("Method not implemented.");
    }

	createTriggerNode(triggerType: TriggerType): void {
		let node = TriggerNode.from_trigger_type(this.compositor, triggerType.name, triggerType, true, false);
		this.graph_nodes.push(node);
		this.tool_window.update();
    }

	public add_trigger_type(trigger_type: TriggerType) {
		this.trigger_type.push(trigger_type);

		TriggerNode.from_trigger_type(this.trigger_display_sp, trigger_type.name, trigger_type, false, true);
		let button = CW(PaddedContainer, { padding: padding(5), background: { classes: ["debug-button"] } },
			CW(TextWidget, {text: "Add"})
		);
		button.Clicked.add_listener((ev) => {
			this.createTriggerNode(trigger_type);
		})
		this.trigger_display_sp.add(button);

		this.tool_window.update();
	}
}