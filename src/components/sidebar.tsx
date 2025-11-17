import React from "react";
import { NavLink, useLocation } from "react-router";

import { Home, MapPin } from "iconoir-react";

import { LogoSVG } from "@/assets/logo";

import {
	Sidebar as NativeSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
	useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/core/utils";

const items = [
	[
		{ to: "/", icon: Home, label: "Home" },
		{ to: "/map", icon: MapPin, label: "Campus Map" },
	],
];

export const Sidebar = () => {
	const location = useLocation();
	const { open, openMobile } = useSidebar();

	return (
		<NativeSidebar collapsible="icon">
			<SidebarRail />
			<SidebarHeader>
				<div
					className={cn(
						"flex justify-center items-center py-1",
						(open || openMobile) && "gap-1.5 w-max",
					)}
				>
					<div className="h-12 w-12 flex items-center justify-center">
						<LogoSVG className="h-8 w-8 object-contain" />
					</div>
					{(open || openMobile) && (
						<div className="flex flex-col gap-1.25">
							<span className="text-xl font-semibold leading-tight">
								CampusConnect
							</span>
							<span className="text-sm text-muted-foreground leading-tight">
								Campus navigation system
							</span>
						</div>
					)}
				</div>
				<SidebarSeparator />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((links, index) => (
								<React.Fragment key={index}>
									{index > 0 && <SidebarSeparator className="my-2" />}
									{links.map(item => (
										<SidebarMenuItem key={item.label}>
											<SidebarMenuButton
												asChild
												isActive={location.pathname === item.to}
												tooltip={item.label}
											>
												<NavLink
													to={item.to}
													className="flex items-center gap-3 px-3 py-2"
												>
													<item.icon className="size-5" />
													<span>{item.label}</span>
												</NavLink>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</React.Fragment>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className={cn(!(open || openMobile) && "hidden")}>
				<SidebarSeparator />
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex w-full justify-center py-2 gap-1 text-xs text-muted-foreground">
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
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</NativeSidebar>
	);
};
