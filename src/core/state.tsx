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
		const { routeNodes } = get();
		if (routeNodes.length === 0) return [];

		const dirs: string[] = [];
		for (let i = 0; i < routeNodes.length - 1; ++i) {
			const a = nodeById[routeNodes[i]];
			const b = nodeById[routeNodes[i + 1]];

			dirs.push(`Walk from ${a.label ?? a.id} to ${b.label ?? b.id}`);
		}

		return dirs;
	},
}));
