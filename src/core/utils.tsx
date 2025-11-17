import { EntryStatus } from "@ankura/types";
import { createClient } from "@refinedev/supabase";
import { ClassValue, clsx } from "clsx";
import { DateTime } from "luxon";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { ChartData } from "@/pages/home";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)
	throw new Error("Supabase URL and Anon Key must be provided in environment variables.");

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
	{ db: { schema: "public" }, auth: { persistSession: true } },
);

export const statusDescriptions: Record<EntryStatus, string> = {
	pending: "Submitted and waiting for admin review",
	approved: "Verified by admin and ready for collection",
	collected: "Sapling has been picked up by the team",
	tagged: "Tagged with a QR code",
	planted: "Successfully planted",
	ignored: "Not suitable or does not meet criteria",
	archived: "Stored for reference, no further updates",
};

export const getColorValue = (color: string | undefined, alpha = 1) => {
	if (!color) return undefined;
	return `color-mix(in srgb, var(--color-${color}) ${alpha * 100}%, transparent)`;
};

export const parseImageList = (json: string | null | undefined): string[] => {
	if (!json) return [];

	try {
		const parsed = JSON.parse(json || "[]");
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const fillMissingDates = (data: ChartData[], intervalText: string) => {
	const days = parseInt(intervalText);
	const start = DateTime.now()
		.startOf("day")
		.minus({ days: days - 1 });
	const counts = Object.fromEntries(data.map(d => [d.date, d.count]));

	return Array.from({ length: days }, (_, i) => {
		const date = start.plus({ days: i }).toISODate();
		return { date, count: counts[date] ?? 0 };
	});
};

export const downloadCSV = (stats: Record<string, any> | null) => {
	if (!stats || Object.keys(stats).length === 0) return;

	const formatTitle = (title: string) =>
		title.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
	const escapeCSV = (val: string) => `"${val.replace(/"/g, "\"\"")}"`;

	const csvSections: string[] = [];
	if (Array.isArray(stats)) {
		csvSections.push("Data");
		const allKeys = Array.from(
			new Set(stats.flatMap(entry => Object.keys(entry || {}))),
		).sort();
		csvSections.push(allKeys.map(formatTitle).join(","));

		for (const row of stats)
			csvSections.push(
				allKeys
					.map(field => {
						const val = row?.[field];
						return escapeCSV(
							typeof val === "object"
								? JSON.stringify(val)
								: String(val ?? "").trim(),
						);
					})
					.join(","),
			);
	} else {
		const summaryEntries: Record<string, string> = {};
		for (const [key, value] of Object.entries(stats)) {
			if (Array.isArray(value)) continue;
			summaryEntries[key] = escapeCSV(
				typeof value === "object" ? JSON.stringify(value) : String(value ?? "").trim(),
			);
		}

		const summaryKeys = Object.keys(summaryEntries);
		const summaryValues = summaryKeys.map(key => summaryEntries[key]);

		csvSections.push("Statistics");
		csvSections.push(summaryKeys.map(formatTitle).join(","));
		csvSections.push(summaryValues.join(","));
		csvSections.push("");

		for (const [key, value] of Object.entries(stats)) {
			if (!Array.isArray(value)) continue;
			csvSections.push(formatTitle(key));

			const allKeys = Array.from(
				new Set(value.flatMap(entry => Object.keys(entry || {}))),
			).sort();
			csvSections.push(allKeys.map(formatTitle).join(","));

			for (const row of value)
				csvSections.push(
					allKeys
						.map(field => {
							const val = row?.[field];
							return escapeCSV(
								typeof val === "object"
									? JSON.stringify(val)
									: String(val ?? "").trim(),
							);
						})
						.join(","),
				);

			csvSections.push("");
		}
	}

	const a = document.createElement("a");
	a.href = URL.createObjectURL(
		new Blob([`\uFEFF${csvSections.join("\n")}`], { type: "text/csv;charset=utf-8;" }),
	);
	a.download = `stats_${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;

	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(a.href);

	toast.success("CSV file downloaded.");
};
