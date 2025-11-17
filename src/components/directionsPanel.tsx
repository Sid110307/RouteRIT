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
			<CardContent className="text-sm text-center flex flex-col gap-2">
				{directions.length === 0 ? (
					<p className="text-muted-foreground">
						No route yet. Choose buildings and press <strong>Find route</strong>.
					</p>
				) : (
					<>
						<p>
							<span className="font-semibold">Approx distance:</span>{" "}
							{length.toFixed(0)} meters
						</p>
						<ScrollArea className="max-h-40 pr-2">
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
