import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  flexRender,
} from "@tanstack/react-table";
import type { TableToolInput, TableState, Column } from "../types";

type TableViewProps = {
  tableData: TableToolInput;
  onStateChange?: (state: TableState, summary: string) => void;
};

const buildVisibilityState = (columns: Column[]): VisibilityState => {
  const visibility: VisibilityState = {};
  for (const col of columns) {
    visibility[col.key] = true;
  }
  return visibility;
};

export function TableView({ tableData, onStateChange }: TableViewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => buildVisibilityState(tableData.columns),
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [filterInputs, setFilterInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    setSorting([]);
    setColumnFilters([]);
    setRowSelection({});
    setFilterInputs({});
    setColumnVisibility(buildVisibilityState(tableData.columns));
  }, [tableData]);

  useEffect(() => {
    if (!onStateChange) return;

    const selectedIds = Object.keys(rowSelection).filter(
      (id) => rowSelection[id],
    );
    const visibleCols = Object.keys(columnVisibility).filter(
      (col) => columnVisibility[col],
    );

    const state: TableState = {
      sortBy: sorting.map((s) => ({
        columnKey: s.id,
        direction: s.desc ? "desc" : "asc",
      })),
      filters: Object.fromEntries(
        columnFilters.map((f) => [f.id, String(f.value)]),
      ),
      selectedRowIds: selectedIds,
      visibleColumns: visibleCols,
    };

    const summary = `${selectedIds.length} rows selected, ${columnFilters.length} filters active, ${sorting.length} columns sorted`;
    onStateChange(state, summary);
  }, [sorting, columnFilters, rowSelection, columnVisibility, onStateChange]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const cols: ColumnDef<any>[] = [];

    if (tableData.allowRowSelection !== false) {
      cols.push({
        id: "select",
        header: ({ table }) => {
          const ref = React.useRef<HTMLInputElement>(null);
          React.useEffect(() => {
            if (ref.current) {
              ref.current.indeterminate =
                table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
            }
          }, [table.getIsSomeRowsSelected(), table.getIsAllRowsSelected()]);
          return (
            <input
              ref={ref}
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          );
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
      });
    }

    tableData.columns.forEach((col: Column) => {
      cols.push({
        id: col.key,
        accessorKey: col.key,
        header: col.label,
        size: col.width,
        enableSorting: col.sortable !== false,
        enableColumnFilter: col.filterable !== false,
        cell: ({ getValue }) => {
          const value = getValue();

          if (col.type === "date" && value) {
            const dateValue =
              typeof value === "string" ||
              typeof value === "number" ||
              value instanceof Date
                ? new Date(value)
                : null;
            return dateValue && !isNaN(dateValue.getTime())
              ? dateValue.toLocaleDateString()
              : String(value);
          }
          if (col.type === "boolean") {
            return value ? "✓" : "✗";
          }
          if (col.type === "number" && typeof value === "number") {
            return value.toLocaleString();
          }

          return String(value ?? "");
        },
      });
    });

    return cols;
  }, [tableData]);

  const table = useReactTable({
    data: tableData.rows ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: tableData.pageSize ?? 10,
      },
    },
  });

  const applyFilter = (columnKey: string) => {
    const value = filterInputs[columnKey];
    if (value) {
      table.getColumn(columnKey)?.setFilterValue(value);
    } else {
      table.getColumn(columnKey)?.setFilterValue(undefined);
    }
  };

  return (
    <div className="table-container">
      {tableData.title && <h1 className="table-title">{tableData.title}</h1>}

      {tableData.allowColumnVisibility !== false && (
        <div className="controls">
          <details className="column-visibility">
            <summary>Column Visibility</summary>
            <div className="column-list">
              {tableData.columns.map((col) => (
                <label key={col.key}>
                  <input
                    type="checkbox"
                    checked={columnVisibility[col.key] !== false}
                    onChange={(e) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [col.key]: e.target.checked,
                      }))
                    }
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </details>
        </div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={
                            header.column.getCanSort() ? "sortable" : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>

                        {header.column.getCanFilter() &&
                          header.column.id !== "select" && (
                            <div className="filter-input">
                              <input
                                type="text"
                                placeholder="Filter..."
                                value={filterInputs[header.column.id] ?? ""}
                                onChange={(e) =>
                                  setFilterInputs((prev) => ({
                                    ...prev,
                                    [header.column.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    applyFilter(header.column.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => applyFilter(header.column.id)}
                                className="filter-btn"
                              >
                                ⚡
                              </button>
                            </div>
                          )}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={row.getIsSelected() ? "selected" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          {" - "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}
          {" of "}
          {table.getFilteredRowModel().rows.length} rows
          {Object.keys(rowSelection).length > 0 &&
            ` (${Object.keys(rowSelection).length} selected)`}
        </div>

        <div className="pagination-controls">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            ⟪
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            ⟫
          </button>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
