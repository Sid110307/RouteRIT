import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useRouteState } from "@/core/state";

const DirectionsPanel = () => {
	const getDirections = useRouteState(state => state.getDirections);
	const getRouteLength = useRouteState(state => state.getRouteLength);

	const directions = getDirections();
	const length = getRouteLength();

	return (
		<Card className="flex-1">
			<CardHeader>
				<CardTitle className="text-base">Directions</CardTitle>
			</CardHeader>
			<CardContent className="text-sm flex flex-col gap-2">
				{directions.length === 0 ? (
					<p className="text-center text-muted-foreground">
						No route yet. Choose location and press <strong>Find route</strong>.
					</p>
				) : (
					<>
						<p className="text-center">
							<span className="font-semibold">Distance:</span> ~{length.toFixed(0)}{" "}
							meters
						</p>
						<ScrollArea className="max-h-40 pr-2 text-justify">
							<ol className="list-decimal list-inside space-y-1">
								{directions.map((d, i) => (
									<li key={i}>{d}</li>
								))}
							</ol>
						</ScrollArea>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default DirectionsPanel;
