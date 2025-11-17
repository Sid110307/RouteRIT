import React from "react";

import { ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import { RefreshDouble } from "iconoir-react";

import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	table: ReturnType<typeof useReactTable<TData>>;
	columns: ColumnDef<TData, TValue>[];
}

const DataTable = <TData, TValue>({ table, columns }: DataTableProps<TData, TValue>) => (
	<div className="w-full overflow-x-auto rounded-md border">
		<Table className="table-fixed">
			<TableHeader className="sticky top-0 bg-background shadow-sm">
				{table.getHeaderGroups().map(headerGroup => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map(header => (
							<TableHead key={header.id} style={{ width: header.getSize() }}>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
							</TableHead>
						))}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map(row => (
						<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
							{row.getVisibleCells().map(cell => (
								<TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							No results found.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	</div>
);

interface DataTablePaginationProps {
	pageIndex: number;
	pageSize: number;
	pageCount: number;
	pages: number[];
	onPageChange: (pageIndex: number) => void;
	onPageSizeChange: (pageSize: number) => void;
}

const DataTablePagination = ({
	pageIndex,
	pageSize,
	pageCount,
	pages,
	onPageChange,
	onPageSizeChange,
}: DataTablePaginationProps) => (
	<Pagination className="mt-4 justify-between">
		<PaginationContent>
			<PaginationItem>
				<PaginationPrevious
					onClick={() => onPageChange(pageIndex - 1)}
					className={
						pageIndex === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
					}
				/>
			</PaginationItem>
			{Array.from({ length: pageCount }).map((_, index) => (
				<PaginationItem key={index}>
					<PaginationLink
						className="cursor-pointer"
						isActive={index === pageIndex}
						onClick={() => onPageChange(index)}
					>
						{index + 1}
					</PaginationLink>
				</PaginationItem>
			))}
			<PaginationItem>
				<PaginationNext
					onClick={() => onPageChange(pageIndex + 1)}
					className={
						pageIndex >= pageCount - 1
							? "pointer-events-none opacity-50"
							: "cursor-pointer"
					}
				/>
			</PaginationItem>
		</PaginationContent>
		<div className="flex items-center gap-2">
			<span className="text-sm text-muted-foreground">Rows per page:</span>
			<Select
				value={pageSize.toString()}
				onValueChange={value => onPageSizeChange(Number(value))}
			>
				<SelectTrigger className="w-20">
					<SelectValue>{pageSize}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{pages.map(size => (
						<SelectItem key={size} value={size.toString()}>
							{size}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	</Pagination>
);

export interface DataTableFiltersConfig<T> {
	key: string;
	options: T[];
}

interface DataTableFiltersProps {
	filters: Record<string, string | undefined>;
	setFilter: (key: string, value?: string) => void;
	clearFilters?: () => void;
	fetchData: () => void;
	configs: DataTableFiltersConfig<string>[];
	configsPlaceholder?: string;
	fetching?: boolean;
	extraButtons?: React.ReactNode;
}

const RefreshButton = ({ fetchData, fetching }: { fetchData: () => void; fetching?: boolean }) => (
	<Button
		variant="outline"
		size="icon"
		className="size-8"
		onClick={() => !fetching && fetchData()}
		disabled={fetching}
	>
		{fetching ? (
			<Spinner size="xs" />
		) : (
			<RefreshDouble
				className="h-4 w-4"
				style={{ color: fetching ? "var(--muted)" : "var(--foreground)" }}
			/>
		)}
	</Button>
);

const DataTableFilters = ({
	filters,
	setFilter,
	clearFilters,
	fetchData,
	configs,
	configsPlaceholder,
	fetching,
	extraButtons,
}: DataTableFiltersProps) =>
	configs.length > 0 && (
		<div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
			{configs.map(({ key, options }) => (
				<div key={key} className="flex flex-wrap items-center gap-2">
					<Select
						value={filters[key] ?? ""}
						onValueChange={value => setFilter(key, value || undefined)}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder={configsPlaceholder || `Select ${key}`} />
						</SelectTrigger>
						<SelectContent>
							{options.map(option => (
								<SelectItem key={option} value={option.toLowerCase()}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			))}
			<div className="flex items-center gap-2">
				{extraButtons}
				{clearFilters && (
					<Button
						variant="outline"
						size="sm"
						onClick={clearFilters}
						disabled={!Object.keys(filters).length}
					>
						Clear Filters
					</Button>
				)}
				<RefreshButton fetchData={fetchData} fetching={fetching} />
			</div>
		</div>
	);

export { DataTable, DataTablePagination, DataTableFilters, RefreshButton };
