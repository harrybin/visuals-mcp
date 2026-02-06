import { z } from "zod";

/**
 * Column definition schema for table columns
 */
export const ColumnSchema = z.object({
  key: z.string().describe("Unique key for the column (maps to data property)"),
  label: z.string().describe("Display label for the column header"),
  type: z.enum(["string", "number", "date", "boolean"]).default("string"),
  sortable: z.boolean().optional().default(true),
  filterable: z.boolean().optional().default(true),
  width: z.number().optional().describe("Column width in pixels"),
});

export type Column = z.infer<typeof ColumnSchema>;

/**
 * Input schema for the display_table tool
 */
export const TableToolInputSchema = z.object({
  columns: z.array(ColumnSchema).describe("Array of column definitions"),
  rows: z.array(z.record(z.string(), z.any())).describe("Array of row data objects"),
  title: z.string().optional().describe("Optional title for the table"),
  allowRowSelection: z.boolean().optional().default(true),
  allowColumnVisibility: z.boolean().optional().default(true),
  pageSize: z.number().optional().default(10).describe("Default page size"),
});

export type TableToolInput = z.infer<typeof TableToolInputSchema>;

/**
 * Table state that gets sent back to the agent via updateModelContext
 */
export interface TableState {
  sortBy?: Array<{ columnKey: string; direction: "asc" | "desc" }>;
  filters?: Record<string, string>;
  selectedRowIds?: string[];
  visibleColumns?: string[];
  currentPage?: number;
  pageSize?: number;
}

/**
 * Input schema for query_table_data (UI-only tool for server-side operations)
 */
export const QueryTableDataInputSchema = z.object({
  sortBy: z
    .array(
      z.object({
        columnKey: z.string(),
        direction: z.enum(["asc", "desc"]),
      }),
    )
    .optional(),
  filters: z.record(z.string(), z.string()).optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export type QueryTableDataInput = z.infer<typeof QueryTableDataInputSchema>;
