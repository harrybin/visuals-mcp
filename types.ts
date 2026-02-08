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
 * Detail content can be one of: table, image, or custom HTML/text
 */
export const DetailContentSchema = z.union([
  z.object({
    type: z.literal("table"),
    data: TableToolInputSchema,
  }),
  z.object({
    type: z.literal("image"),
    data: ImageToolInputSchema,
  }),
  z.object({
    type: z.literal("text"),
    data: z.object({
      content: z.string().describe("Text or HTML content to display"),
      isHtml: z.boolean().optional().default(false),
    }),
  }),
]);

export type DetailContent = z.infer<typeof DetailContentSchema>;

/**
 * Master item schema - represents an item in the master list
 */
export const MasterItemSchema = z.object({
  id: z.string().describe("Unique identifier for the item"),
  label: z.string().describe("Display label for the item"),
  description: z.string().optional().describe("Optional description"),
  icon: z.string().optional().describe("Optional icon or emoji"),
  metadata: z.record(z.string(), z.any()).optional().describe("Additional metadata"),
});

export type MasterItem = z.infer<typeof MasterItemSchema>;

/**
 * Input schema for the display_master_detail tool
 */
export const MasterDetailToolInputSchema = z.object({
  title: z.string().optional().describe("Optional title for the master-detail view"),
  masterItems: z.array(MasterItemSchema).describe("Array of items to display in master list"),
  detailContents: z.record(z.string(), DetailContentSchema).describe(
    "Map of item IDs to their detail content. Keys should match masterItems IDs."
  ),
  defaultSelectedId: z.string().optional().describe("ID of item to select by default"),
  masterWidth: z.number().optional().default(300).describe("Width of master panel in pixels"),
  orientation: z.enum(["horizontal", "vertical"]).optional().default("horizontal").describe(
    "Layout orientation: horizontal (side-by-side) or vertical (stacked)"
  ),
});

export type MasterDetailToolInput = z.infer<typeof MasterDetailToolInputSchema>;

/**
 * Master-detail state that gets sent back to the agent via updateModelContext
 */
export interface MasterDetailState {
  selectedItemId?: string;
  selectedItem?: MasterItem;
}
