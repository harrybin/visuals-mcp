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
  rows: z
    .array(z.record(z.string(), z.any()))
    .describe("Array of row data objects"),
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

/**
 * Input schema for the display_image tool
 */
export const ImageToolInputSchema = z.object({
  src: z.string().describe("Image URL or data URI"),
  title: z.string().optional().describe("Optional title for the image"),
  alt: z.string().optional().describe("Alt text for accessibility"),
  caption: z.string().optional().describe("Optional caption below the image"),
  width: z.number().optional().describe("Optional image width in pixels"),
  height: z.number().optional().describe("Optional image height in pixels"),
  filename: z.string().optional().describe("Optional filename to display"),
  sizeBytes: z.number().optional().describe("Optional file size in bytes"),
});

export type ImageToolInput = z.infer<typeof ImageToolInputSchema>;

/**
 * List item schema for individual list items
 */
export const ListItemSchema = z.object({
  id: z.string().describe("Unique identifier for the list item"),
  content: z.string().describe("Text content of the list item"),
  checked: z.boolean().optional().default(false).describe("Whether the item is checked"),
  image: z.string().optional().describe("Optional image URL or data URI for the item"),
  metadata: z.record(z.string(), z.any()).optional().describe("Optional metadata for the item"),
  subtext: z.string().optional().describe("Optional secondary text/description"),
});

export type ListItem = z.infer<typeof ListItemSchema>;

/**
 * Input schema for the display_list tool
 */
export const ListToolInputSchema = z.object({
  items: z.array(ListItemSchema).describe("Array of list items to display"),
  title: z.string().optional().describe("Optional title for the list"),
  allowReorder: z.boolean().optional().default(true).describe("Allow drag-and-drop reordering"),
  allowCheckboxes: z.boolean().optional().default(true).describe("Show checkboxes for items"),
  compact: z.boolean().optional().default(false).describe("Use compact layout mode"),
  showImages: z.boolean().optional().default(true).describe("Display item images if available"),
});

export type ListToolInput = z.infer<typeof ListToolInputSchema>;

/**
 * List state that gets sent back to the agent via updateModelContext
 */
export interface ListState {
  itemOrder?: string[];
  checkedItemIds?: string[];
  selectedItemId?: string | null;
}
