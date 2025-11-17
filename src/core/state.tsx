import { create } from "zustand";

import { findPath } from "@/core/astar";
import { buildingAnchors, edges, nodes } from "@/core/data";
import type { RouteType } from "@/core/types";

interface RouteState {
	startBuildingId: string | null;
	endBuildingId: string | null;
	routeNodes: string[];
	routeType: RouteType;

	setStartBuildingId: (id: string | null) => void;
	setEndBuildingId: (id: string | null) => void;
	setRouteType: (type: RouteType) => void;

	computeRoute: () => void;
	getRouteLength: () => number;
	getDirections: () => string[];
}

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

const turnAngle = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => {
	const abx = bx - ax;
	const aby = by - ay;
	const bcx = cx - bx;
	const bcy = cy - by;

	const angle1 = Math.atan2(aby, abx);
	const angle2 = Math.atan2(bcy, bcx);

	let angle = toDegrees(angle2 - angle1);
	while (angle < -180) angle += 360;
	while (angle > 180) angle -= 360;

	return angle;
};

const turnText = (angle: number) => {
	const absA = Math.abs(angle);
	return absA < 20
		? "Continue straight"
		: angle > 0
			? absA < 45
				? "Slight left"
				: absA < 120
					? "Turn left"
					: "Sharp left"
			: absA < 45
				? "Slight right"
				: absA < 120
					? "Turn right"
					: "Sharp right";
};

export const useRouteState = create<RouteState>((set, get) => ({
	startBuildingId: null,
	endBuildingId: null,
	routeNodes: [],
	routeType: "shortest",

	setStartBuildingId: id => set({ startBuildingId: id }),
	setEndBuildingId: id => set({ endBuildingId: id }),
	setRouteType: type => set({ routeType: type }),

	computeRoute: () => {
		const { startBuildingId, endBuildingId, routeType } = get();
		if (!startBuildingId || !endBuildingId) return;

		const startNode = buildingAnchors[startBuildingId];
		const endNode = buildingAnchors[endBuildingId];
		if (!startNode || !endNode) return;

		set({ routeNodes: findPath(startNode, endNode, routeType) ?? [] });
	},
	getRouteLength: () => {
		const { routeNodes } = get();
		if (routeNodes.length < 2) return 0;

		let length = 0;
		for (let i = 0; i < routeNodes.length - 1; ++i) {
			const a = routeNodes[i];
			const b = routeNodes[i + 1];

			const edge = edges.find(
				e => (e.from === a && e.to === b) || (e.from === b && e.to === a),
			);
			if (edge) length += edge.weight;
		}

		return length;
	},
	getDirections: () => {
		const { routeNodes, startBuildingId, endBuildingId } = get();
		if (routeNodes.length === 0) return [];

		const dirs: string[] = [];
		const startNode = nodeById[routeNodes[0]];
		const endNode = nodeById[routeNodes[routeNodes.length - 1]];

		const startLabel = startBuildingId ?? startNode.label ?? routeNodes[0];
		const endLabel = endBuildingId ?? endNode.label ?? routeNodes[routeNodes.length - 1];

		if (routeNodes.length === 1) {
			dirs.push(`You are already at ${endLabel}.`);
			return dirs;
		}

		const secondNode = nodeById[routeNodes[1]];
		dirs.push(`Start at ${startLabel} and head towards ${secondNode.label ?? secondNode.id}.`);

		for (let i = 1; i < routeNodes.length - 1; i++) {
			const prev = nodeById[routeNodes[i - 1]];
			const curr = nodeById[routeNodes[i]];
			const next = nodeById[routeNodes[i + 1]];

			const angle = turnAngle(prev.x, prev.y, curr.x, curr.y, next.x, next.y);
			const turn = turnText(angle);

			if (turn === "Continue straight") continue;

			const targetName = next.label ?? next.id;
			dirs.push(`${turn} towards ${targetName}.`);
		}

		dirs.push(`You will reach ${endLabel}.`);
		return dirs;
	},
}));
