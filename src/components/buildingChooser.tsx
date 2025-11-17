import React from "react";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { buildings } from "@/core/data";
import { useRouteState } from "@/core/state";

const BuildingChooser = () => {
	const { startBuildingId, endBuildingId, setStartBuildingId, setEndBuildingId, computeRoute } =
		useRouteState();
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.25 }}
		>
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Choose buildings</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					<div className="flex gap-1.5">
						<Label className="text-sm w-10">From:</Label>
						<Select
							value={startBuildingId ?? ""}
							onValueChange={value => setStartBuildingId(value === "" ? null : value)}
						>
							<SelectTrigger className="h-8 text-sm">
								<SelectValue placeholder="Select starting point" />
							</SelectTrigger>
							<SelectContent className="text-sm">
								{buildings.map(b => (
									<SelectItem key={b.id} value={b.id}>
										{b.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex gap-1.5">
						<Label className="text-sm w-10">To:</Label>
						<Select
							value={endBuildingId ?? ""}
							onValueChange={value => setEndBuildingId(value === "" ? null : value)}
						>
							<SelectTrigger className="h-8 text-sm">
								<SelectValue placeholder="Select destination" />
							</SelectTrigger>
							<SelectContent className="text-sm">
								{buildings.map(b => (
									<SelectItem key={b.id} value={b.id}>
										{b.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<Button size="sm" className="mt-1 w-full text-sm" onClick={computeRoute}>
						Find route
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default BuildingChooser;
