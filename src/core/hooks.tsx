import React from "react";
import { useSearchParams } from "react-router";

import { PaginationState } from "@tanstack/react-table";

export const useSearchTableParams = <TFilters extends Record<string, string | undefined>>() => {
	const [searchParams, setSearchParams] = useSearchParams();

	const pageIndex = parseInt(searchParams.get("page") || "0") || 0;
	const pageSize = parseInt(searchParams.get("size") || "10") || 10;

	const filters: TFilters = Object.fromEntries(
		Array.from(searchParams.entries()).filter(([key]) => !["page", "size"].includes(key)),
	) as TFilters;

	const setPagination = ({ pageIndex, pageSize }: PaginationState) => {
		const params = new URLSearchParams(window.location.search);
		if (
			params.get("page") === (pageIndex || 0).toString() &&
			params.get("size") === (pageSize || 10).toString()
		)
			return;

		params.set("page", (pageIndex || 0).toString());
		params.set("size", (pageSize || 10).toString());

		setSearchParams(params, { replace: true });
	};

	const setFilter = (key: keyof TFilters, value?: string) => {
		const params = new URLSearchParams(window.location.search);

		if (value) params.set(key as string, value);
		else params.delete(key as string);

		params.set("page", "0");
		setSearchParams(params, { replace: true });
	};

	const clearFilters = () => {
		const params = new URLSearchParams(window.location.search);
		Object.keys(filters).forEach(key => params.delete(key));

		setSearchParams(params, { replace: true });
	};

	return {
		pageIndex,
		pageSize,
		filters,
		setFilter,
		setPagination,
		clearFilters,
		searchParams,
	};
};

const MOBILE_BREAKPOINT = 768;
export const useIsMobile = () => {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
};
