import React from "react";

import { motion } from "motion/react";

import { LogoSVG } from "@/assets/logo";

import BuildingChooser from "@/components/buildingChooser";
import ConnectView from "@/components/connectView";
import DirectionsPanel from "@/components/directionsPanel";
import MapView from "@/components/mapView";
import RoomChooser from "@/components/roomChooser";
import RouteOptions from "@/components/routeOptions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Layout = (props: {
	mode: "connect" | "navigate";
	setMode: React.Dispatch<React.SetStateAction<"connect" | "navigate">>;
	children: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col w-full h-screen">
			<header className="w-full p-4 border-b border-border bg-background flex justify-between items-center gap-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center">
						<LogoSVG className="h-12 w-12 object-contain" />
					</div>
					<div className="flex flex-col gap-1.25">
						<span className="text-xl font-semibold leading-tight">CampusConnect</span>
						<span className="text-sm text-muted-foreground leading-tight">
							Made by{" "}
							<a
								href="https://sid110307.github.io/Sid110307"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium underline hover:text-foreground"
							>
								@sid110307
							</a>{" "}
							and{" "}
							<a
								href="https://github.com/Yashavanta123"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium underline hover:text-foreground"
							>
								@Yashavanta123
							</a>
						</span>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<Tabs
						value={props.mode}
						onValueChange={v => props.setMode(v as "connect" | "navigate")}
						className="w-full"
					>
						<TabsList className="inline-flex">
							<TabsTrigger value="connect" className="text-xs">
								Connect
							</TabsTrigger>
							<TabsTrigger value="navigate" className="text-xs">
								Navigate
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</header>
			<main
				className="flex-1 overflow-auto p-6 bg-background"
				style={{ scrollbarGutter: "stable" }}
			>
				{props.children}
			</main>
		</div>
	);
};

const App = () => {
	const [mode, setMode] = React.useState<"connect" | "navigate">("connect");
	return (
		<div className="w-full min-h-screen bg-background text-foreground">
			<Layout mode={mode} setMode={setMode}>
				{mode === "connect" ? (
					<motion.section
						className="flex-1"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2 }}
					>
						<ConnectView />
					</motion.section>
				) : (
					<div className="flex flex-col lg:flex-row gap-6">
						<motion.section
							className="flex flex-col gap-6 lg:w-[340px]"
							initial={{ opacity: 0, x: -16 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.15, duration: 0.3 }}
						>
							<BuildingChooser />
							<RoomChooser />
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
				)}
			</Layout>
		</div>
	);
};

export default App;
