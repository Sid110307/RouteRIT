export type RouteType = "shortest" | "mainRoads" | "accessible";
export type EdgeKind = "normal" | "mainRoad" | "stairs" | "elevator";

export interface Node {
	id: string;
	x: number;
	y: number;
	label?: string;
}

export interface Edge {
	id: string;
	from: string;
	to: string;
	weight: number;
	kind?: EdgeKind;
}

export interface Building {
	id: string;
	name: string;
}
