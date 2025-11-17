export type RouteType = "shortest" | "mainRoads" | "accessible";
export type EdgeKind = "normal" | "mainRoad" | "stairs" | "elevator";
export type RoomCategory =
	| "classroom"
	| "lab"
	| "facultyRoom"
	| "office"
	| "seminarHall"
	| "boardRoom"
	| "sports"
	| "library"
	| "admin"
	| "other";

export interface Node {
	id: string;
	x: number;
	y: number;
	label?: string;
}

export interface Edge {
	from: string;
	to: string;
	weight: number;
	kind?: EdgeKind;
}

export interface Building {
	id: string;
	name: string;
}

export interface Room {
	id: string;
	buildingId: string;
	roomNumber: string;
	name: string;
	category: RoomCategory;
	floor: number;
	anchorNodeId: string;
}
