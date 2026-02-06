#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { TableToolInputSchema, QueryTableDataInputSchema } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Store table data for server-side operations (in memory for demo)
let currentTableData: any = null;

const server = new Server(
  {
    name: "visuals-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  },
);

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "display_table",
        description:
          "Display an interactive table with sorting, filtering, pagination, column visibility, and row selection. " +
          "Accepts column definitions and row data. Returns a visual table component that users can interact with.",
        inputSchema: {
          type: "object",
          properties: {
            columns: {
              type: "array",
              description: "Array of column definitions",
              items: {
                type: "object",
                properties: {
                  key: {
                    type: "string",
                    description:
                      "Unique key for the column (maps to data property)",
                  },
                  label: {
                    type: "string",
                    description: "Display label for the column header",
                  },
                  type: {
                    type: "string",
                    enum: ["string", "number", "date", "boolean"],
                    default: "string",
                  },
                  sortable: { type: "boolean", default: true },
                  filterable: { type: "boolean", default: true },
                  width: {
                    type: "number",
                    description: "Column width in pixels",
                  },
                },
                required: ["key", "label"],
              },
            },
            rows: {
              type: "array",
              description: "Array of row data objects",
              items: { type: "object" },
            },
            title: {
              type: "string",
              description: "Optional title for the table",
            },
            allowRowSelection: { type: "boolean", default: true },
            allowColumnVisibility: { type: "boolean", default: true },
            pageSize: { type: "number", default: 10 },
          },
          required: ["columns", "rows"],
        },
        _meta: {
          ui: {
            resourceUri: "table://display",
            visibility: ["model", "app"],
          },
        },
      },
      {
        name: "query_table_data",
        description:
          "Query table data with server-side sorting and filtering. UI-only tool for performance with large datasets.",
        inputSchema: {
          type: "object",
          properties: {
            sortBy: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  columnKey: { type: "string" },
                  direction: { type: "string", enum: ["asc", "desc"] },
                },
              },
            },
            filters: { type: "object" },
            page: { type: "number" },
            pageSize: { type: "number" },
          },
        },
        _meta: {
          ui: {
            visibility: ["app"], // UI-only tool - hidden from model
          },
        },
      },
    ],
  };
});

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "display_table") {
    // Validate input
    const input = TableToolInputSchema.parse(args);

    // Store data for server-side operations
    currentTableData = input;

    return {
      content: [
        {
          type: "text",
          text: `Displaying table with ${input.rows.length} rows and ${input.columns.length} columns.${input.title ? ` Title: ${input.title}` : ""}`,
        },
      ],
      _meta: {
        ui: {
          data: input, // Pass data to the UI
        },
      },
    };
  }

  if (name === "query_table_data") {
    // Validate input
    const query = QueryTableDataInputSchema.parse(args);

    if (!currentTableData) {
      throw new Error("No table data available. Call display_table first.");
    }

    let filteredRows = [...currentTableData.rows];

    // Apply filters
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        filteredRows = filteredRows.filter((row) =>
          String(row[key]).toLowerCase().includes(String(value).toLowerCase()),
        );
      });
    }

    // Apply sorting
    if (query.sortBy && query.sortBy.length > 0) {
      filteredRows.sort((a, b) => {
        for (const sort of query.sortBy!) {
          const aVal = a[sort.columnKey];
          const bVal = b[sort.columnKey];

          let comparison = 0;
          if (aVal < bVal) comparison = -1;
          if (aVal > bVal) comparison = 1;

          if (comparison !== 0) {
            return sort.direction === "asc" ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    // Apply pagination
    const page = query.page ?? 0;
    const pageSize = query.pageSize ?? currentTableData.pageSize ?? 10;
    const start = page * pageSize;
    const paginatedRows = filteredRows.slice(start, start + pageSize);

    return {
      content: [
        {
          type: "text",
          text: `Returned ${paginatedRows.length} rows (page ${page + 1})`,
        },
      ],
      _meta: {
        ui: {
          data: {
            rows: paginatedRows,
            totalRows: filteredRows.length,
            page,
            pageSize,
          },
        },
      },
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

/**
 * List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "table://display",
        name: "Interactive Table Display",
        description:
          "HTML resource for rendering interactive tables with TanStack Table",
        mimeType: "text/html",
      },
    ],
  };
});

/**
 * Read resource content
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "table://display") {
    try {
      const htmlPath = join(__dirname, "mcp-app.html");
      const htmlContent = readFileSync(htmlPath, "utf-8");

      return {
        contents: [
          {
            uri,
            mimeType: "text/html",
            text: htmlContent,
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to read HTML resource. Make sure to run 'npm run build' first. Error: ${error}`,
      );
    }
  }

  throw new Error(`Unknown resource: ${uri}`);
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Table Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
