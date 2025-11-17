import { buildingAnchors, edges, labs, nodes, rooms } from "@/core/data";
import { EdgeKind, Person, RouteType } from "@/core/types";

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
const adjacency = (() => {
	const adj: Record<string, { to: string; weight: number; kind?: EdgeKind }[]> = {};
	for (const n of nodes) adj[n.id] = [];
	for (const e of edges) {
		adj[e.from].push({ to: e.to, weight: e.weight, kind: e.kind });
		adj[e.to].push({ to: e.from, weight: e.weight, kind: e.kind });
	}

	return adj;
})();

const heuristic = (aId: string, bId: string): number => {
	const dx = nodeById[aId].x - nodeById[bId].x;
	const dy = nodeById[aId].y - nodeById[bId].y;

	return Math.sqrt(dx * dx + dy * dy);
};

const edgeCost = (baseWeight: number, kind: EdgeKind | undefined, routeType: RouteType): number => {
	let w = baseWeight;

	if (routeType === "mainRoads") w *= kind === "mainRoad" ? 0.7 : 1.3;
	if (routeType === "accessible") w *= kind === "stairs" ? 2.0 : kind === "elevator" ? 0.8 : 1.0;

	return w;
};

export const findPath = (startId: string, goalId: string, routeType: RouteType = "shortest") => {
	if (startId === goalId) return [startId];

	const openSet = new Set<string>([startId]);
	const cameFrom: Record<string, string | undefined> = {};
	const gScore: Record<string, number> = {};
	const fScore: Record<string, number> = {};

	for (const n of nodes) {
		gScore[n.id] = Infinity;
		fScore[n.id] = Infinity;
	}
	gScore[startId] = 0;
	fScore[startId] = heuristic(startId, goalId);

	const getLowestF = (): string | null => {
		let best: string | null = null;
		let bestScore = Infinity;

		for (const id of openSet)
			if (fScore[id] < bestScore) {
				bestScore = fScore[id];
				best = id;
			}
		return best;
	};

	while (openSet.size > 0) {
		const current = getLowestF();
		if (!current) break;

		if (current === goalId) {
			const path: string[] = [current];
			let c = current;

			while (cameFrom[c]) {
				c = cameFrom[c] as string;
				path.unshift(c);
			}
			return path;
		}

		openSet.delete(current);
		for (const { to, weight, kind } of adjacency[current]) {
			const cost = edgeCost(weight, kind, routeType);
			const tentativeG = gScore[current] + cost;

			if (tentativeG < gScore[to]) {
				cameFrom[to] = current;
				gScore[to] = tentativeG;
				fScore[to] = tentativeG + heuristic(to, goalId);

				openSet.add(to);
			}
		}
	}

	return null;
};

export const getPersonLocation = (person: Person) => {
	if (!person.labId) return null;

	const lab = labs.find(l => l.id === person.labId);
	if (!lab) return null;

	if (lab.roomId) {
		const room = rooms.find(r => r.id === lab.roomId);
		if (room)
			return { nodeId: room.anchorNodeId, buildingId: lab.buildingId, roomId: lab.roomId };
	}

	const nodeId = buildingAnchors[lab.buildingId];
	if (!nodeId) return null;

	return { nodeId, buildingId: lab.buildingId, roomId: null };
};
