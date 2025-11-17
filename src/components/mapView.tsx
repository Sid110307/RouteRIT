import React from "react";

import { motion } from "motion/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { nodes } from "@/core/data";
import { useRouteState } from "@/core/state";

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
const MapView = () => {
	const routeNodes = useRouteState(s => s.routeNodes);
	const points = React.useMemo(() => {
		if (!routeNodes || routeNodes.length < 2) return "";
		return routeNodes.map(id => `${nodeById[id].x},${nodeById[id].y}`).join(" ");
	}, [routeNodes]);

	return (
		<Card className="flex-1 pb-0">
			<CardHeader>
				<CardTitle className="text-base">Campus map (schematic)</CardTitle>
			</CardHeader>
			<CardContent className="relative aspect-[3/2] rounded-xl overflow-hidden p-0">
				<svg
					viewBox="0 0 480 320"
					className="w-full h-full"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect width="480" height="320" fill="#020617" />
					<rect x="210" y="120" width="70" height="40" rx="4" fill="#1d4ed8" />
					<text x="215" y="135" fontSize="10" fill="#e5e7eb">
						ESB
					</text>
					<rect x="290" y="140" width="70" height="40" rx="4" fill="#b91c1c" />
					<text x="295" y="155" fontSize="10" fill="#e5e7eb">
						Library
					</text>
					<rect x="330" y="200" width="70" height="40" rx="4" fill="#16a34a" />
					<text x="335" y="215" fontSize="10" fill="#e5e7eb">
						CSE
					</text>
					{nodes.map(n => (
						<motion.circle
							key={n.id}
							cx={n.x}
							cy={n.y}
							r={4}
							stroke="#e5e7eb"
							strokeWidth={1}
							fill="#020617"
							initial={{ scale: 0, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.2, delay: 0.02 }}
						/>
					))}
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
				</svg>
			</CardContent>
		</Card>
	);
};

export default MapView;
