import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useRouteState } from "@/core/state";

const RouteOptions = () => {
	const routeType = useRouteState(s => s.routeType);
	const setRouteType = useRouteState(s => s.setRouteType);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Route options</CardTitle>
			</CardHeader>
			<CardContent className="text-sm">
				<RadioGroup
					value={routeType}
					onValueChange={setRouteType}
					className="flex flex-col gap-1.5"
				>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="shortest" id="shortest" />
						<Label htmlFor="shortest" className="text-sm cursor-pointer">
							Shortest path
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="mainRoads" id="mainRoads" />
						<Label htmlFor="mainRoads" className="text-sm cursor-pointer">
							Prefer main roads
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="accessible" id="accessible" />
						<Label htmlFor="accessible" className="text-sm cursor-pointer">
							Accessible (avoid stairs)
						</Label>
					</div>
				</RadioGroup>
			</CardContent>
		</Card>
	);
};

export default RouteOptions;
