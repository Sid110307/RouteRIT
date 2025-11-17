import { create } from "zustand";

import { findPath } from "@/core/algo";
import { buildingAnchors, edges, nodes, rooms } from "@/core/data";
import type { Room, RouteType } from "@/core/types";

interface RouteState {
	startBuildingId: string | null;
	endBuildingId: string | null;
	startNodeId: string | null;
	endNodeId: string | null;
	startRoomId: string | null;
	endRoomId: string | null;
	routeNodes: string[];
	routeType: RouteType;
	mode: "connect" | "navigate";

	setStartBuildingId: (id: string | null) => void;
	setEndBuildingId: (id: string | null) => void;
	setStartNodeId: (id: string | null) => void;
	setEndNodeId: (id: string | null) => void;
	setStartRoomId: (id: string | null) => void;
	setEndRoomId: (id: string | null) => void;
	setRouteType: (type: RouteType) => void;
	setMode: (mode: "connect" | "navigate") => void;

	computeRoute: () => void;
	getRouteLength: () => number;
	getDirections: () => string[];
	setRouteToPersonNode(nodeId: string): void;
}

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
const roomById = Object.fromEntries(rooms.map(r => [r.id, r])) as Record<string, Room | undefined>;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

const turnAngle = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => {
	const angle1 = Math.atan2(by - ay, bx - ax);
	const angle2 = Math.atan2(cy - by, cx - bx);

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
	startRoomId: null,
	endRoomId: null,
	startNodeId: null,
	endNodeId: null,
	routeNodes: [],
	routeType: "shortest",
	mode: "connect",

	setStartBuildingId: id => set({ startBuildingId: id }),
	setEndBuildingId: id => set({ endBuildingId: id }),
	setStartNodeId: id => set({ startNodeId: id }),
	setEndNodeId: id => set({ endNodeId: id }),
	setStartRoomId: id => {
		const room = id ? roomById[id] : null;
		set({ startRoomId: id, startBuildingId: room?.buildingId ?? null });
	},
	setEndRoomId: id => {
		const room = id ? roomById[id] : null;
		set({ endRoomId: id, endBuildingId: room?.buildingId ?? null });
	},
	setRouteType: type => set({ routeType: type }),
	setMode: mode => set({ mode }),

	computeRoute: () => {
		const {
			startBuildingId,
			endBuildingId,
			startRoomId,
			endRoomId,
			startNodeId,
			endNodeId,
			routeType,
		} = get();

		let startNode: string | undefined = startNodeId ?? undefined;
		let endNode: string | undefined = endNodeId ?? undefined;

		if (!startNode && !startBuildingId && !startRoomId) return;
		if (!endNode && !endBuildingId && !endRoomId) return;

		if (!startNode) {
			if (startRoomId) startNode = roomById[startRoomId]?.anchorNodeId;
			else if (startBuildingId) startNode = buildingAnchors[startBuildingId];
		}
		if (!endNode) {
			if (endRoomId) endNode = roomById[endRoomId]?.anchorNodeId;
			else if (endBuildingId) endNode = buildingAnchors[endBuildingId];
		}

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
		const { routeNodes, startBuildingId, endBuildingId, startRoomId, endRoomId } = get();
		if (routeNodes.length === 0) return [];

		const dirs: string[] = [];
		const startRoom = startRoomId ? roomById[startRoomId] : null;
		const endRoom = endRoomId ? roomById[endRoomId] : null;
		const startLabel = startRoom
			? `${startRoom.buildingId.replace("B_", "")} - Room ${startRoom.roomNumber} (${startRoom.name})`
			: startBuildingId
				? startBuildingId.replace("B_", "")
				: (routeNodes[0] ?? "Start");
		const endLabel = endRoom
			? `${endRoom.buildingId.replace("B_", "")} - Room ${endRoom.roomNumber} (${endRoom.name})`
			: endBuildingId
				? endBuildingId.replace("B_", "")
				: (routeNodes[routeNodes.length - 1] ?? "Destination");

		if (routeNodes.length === 1) {
			dirs.push(`You are already at ${endLabel}.`);
			return dirs;
		}

		const secondNode = nodeById[routeNodes[1]];
		if (secondNode)
			dirs.push(
				`Start at ${startLabel} and head towards ${secondNode.label ?? secondNode.id} via ${routeNodes[0]}.`,
			);
		else dirs.push(`Start at ${startLabel}.`);

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
	setRouteToPersonNode: (nodeId: string) => {
		set({ endNodeId: nodeId, endBuildingId: null, endRoomId: null, mode: "navigate" });
		get().computeRoute();
	},
}));
