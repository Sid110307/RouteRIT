import React from "react";

import { motion } from "motion/react";

import BuildingChooser from "@/components/buildingChooser";
import DirectionsPanel from "@/components/directionsPanel";
import MapView from "@/components/mapView";
import RouteOptions from "@/components/routeOptions";
import { Sidebar } from "@/components/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const Layout = (props: { children: React.ReactNode }) => (
	<div className="flex w-full h-screen">
		<Sidebar />
		<SidebarInset>
			<header className="p-4 border-b border-border bg-background flex items-center gap-4">
				<SidebarTrigger />
			</header>
			<main
				className="flex-1 overflow-auto p-6 bg-background"
				style={{ scrollbarGutter: "stable" }}
			>
				{props.children}
			</main>
		</SidebarInset>
	</div>
);

const App = () => {
	return (
		<div className="w-full min-h-screen bg-background text-foreground">
			<Layout>
				<div className="flex flex-col lg:flex-row gap-6">
					<motion.section
						className="flex flex-col gap-6 lg:w-[340px]"
						initial={{ opacity: 0, x: -16 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.15, duration: 0.3 }}
					>
						<BuildingChooser />
						<RouteOptions />
						<DirectionsPanel />
					</motion.section>
					<motion.section
						className="flex-1"
						initial={{ opacity: 0, x: 16 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2, duration: 0.3 }}
					>
						<MapView />
					</motion.section>
				</div>
			</Layout>
		</div>
	);
};

export default App;
