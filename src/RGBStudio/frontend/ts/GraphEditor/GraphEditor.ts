import { SVGCompositor } from "../SVGCompositor/SVGCompositor";
import { GraphNode } from "./GraphNode";

export class GraphEditor {
	private compositor: SVGCompositor;
	private graph_nodes: GraphNode[];
	

	constructor(display_svg: SVGSVGElement) {
		this.compositor = new SVGCompositor(display_svg);
		this.graph_nodes = [];
	}
}