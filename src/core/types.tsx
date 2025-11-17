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
export type PersonRole = "student" | "faculty" | "researcher" | "club";

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

export interface Lab {
	id: string;
	name: string;
	department: string;
	buildingId: string;
	roomId?: string;
	tags: string[];
}

export interface Person {
	id: string;
	name: string;
	role: PersonRole;
	department: string;
	title?: string;
	interests: string[];
	labId?: string;
	lookingFor?: string;
}
