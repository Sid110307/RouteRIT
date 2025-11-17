import React from "react";

import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getPersonLocation } from "@/core/algo";
import { buildings, labs, people, rooms } from "@/core/data";
import { useRouteState } from "@/core/state";

const deptFilters = ["All", "CSE", "ECE", "Civil"] as const;
type DeptFilter = (typeof deptFilters)[number];

const ConnectView = () => {
	const [query, setQuery] = React.useState("");
	const [dept, setDept] = React.useState<DeptFilter>("All");
	const [tagFilter, setTagFilter] = React.useState<string | null>(null);

	const tags = React.useMemo(() => {
		const t = new Set<string>();

		labs.forEach(l => l.tags.forEach(tag => t.add(tag)));
		people.forEach(p => p.interests.forEach(tag => t.add(tag)));

		return Array.from(t).sort();
	}, []);

	const filteredPeople = React.useMemo(() => {
		return people.filter(p => {
			if (dept !== "All" && p.department !== dept) return false;
			if (tagFilter && !p.interests.includes(tagFilter)) return false;
			if (!query.trim()) return true;

			const q = query.toLowerCase();
			return (
				p.name.toLowerCase().includes(q) ||
				(p.title?.toLowerCase().includes(q) ?? false) ||
				p.interests.some(t => t.toLowerCase().includes(q))
			);
		});
	}, [dept, tagFilter, query]);

	const labById = React.useMemo(() => Object.fromEntries(labs.map(l => [l.id, l])), []);
	const buildingById = React.useMemo(() => Object.fromEntries(buildings.map(b => [b.id, b])), []);
	const roomById = React.useMemo(() => Object.fromEntries(rooms.map(r => [r.id, r])), []);

	return (
		<div className="flex flex-col gap-4 h-full">
			<motion.div
				initial={{ opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.2 }}
			>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Filters & Search</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3 text-sm text-muted-foreground">
						<div className="flex flex-col sm:flex-row gap-2">
							<Input
								placeholder="Search by name, interest, topic..."
								value={query}
								onChange={e => setQuery(e.target.value)}
								className="sm:flex-1"
							/>
						</div>
						<div className="flex flex-wrap gap-2 items-center">
							<span className="text-xs uppercase tracking-wide text-muted-foreground">
								Department
							</span>
							{deptFilters.map(d => (
								<Badge
									key={d}
									variant={dept === d ? "default" : "outline"}
									className="cursor-pointer text-sm"
									onClick={() => setDept(d)}
								>
									{d}
								</Badge>
							))}
						</div>
						<div className="flex flex-wrap gap-2 items-center">
							<span className="text-xs uppercase tracking-wide text-muted-foreground">
								Interests
							</span>
							<Badge
								variant={tagFilter === null ? "default" : "outline"}
								className="cursor-pointer text-sm"
								onClick={() => setTagFilter(null)}
							>
								All
							</Badge>
							{tags.map(tag => (
								<Badge
									key={tag}
									variant={tagFilter === tag ? "default" : "outline"}
									className="cursor-pointer text-sm"
									onClick={() =>
										setTagFilter(prev => (prev === tag ? null : tag))
									}
								>
									{tag}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>
			<Card className="flex-1 min-h-0">
				<CardHeader className="pb-2">
					<CardTitle className="text-base">People & Labs</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<ScrollArea className="h-[480px] px-4 pb-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-auto">
							{filteredPeople.length === 0 ? (
								<p className="text-xs text-muted-foreground pt-2">
									No results found.
								</p>
							) : (
								filteredPeople.map(p => {
									const lab = p.labId ? labById[p.labId] : undefined;
									const building = lab ? buildingById[lab.buildingId] : undefined;
									const room = lab?.roomId ? roomById[lab.roomId] : undefined;

									return (
										<Card key={p.id} className="border border-border/60">
											<CardContent className="px-3 text-xs space-y-1.5">
												<div className="flex justify-between items-center gap-2">
													<div>
														<div className="font-medium text-foreground">
															{p.name}
														</div>
														<div className="text-sm text-muted-foreground">
															{p.title
																? `${p.title} | ${p.department}`
																: p.department}
														</div>
													</div>
													<Badge
														variant="outline"
														className="text-xs capitalize"
													>
														{p.role}
													</Badge>
												</div>
												{p.lookingFor && (
													<div className="text-sm">
														<span className="font-semibold">
															Looking for:
														</span>{" "}
														{p.lookingFor}
													</div>
												)}
												{lab && (
													<div className="text-sm">
														<span className="font-semibold">Lab:</span>{" "}
														{lab.name}
														{building && (
															<>
																{" "}
																| <span>{building.name}</span>
															</>
														)}
														{room && <> | Room {room.roomNumber}</>}
													</div>
												)}
												<div className="flex flex-wrap gap-1 pt-1">
													{p.interests.map(tag => (
														<Badge
															key={tag}
															variant="outline"
															className="text-xs"
														>
															{tag}
														</Badge>
													))}
												</div>
												<div className="pt-2">
													<Button
														size="sm"
														className="text-xs"
														onClick={() => {
															const loc = getPersonLocation(p);
															if (!loc) return;

															useRouteState
																.getState()
																.setRouteToPersonNode(loc.nodeId);
														}}
													>
														Go to Location
													</Button>
												</div>
											</CardContent>
										</Card>
									);
								})
							)}
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
};

export default ConnectView;
