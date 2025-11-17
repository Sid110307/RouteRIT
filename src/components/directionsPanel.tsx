import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useRouteState } from "@/core/state";

const DirectionsPanel = () => {
	const { getDirections, getRouteLength } = useRouteState();

	const directions = getDirections();
	const routeLength = getRouteLength();

	return (
		<Card className="flex-1">
			<CardHeader className="gap-0">
				<CardTitle className="text-base">Directions</CardTitle>
				{directions.length > 0 && (
					<CardDescription>
						<strong>Distance:</strong> ~{routeLength.toFixed(0)} meters
					</CardDescription>
				)}
			</CardHeader>
			<CardContent className="text-sm flex flex-col gap-2">
				{directions.length === 0 ? (
					<p className="text-center text-muted-foreground">
						No route yet. Choose location and press <strong>Find route</strong>.
					</p>
				) : (
					<ScrollArea className="max-h-40 pr-2 text-justify">
						<ol className="list-decimal list-inside space-y-1">
							{directions.map((d, i) => (
								<li key={i}>{d}</li>
							))}
						</ol>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
};

export default DirectionsPanel;
