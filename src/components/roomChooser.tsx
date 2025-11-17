import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { rooms } from "@/core/data";
import { useRouteState } from "@/core/state";
import { RoomCategory } from "@/core/types";

const categoryLabels: Record<RoomCategory | "all", string> = {
	all: "All",
	classroom: "Classrooms",
	lab: "Labs",
	facultyRoom: "Faculty Rooms",
	office: "Offices",
	seminarHall: "Seminar Halls",
	boardRoom: "Board Rooms",
	sports: "Sports Facilities",
	library: "Libraries",
	admin: "Admin Rooms",
	other: "Other",
};

const RoomChooser = () => {
	const startBuildingId = useRouteState(s => s.startBuildingId);
	const endBuildingId = useRouteState(s => s.endBuildingId);
	const startRoomId = useRouteState(s => s.startRoomId);
	const endRoomId = useRouteState(s => s.endRoomId);

	const setStartRoomId = useRouteState(s => s.setStartRoomId);
	const setEndRoomId = useRouteState(s => s.setEndRoomId);
	const [category, setCategory] = React.useState<string>("all");

	const roomsForStart = React.useMemo(
		() =>
			rooms.filter(
				r =>
					r.buildingId === startBuildingId &&
					(category === "all" || r.category === category),
			),
		[startBuildingId, category],
	);
	const roomsForEnd = React.useMemo(
		() =>
			rooms.filter(
				r =>
					r.buildingId === endBuildingId &&
					(category === "all" || r.category === category),
			),
		[endBuildingId, category],
	);

	const groupedByFloor = (list: typeof rooms) => {
		const grouped: Record<number, typeof rooms> = {};

		for (const r of list) (grouped[r.floor] ??= []).push(r);
		for (const floor of Object.keys(grouped))
			grouped[+floor].sort((a, b) =>
				a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }),
			);

		return grouped;
	};

	const startByFloor = groupedByFloor(roomsForStart);
	const endByFloor = groupedByFloor(roomsForEnd);

	const renderFloorSection = (
		floorLabel: string,
		list: typeof rooms,
		selectedId: string | null,
		onSelect: (id: string) => void,
	) => (
		<div key={floorLabel} className="mb-2">
			<div className="text-sm uppercase tracking-wide text-muted-foreground mb-1">
				{floorLabel}
			</div>
			<div className="flex flex-col gap-1">
				{list.map(r => (
					<Button
						key={r.id}
						size="sm"
						variant={selectedId === r.id ? "default" : "outline"}
						className="h-7 justify-start px-2 text-sm"
						onClick={() => onSelect(r.id)}
					>
						<span className="font-mono mr-1">{r.roomNumber}</span>
						<span className="truncate">{r.name}</span>
					</Button>
				))}
			</div>
		</div>
	);

	const renderRoomScroll = (
		roomsList: typeof rooms,
		roomsByFloor: Record<number, typeof rooms>,
		roomId: string | null,
		setRoomId: (id: string) => void,
	) =>
		roomsList.length === 0 ? (
			<p className="text-sm">No rooms in this category for the selected building.</p>
		) : (
			<ScrollArea className="max-h-40 pr-2">
				{Object.entries(roomsByFloor)
					.sort(([a], [b]) => Number(a) - Number(b))
					.map(([floor, list]) =>
						renderFloorSection(
							Number(floor) === 0
								? "Ground floor"
								: Number(floor) === -1
									? "Basement"
									: `Floor ${floor}`,
							list,
							roomId ?? null,
							setRoomId,
						),
					)}
			</ScrollArea>
		);

	return (
		<Card className="flex-1">
			<CardHeader>
				<CardTitle className="text-base">Choose rooms (optional)</CardTitle>
			</CardHeader>
			<CardContent className="text-sm text-muted-foreground space-y-3">
				<Tabs value={category} onValueChange={setCategory}>
					{Object.entries(categoryLabels).map((_, index) =>
						index % 3 === 0 ? (
							<TabsList key={index}>
								{Object.entries(categoryLabels)
									.slice(index, index + 3)
									.map(([catIdInner, labelInner]) => (
										<TabsTrigger
											key={catIdInner}
											value={catIdInner}
											className="text-sm"
										>
											{labelInner}
										</TabsTrigger>
									))}
							</TabsList>
						) : null,
					)}
					<TabsContent value={category} className="mt-2 space-y-3">
						<div>
							<div className="font-medium text-foreground mb-1">From room</div>
							{!startBuildingId ? (
								<p className="text-sm">
									Select a <span className="font-semibold">From</span> building
									first.
								</p>
							) : (
								renderRoomScroll(
									roomsForStart,
									startByFloor,
									startRoomId,
									setStartRoomId,
								)
							)}
						</div>
						<div>
							<div className="font-medium text-foreground mb-1">To room</div>
							{!endBuildingId ? (
								<p className="text-sm">
									Select a <span className="font-semibold">To</span> building
									first.
								</p>
							) : (
								renderRoomScroll(roomsForEnd, endByFloor, endRoomId, setEndRoomId)
							)}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
};

export default RoomChooser;
