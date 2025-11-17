import React from "react";
import CountUp from "react-countup";
import { useNavigate } from "react-router";

import { EntryStatus, User } from "@ankura/types";
import {
	Archive,
	BoxIso,
	CheckCircle,
	Clock,
	Download,
	Group,
	Leaf,
	MapPin,
	Pin,
	RefreshDouble,
	Xmark,
} from "iconoir-react";
import { DateTime } from "luxon";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { UserBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { DashboardStats, useDashboardState } from "@/core/state/dashboard";
import { cn, downloadCSV, fillMissingDates, getColorValue, statusDescriptions } from "@/core/utils";
import { useGetIdentity } from "@refinedev/core";

export interface ChartData {
	date: string;
	count: number;
}

const StatCard = (props: {
	icon: React.ReactNode;
	label: string;
	value: number;
	color?: string;
}) => (
	<Card
		aria-label={statusDescriptions[props.label.toLowerCase() as EntryStatus] ?? props.label}
		className="flex flex-row items-center gap-4 p-4 shadow-md"
		style={{ borderColor: props.color ? getColorValue(props.color, 0.5) : undefined }}
	>
		<Tooltip>
			<TooltipTrigger asChild>
				<div
					aria-hidden="true"
					className={cn(
						"p-2 bg-muted rounded-full",
						!statusDescriptions[props.label.toLowerCase() as EntryStatus] &&
						"pointer-events-none",
					)}
					style={{ color: props.color ? getColorValue(props.color) : undefined }}
				>
					{props.icon}
				</div>
			</TooltipTrigger>
			<TooltipContent>
				{statusDescriptions[props.label.toLowerCase() as EntryStatus] || "N/A"}
			</TooltipContent>
		</Tooltip>
		<div className="flex flex-col">
			<p className="text-sm text-muted-foreground">{props.label}</p>
			<p className="text-xl font-semibold">
				<CountUp end={props.value} duration={1} />
			</p>
		</div>
	</Card>
);

const StatCards = (props: { stats: DashboardStats | null; loading: boolean }) => (
	<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:flex lg:flex-wrap">
		{props.loading && !props.stats ? (
			Array.from({ length: 6 }).map((_, i) => (
				<Skeleton key={i} className="w-full md:w-48 h-20" />
			))
		) : (
			<>
				<StatCard icon={<Leaf />} label="Total Entries" value={props.stats?.total ?? 0} />
				<StatCard icon={<Group />} label="Total Users" value={props.stats?.users ?? 0} />
				<div className="block lg:hidden col-span-full">
					<Separator className="bg-muted" />
				</div>
				<div className="hidden lg:flex items-center py-2">
					<Separator orientation="vertical" className="bg-muted" />
				</div>
				<StatCard
					icon={<Clock />}
					label="Pending"
					color="pending"
					value={props.stats?.statuses?.pending ?? 0}
				/>
				<StatCard
					icon={<CheckCircle />}
					label="Approved"
					color="approved"
					value={props.stats?.statuses?.approved ?? 0}
				/>
				<StatCard
					icon={<BoxIso />}
					label="Collected"
					color="collected"
					value={props.stats?.statuses?.collected ?? 0}
				/>
				<StatCard
					icon={<Pin />}
					label="Tagged"
					color="tagged"
					value={props.stats?.statuses?.tagged ?? 0}
				/>
				<StatCard
					icon={<Leaf />}
					label="Planted"
					color="planted"
					value={props.stats?.statuses?.planted ?? 0}
				/>
				<StatCard
					icon={<Xmark />}
					label="Ignored"
					color="ignored"
					value={props.stats?.statuses?.ignored ?? 0}
				/>
				<StatCard
					icon={<Archive />}
					label="Archived"
					color="archived"
					value={props.stats?.statuses?.archived ?? 0}
				/>
			</>
		)}
	</div>
);

const UserInfo = () => {
	const { data } = useGetIdentity<User>();
	return (
		<div className="flex flex-col gap-1.5">
			{!data ? (
				<Skeleton className="h-6 w-40" />
			) : (
				<>
					<h2 className="text-2xl font-semibold tracking-tight">
						Welcome, {data?.username}.
					</h2>
					<p className="text-muted-foreground text-justify text-sm">
						Here's what's happening today.
					</p>
				</>
			)}
		</div>
	);
};

export const SubmissionsChart = (props: {
	data: ChartData[] | undefined;
	loading: boolean;
	chartData: any[];
}) =>
	props.loading && !props.data ? (
		<Skeleton className="h-full w-full rounded-md" />
	) : (props.data?.length || 0) > 0 ? (
		<ChartContainer
			config={{
				count: { label: "Submissions", color: "var(--primary)" },
			}}
			className="aspect-auto h-full w-full"
		>
			<LineChart accessibilityLayer data={props.chartData} margin={{ left: 12, right: 12 }}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="date"
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					minTickGap={32}
					tickFormatter={value => DateTime.fromISO(value).toFormat("MMM d")}
				/>
				<YAxis
					allowDecimals={false}
					tickFormatter={value => (value >= 1000 ? `${value / 1000}k` : value)}
				/>
				<ChartTooltip
					content={
						<ChartTooltipContent
							nameKey="count"
							labelFormatter={value =>
								DateTime.fromISO(value).toLocaleString(DateTime.DATE_MED)
							}
						/>
					}
				/>
				<Line
					dataKey="count"
					type="monotone"
					stroke="var(--primary)"
					strokeWidth={2}
					dot={false}
				/>
			</LineChart>
		</ChartContainer>
	) : (
		<div className="flex items-center justify-center h-full">
			<p className="text-muted-foreground text-justify text-sm">
				No submissions found in this interval.
			</p>
		</div>
	);

const TopContributors = (props: { stats: DashboardStats | null; loading: boolean }) =>
	props.loading && !props.stats ? (
		<ul className="space-y-2 text-sm">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center justify-between gap-4 border-b border-muted pb-1 last:border-none"
				>
					<div className="flex items-center gap-4">
						<Skeleton className="h-8 w-8 aspect-square rounded-full" />
						<Skeleton className="h-4 w-1/3" />
					</div>
					<Skeleton className="h-4 w-1/4" />
				</div>
			))}
		</ul>
	) : (
		<ScrollArea className="h-60 pr-2">
			<ul className="space-y-2 text-sm">
				{props.stats?.top_users?.map((u: User, i: number) => (
					<li
						key={`${u.id}-${i}`}
						className="flex justify-between items-center gap-2 border-b border-muted pb-1 last:border-none"
					>
						<UserBadge user={u} />
						<span className="truncate text-muted-foreground">
							{u.totalEntries} submission
							{u.totalEntries !== 1 ? "s" : ""}
						</span>
					</li>
				))}
			</ul>
		</ScrollArea>
	);

