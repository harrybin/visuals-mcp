import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
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
import "./app.css";

type ThemeMode = "dark" | "light";

const applyThemeMode = (mode: ThemeMode) => {
  const targets = [document.documentElement, document.body];
  for (const target of targets) {
    target.classList.toggle("theme-dark", mode === "dark");
    target.classList.toggle("theme-light", mode === "light");
    target.dataset.theme = mode;
  }
};

const resolveThemeMode = (ctx?: any): ThemeMode => {
  if (ctx?.isDarkTheme === true) return "dark";
  if (ctx?.isDarkTheme === false) return "light";

  const candidates = [
    ctx?.theme?.kind,
    ctx?.theme?.type,
    ctx?.colorTheme?.kind,
    ctx?.colorTheme?.type,
    ctx?.colorScheme,
    ctx?.theme,
    ctx?.colorTheme,
    ctx?.appearance,
  ];

  for (const value of candidates) {
    if (typeof value !== "string") continue;
    const normalized = value.toLowerCase();

    if (normalized.includes("dark") || normalized.includes("black")) {
      return "dark";
    }

    if (normalized.includes("light") || normalized.includes("white")) {
      return "light";
    }

    if (normalized.includes("hc")) {
      return normalized.includes("light") ? "light" : "dark";
    }
  }

  return "dark";
};

function TableApp() {
  const [tableData, setTableData] = useState<TableToolInput | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [filterInputs, setFilterInputs] = useState<Record<string, string>>({});

  const { app } = useApp({
    appInfo: { name: "table-display", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (createdApp) => {
      applyThemeMode("dark");

      // Handle tool input - initial data load
      createdApp.ontoolinput = (params) => {
        console.log("Received tool input:", params);
        const data = params.arguments as TableToolInput;
        setTableData(data);

        // Reset state on new data
        setSorting([]);
        setColumnFilters([]);
        setRowSelection({});
        setFilterInputs({});

        // Set initial column visibility
        const visibility: VisibilityState = {};
        data.columns.forEach((col) => {
          visibility[col.key] = true;
        });
        setColumnVisibility(visibility);
      };

      // Handle tool result - for query_table_data responses
      createdApp.ontoolresult = (result: any) => {
        console.log("Received tool result:", result);

        if (result._meta?.ui?.data) {
          const uiData = result._meta.ui.data as any;

          // Update with server-filtered/sorted data
          if (uiData.rows && tableData) {
            setTableData({
              ...tableData,
              rows: uiData.rows,
            });
          }
        }
      };

      // Handle host context changes (theme, safe area, etc.)
      createdApp.onhostcontextchanged = (ctx) => {
        console.log("Host context changed:", ctx);

        applyThemeMode(resolveThemeMode(ctx));

        // Handle safe area insets
        if (ctx.safeAreaInsets) {
          const { top, right, bottom, left } = ctx.safeAreaInsets;
          document.body.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
        }
      };

      // Cleanup on teardown
      createdApp.onteardown = async () => {
        console.log("App tearing down");
        return {};
      };
    },
  });

  // Log table state changes (updateModelContext is not available in current API)
  useEffect(() => {
    if (!app || !tableData) return;

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

    // Log state changes for debugging
    app
      .sendLog({
        level: "info",
        data: `Table state: ${selectedIds.length} rows selected, ${columnFilters.length} filters active, ${sorting.length} columns sorted`,
      })
      .catch(console.error);
  }, [sorting, columnFilters, rowSelection, columnVisibility, app, tableData]);

  // Create dynamic columns from table data
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!tableData) return [];

    // Add selection column if enabled
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

    // Add data columns
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

          // Format based on type
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

  // Create table instance
  const table = useReactTable({
    data: tableData?.rows ?? [],
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
        pageSize: tableData?.pageSize ?? 10,
      },
    },
  });

  // Apply filter handler
  const applyFilter = (columnKey: string) => {
    const value = filterInputs[columnKey];
    if (value) {
      table.getColumn(columnKey)?.setFilterValue(value);
    } else {
      table.getColumn(columnKey)?.setFilterValue(undefined);
    }
  };

  if (!tableData) {
    return (
      <div className="loading">
        <p>Loading table data...</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      {tableData.title && <h1 className="table-title">{tableData.title}</h1>}

      {/* Column Visibility Controls */}
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

      {/* Table */}
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

                        {/* Filter input */}
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

      {/* Pagination Controls */}
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

// Mount the app
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<TableApp />);
}
