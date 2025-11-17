import { Building, Edge, Node } from "@/core/types";

export const nodes: Node[] = [
	{ id: "N1", x: 80, y: 200, label: "Gate 11" },
	{ id: "N2", x: 160, y: 200, label: "Apex Block" },
	{ id: "N3", x: 240, y: 160, label: "Engineering Sciences Block" },
	{ id: "N4", x: 320, y: 180, label: "Department of Electrical Sciences Block" },
	{ id: "N5", x: 400, y: 220, label: "Lecture Hall Complex" },
	{ id: "N6", x: 280, y: 260, label: "Multipurpose Block" },
];

export const edges: Edge[] = [
	{ id: "E1", from: "N1", to: "N2", weight: 100, kind: "mainRoad" },
	{ id: "E2", from: "N2", to: "N3", weight: 90, kind: "normal" },
	{ id: "E3", from: "N3", to: "N4", weight: 85, kind: "stairs" },
	{ id: "E4", from: "N4", to: "N5", weight: 95, kind: "normal" },
	{ id: "E5", from: "N2", to: "N6", weight: 120, kind: "elevator" },
	{ id: "E6", from: "N6", to: "N5", weight: 80, kind: "normal" },
];

export const buildings: Building[] = [
	{ id: "B1", name: "Apex Block" },
	{ id: "B2", name: "Engineering Sciences Block" },
	{ id: "B3", name: "Department of Electrical Sciences Block" },
	{ id: "B4", name: "Lecture Hall Complex" },
	{ id: "B5", name: "Multipurpose Block" },
];

export const buildingAnchors: { [key: string]: string } = {
	B1: "N2",
	B2: "N3",
	B3: "N4",
	B4: "N5",
	B5: "N6",
};
