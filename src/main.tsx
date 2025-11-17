import React from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";

import "@/index.css";

import { BrowserRouter } from "react-router";

import { IconoirProvider } from "iconoir-react";
import { ThemeProvider } from "next-themes";

import { SidebarProvider } from "@/components/ui/sidebar";

createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<IconoirProvider iconProps={{ width: 16, height: 16 }}>
					<SidebarProvider>
						<App />
					</SidebarProvider>
				</IconoirProvider>
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>,
);
