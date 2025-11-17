import React from "react";

import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	PaginationState,
	useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DataTable,
	DataTableFilters,
	DataTableFiltersConfig,
	DataTablePagination,
	RefreshButton,
} from "@/components/ui/data-table";

interface BulkAction<T> {
	label: string;
	onClick: (selected: T[]) => void;
	variant?: "default" | "destructive" | "outline";
}

interface DataTableListProps<T extends { id: string }> {
	title: string;
	data: T[];
	columns: ColumnDef<T, any>[];
	loading?: boolean;
	filters: Partial<Record<keyof T, string>>;
	setFilter: (key: string, value?: string) => void;
	clearFilters: () => void;
	fetchData: () => void;
	pageIndex: number;
	pageSize: number;
	setPagination: (pagination: PaginationState) => void;
	filterConfigs?: DataTableFiltersConfig<string>[];
	filterConfigsPlaceholder?: string;
	skeleton?: React.ReactNode;
	bulkActions?: BulkAction<T>[];
}

export const DataTableList = <T extends { id: string }>({
	title,
	data,
	columns,
	loading,
	filters,
	setFilter,
	clearFilters,
	fetchData,
	pageIndex,
	pageSize,
	setPagination,
	filterConfigs = [],
	filterConfigsPlaceholder,
	skeleton,
	bulkActions = [],
}: DataTableListProps<T>) => {
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		state: { pagination: { pageIndex, pageSize }, rowSelection },
		getRowId: row => row.id,
		enableRowSelection: true,
		onPaginationChange: updater => setPagination(updater as PaginationState),
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});
	const selectedRows = table.getSelectedRowModel().rows.map(r => r.original);

	return (
		<Card className="w-full gap-2">
			<CardHeader>
				<CardTitle>
					<div className="flex justify-between items-center">
						<span className="truncate">{title}</span>
						<span
							className="text-sm font-medium text-muted-foreground h-5 text-right"
							aria-live="polite"
						>
							{selectedRows.length > 0 ? `${selectedRows.length} selected` : ""}
						</span>
						{filterConfigs?.length === 0 && (
							<RefreshButton fetchData={fetchData} fetching={loading} />
						)}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<DataTableFilters
					filters={filters}
					setFilter={setFilter}
					clearFilters={clearFilters}
					fetchData={fetchData}
					configs={filterConfigs}
					configsPlaceholder={filterConfigsPlaceholder}
					fetching={loading}
					extraButtons={
						bulkActions?.length > 0 &&
						selectedRows.length > 0 &&
						bulkActions?.map((action, idx) => (
							<Button
								key={idx}
								size="sm"
								variant={action.variant ?? "default"}
								disabled={selectedRows.length === 0}
								onClick={() =>
									action.onClick(selectedRows.map((r: any) => r.original))
								}
							>
								{action.label}
							</Button>
						))
					}
				/>
				{loading && skeleton ? skeleton : <DataTable table={table} columns={columns} />}
				<DataTablePagination
					pageIndex={pageIndex}
					pageSize={pageSize}
					pageCount={table.getPageCount()}
					pages={[10, 20, 50, 100, 200, 500]}
					onPageChange={newIndex => setPagination({ pageIndex: newIndex, pageSize })}
					onPageSizeChange={newSize => setPagination({ pageIndex: 0, pageSize: newSize })}
				/>
			</CardContent>
		</Card>
	);
};
