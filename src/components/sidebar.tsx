import React from "react";
import { NavLink, useLocation } from "react-router";

import {
	ClipboardCheck,
	Group,
	Home,
	LogOut,
	MapPin,
	MultiplePagesXmark,
	Network,
	Settings,
	TaskList,
} from "iconoir-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

import { useSettingsState } from "@/core/state/settings";
import { cn } from "@/core/utils";
import { useLogout } from "@refinedev/core";

const items = [
	[
		{ to: "/", icon: Home, label: "Home" },
		{ to: "/submissions", icon: ClipboardCheck, label: "Submissions" },
		{ to: "/users", icon: Group, label: "Users" },
		{ to: "/map", icon: MapPin, label: "Map" },
		{ to: "/feedback", icon: Network, label: "Feedback" },
	],
	[
		{ to: "/audit", icon: TaskList, label: "Audit Logs" },
		{ to: "/delete-requests", icon: MultiplePagesXmark, label: "Delete Requests" },
		{ to: "/settings", icon: Settings, label: "Settings" },
	],
];

export const Sidebar = () => {
	const location = useLocation();

	const { mutate: logout } = useLogout();
	const { open, openMobile } = useSidebar();
	const { showAuditTab } = useSettingsState();

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
					<Avatar className="h-12 w-12">
						<AvatarImage src="/images/logo.png" alt="Logo" />
						<AvatarFallback>VL</AvatarFallback>
					</Avatar>
					{(open || openMobile) && (
						<div className="flex flex-col gap-1.25">
							<span className="text-xl font-semibold leading-tight">
								Vrikshalakshya
							</span>
							<span className="text-sm text-muted-foreground leading-tight">
								Admin Panel for Ankura
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
									{links.map(item =>
										!showAuditTab && item.to === "/audit" ? null : (
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
														<item.icon className="h-5 w-5" />
														<span>{item.label}</span>
													</NavLink>
												</SidebarMenuButton>
											</SidebarMenuItem>
										),
									)}
								</React.Fragment>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarSeparator />
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="Logout">
							<Button
								onClick={() => {
									sessionStorage.removeItem("unauthorized");
									logout();
								}}
								className="flex w-full justify-center items-center gap-3 px-3 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-white"
								variant="ghost"
							>
								<LogOut className="h-5 w-5" />
								{(open || openMobile) && <span>Logout</span>}
							</Button>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</NativeSidebar>
	);
};
