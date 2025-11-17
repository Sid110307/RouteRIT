import React from "react";

import { motion } from "motion/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { nodes } from "@/core/data";
import { useRouteState } from "@/core/state";

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
const MapView = () => {
	const routeNodes = useRouteState(s => s.routeNodes);

	const startNodeId = routeNodes && routeNodes.length > 0 ? routeNodes[0] : null;
	const endNodeId =
		routeNodes && routeNodes.length > 1 ? routeNodes[routeNodes.length - 1] : null;

	const points = React.useMemo(() => {
		if (!routeNodes || routeNodes.length < 2) return "";
		return routeNodes.map(id => `${nodeById[id].x},${nodeById[id].y}`).join(" ");
	}, [routeNodes]);
	const routeNodeSet = React.useMemo(() => new Set(routeNodes ?? []), [routeNodes]);

	return (
		<Card className="flex-1 pb-0">
			<CardHeader>
				<CardTitle className="text-base">Campus map (schematic)</CardTitle>
			</CardHeader>
			<CardContent className="relative rounded-xl overflow-hidden p-0">
				<svg
					viewBox="0 0 480 320"
					className="w-full h-full"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width="480" height="320" fill="#020617" />
					<g opacity={0.1}>
						{Array.from({ length: 10 }).map((_, i) => (
							<line
								key={`v-${i}`}
								x1={(i + 1) * 48}
								y1={0}
								x2={(i + 1) * 48}
								y2={320}
								stroke="#64748b"
								strokeWidth={0.3}
							/>
						))}
						{Array.from({ length: 6 }).map((_, i) => (
							<line
								key={`h-${i}`}
								x1={0}
								y1={(i + 1) * 53.3}
								x2={480}
								y2={(i + 1) * 53.3}
								stroke="#64748b"
								strokeWidth={0.3}
							/>
						))}
					</g>
					{points && (
						<motion.polyline
							points={points}
							fill="none"
							stroke="#facc15"
							strokeWidth={4}
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeDasharray="8 6"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						/>
					)}
					{nodes.map(n => {
						const isOnRoute = routeNodeSet.has(n.id);
						const isStart = n.id === startNodeId;
						const isEnd = n.id === endNodeId;

						let fill = "#020617";
						let stroke = "#e5e7eb";
						let r = 4;
						let opacity = isOnRoute ? 1 : 0.4;

						if (isStart) {
							fill = "#22c55e";
							stroke = "#bbf7d0";
							r = 5;
							opacity = 1;
						} else if (isEnd) {
							fill = "#ef4444";
							stroke = "#fecaca";
							r = 5;
							opacity = 1;
						}

						return (
							<Tooltip key={n.id}>
								<TooltipTrigger asChild>
									<motion.circle
										cx={n.x}
										cy={n.y}
										r={r}
										stroke={stroke}
										strokeWidth={1}
										fill={fill}
										initial={{ scale: 0, opacity: 0 }}
										animate={{ scale: 1, opacity }}
										transition={{ duration: 0.2, delay: 0.02 }}
									/>
								</TooltipTrigger>
								<TooltipContent>
									{isStart ? "Start: " : isEnd ? "End: " : "Node: "}
									{n.label}
								</TooltipContent>
							</Tooltip>
						);
					})}
				</svg>
			</CardContent>
		</Card>
	);
};

export default MapView;