const QuickActions = (props: { stats: DashboardStats | null }) => {
	const navigate = useNavigate();
	return (
		<div className="flex gap-3">
			<Button
				onClick={() => navigate("/submissions?status=pending")}
				className="flex items-center gap-2"
			>
				<Clock className="h-4 w-4" />
				Review Pending
			</Button>
			<Button
				variant="secondary"
				onClick={() => navigate("/map")}
				className="flex items-center gap-2"
			>
				<MapPin className="h-4 w-4" />
				Open Map
			</Button>
			<Button
				variant="outline"
				onClick={() => props.stats && downloadCSV(props.stats)}
				disabled={!props.stats}
				className="flex items-center gap-2"
			>
				<Download className="h-4 w-4" />
				Download CSV
			</Button>
		</div>
	);
};

export const HomePage = () => {
	const [selectedInterval, setSelectedInterval] = React.useState("30 days");
	const { statsByInterval, statsTimestamps, fetchStats, loading } = useDashboardState();

	const stats = statsByInterval[selectedInterval];
	const chartData = React.useMemo(() => {
		if (!stats?.submission_trend) return [];
		return fillMissingDates(stats.submission_trend, selectedInterval);
	}, [stats?.submission_trend, selectedInterval]);

	React.useEffect(() => {
		fetchStats(selectedInterval).catch(console.error);
	}, [selectedInterval]);

	return (
		<div className="space-y-6">
			<UserInfo />
			<StatCards stats={stats} loading={loading} />
			<div className="flex flex-col lg:flex-row gap-4">
				<Card className="lg:flex-[3] w-full">
					<CardHeader className="flex items-center gap-2 justify-between">
						<div className="flex flex-col gap-1.5">
							<CardTitle>Submissions Trend</CardTitle>
							<CardDescription className="sm:text-sm text-xs text-muted-foreground">
								Last updated:{" "}
								{statsTimestamps[selectedInterval]
									? DateTime.fromMillis(
										statsTimestamps[selectedInterval],
									).toLocaleString(DateTime.DATETIME_MED)
									: "N/A"}
							</CardDescription>
						</div>
						<div className="flex flex-wrap justify-end items-center gap-2">
							<Select value={selectedInterval} onValueChange={setSelectedInterval}>
								<SelectTrigger className="w-36">
									<SelectValue placeholder="Select interval" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="7 days">Last 7 Days</SelectItem>
									<SelectItem value="30 days">Last 30 Days</SelectItem>
									<SelectItem value="90 days">Last 3 Months</SelectItem>
									<SelectItem value="180 days">Last 6 Months</SelectItem>
									<SelectItem value="365 days">Last Year</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant="outline"
								size="icon"
								onClick={() => !loading && fetchStats(selectedInterval)}
								disabled={loading}
							>
								<RefreshDouble
									className="h-5 w-5"
									style={{
										color: loading ? "var(--muted)" : "var(--foreground)",
									}}
								/>
							</Button>
						</div>
					</CardHeader>
					<CardContent className="h-60">
						<SubmissionsChart
							data={stats?.submission_trend}
							loading={loading}
							chartData={chartData}
						/>
					</CardContent>
				</Card>
				<Card className="lg:flex-[1] w-full">
					<CardHeader>
						<CardTitle>Top Contributors</CardTitle>
					</CardHeader>
					<CardContent>
						<TopContributors stats={stats} loading={loading} />
					</CardContent>
				</Card>
			</div>
			<QuickActions stats={stats} />
		</div>
	);
};
