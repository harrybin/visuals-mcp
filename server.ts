#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  TableToolInputSchema,
  QueryTableDataInputSchema,
  ImageToolInputSchema,
  MasterDetailToolInputSchema,
  TreeToolInputSchema,
  ListToolInputSchema,
} from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to convert file paths to data URIs
function fileToDataUri(src: string): string {
  // If already a data URI or HTTP URL, return as-is
  if (
    src.startsWith("data:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  // Convert file:// URL to local path
  let filePath = src;
  if (src.startsWith("file://")) {
    // Remove file:// prefix and decode URL encoding
    filePath = decodeURIComponent(src.slice(7));

    // On Windows, handle drive letters correctly
    // file:///C:/path -> C:/path (already ok)
    // file://d:/path -> d:/path (remove leading slash)
    if (
      process.platform === "win32" &&
      filePath.startsWith("/") &&
      filePath[2] === ":"
    ) {
      filePath = filePath.slice(1);
    }
  }

  // Normalize the path
  filePath = filePath.replace(/\\/g, "/");

  console.log(`Converting to data URI: ${filePath}`);

  // Check if file exists
  if (!existsSync(filePath)) {
    console.warn(`File not found: ${filePath}, returning original src`);
    return src;
  }

  // Determine MIME type from extension
  const ext = filePath.toLowerCase().split(".").pop() || "";
  const mimeTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    bmp: "image/bmp",
  };

  const mimeType = mimeTypes[ext] || "image/png";

  // Read file and convert to base64
  try {
    const buffer = readFileSync(filePath);
    const base64 = buffer.toString("base64");
    console.log(`Successfully converted ${filePath} to data URI`);
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error);
    return src;
  }
}

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
      {
        name: "display_image",
        description:
          "Display/show any image to the user with an interactive preview card. Use this tool to show screenshots, diagrams, charts, photographs, or any visual content. Provides optional metadata including title, caption, dimensions, and file information. Always use this tool whenever you need to present visual content. This also applies to listings and any other imageoperations like get, download etc..these formats are explicitly handled: PNG, JPG, JPEG, GIF, SVG, WebP, BMP. The UI itself can display any image if the src is a valid URL or data URI, but local file paths are only auto-converted for those extensions",
        inputSchema: {
          type: "object",
          properties: {
            src: {
              type: "string",
              description:
                "Image URL or data URI. Required. This is the source of the image to display.",
            },
            title: {
              type: "string",
              description:
                "Optional title displayed above the image. Use to provide context or describe what the image shows.",
            },
            alt: {
              type: "string",
              description:
                "Alt text for accessibility. Describe the image content for screen readers and when image fails to load.",
            },
            caption: {
              type: "string",
              description:
                "Optional caption displayed below the image. Use to explain key details, findings, or analysis related to the image.",
            },
            width: {
              type: "number",
              description:
                "Optional width in pixels to constrain the image. Use to control display size.",
            },
            height: {
              type: "number",
              description:
                "Optional height in pixels to constrain the image. Use to control display size.",
            },
            filename: {
              type: "string",
              description:
                "Optional original filename to display. Useful for showing file information alongside the preview.",
            },
            sizeBytes: {
              type: "number",
              description:
                "Optional file size in bytes. Displayed as formatted file size (KB, MB). Useful for showing storage information.",
            },
          },
          required: ["src"],
        },
        _meta: {
          ui: {
            resourceUri: "image://preview",
            visibility: ["model", "app"],
          },
        },
      },
      {
        name: "display_master_detail",
        description:
          "Display a master-detail view with a list of items on the left/top and details on the right/bottom. " +
          "The detail panel can show tables, images, or custom content. Perfect for browsing collections, " +
          "comparing items, or navigating hierarchical data.",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Optional title for the master-detail view",
            },
            masterItems: {
              type: "array",
              description: "Array of items to display in the master list",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Unique identifier for the item",
                  },
                  label: {
                    type: "string",
                    description: "Display label for the item",
                  },
                  description: {
                    type: "string",
                    description: "Optional description shown below the label",
                  },
                  icon: {
                    type: "string",
                    description: "Optional icon or emoji to display",
                  },
                  metadata: {
                    type: "object",
                    description: "Additional metadata for the item",
                  },
                },
                required: ["id", "label"],
              },
            },
            detailContents: {
              type: "object",
              description:
                "Map of item IDs to their detail content. Each key should match a masterItems ID.",
              additionalProperties: {
                oneOf: [
                  {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["table"] },
                      data: {
                        type: "object",
                        description:
                          "Table data following display_table schema",
                      },
                    },
                    required: ["type", "data"],
                  },
                  {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["image"] },
                      data: {
                        type: "object",
                        description:
                          "Image data following display_image schema",
                      },
                    },
                    required: ["type", "data"],
                  },
                  {
                    type: "object",
                    properties: {
                      type: { type: "string", enum: ["text"] },
                      data: {
                        type: "object",
                        properties: {
                          content: {
                            type: "string",
                            description: "Text or HTML content to display",
                          },
                          isHtml: {
                            type: "boolean",
                            description: "Whether content is HTML",
                            default: false,
                          },
                        },
                        required: ["content"],
                      },
                    },
                    required: ["type", "data"],
                  },
                ],
              },
            },
            defaultSelectedId: {
              type: "string",
              description: "ID of item to select by default",
            },
            masterWidth: {
              type: "number",
              description: "Width of master panel in pixels (default: 300)",
              default: 300,
            },
            orientation: {
              type: "string",
              enum: ["horizontal", "vertical"],
              description:
                "Layout orientation: horizontal (side-by-side) or vertical (stacked)",
              default: "horizontal",
            },
          },
          required: ["masterItems", "detailContents"],
        },
        _meta: {
          ui: {
            resourceUri: "master-detail://display",
            visibility: ["model", "app"],
          },
        },
      },
      {
        name: "display_tree",
        description:
          "Display an interactive tree view for hierarchical data structures. " +
          "Use this tool to visualize file systems, organizational charts, nested categories, JSON/XML structures, or any hierarchical relationships. " +
          "Supports node expansion/collapse, metadata display, and export functionality.",
        inputSchema: {
          type: "object",
          properties: {
            nodes: {
              type: "array",
              description: "Array of root tree nodes",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Unique identifier for the node",
                  },
                  label: {
                    type: "string",
                    description: "Display label for the node",
                  },
                  children: {
                    type: "array",
                    description: "Optional child nodes",
                    items: { type: "object" },
                  },
                  metadata: {
                    type: "object",
                    description: "Optional metadata for the node",
                  },
                  icon: {
                    type: "string",
                    description: "Optional icon/emoji for the node",
                  },
                  expanded: {
                    type: "boolean",
                    default: false,
                    description:
                      "Whether the node should be initially expanded",
                  },
                },
                required: ["id", "label"],
              },
            },
            title: {
              type: "string",
              description: "Optional title for the tree view",
            },
            expandAll: {
              type: "boolean",
              default: false,
              description: "Expand all nodes initially",
            },
            showMetadata: {
              type: "boolean",
              default: true,
              description: "Show metadata in tree nodes",
            },
          },
          required: ["nodes"],
        },
        _meta: {
          ui: {
            resourceUri: "tree://display",
            visibility: ["model", "app"],
          },
        },
      },
      {
        name: "display_list",
        description:
          "Display an interactive, customizable list with optional checkboxes, drag-and-drop reordering, image thumbnails, and copy/export functionality. " +
          "Perfect for displaying any type of list: tasks, items, options, files, or any sequential data. " +
          "Features include compact/comfortable views, individual item copy, and bulk export (CSV, JSON, text).",
        inputSchema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              description: "Array of list items to display",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Unique identifier for the list item",
                  },
                  content: {
                    type: "string",
                    description: "Text content of the list item",
                  },
                  checked: {
                    type: "boolean",
                    default: false,
                    description: "Whether the item is checked",
                  },
                  image: {
                    type: "string",
                    description: "Optional image URL or data URI for the item",
                  },
                  subtext: {
                    type: "string",
                    description: "Optional secondary text/description",
                  },
                  metadata: {
                    type: "object",
                    description: "Optional metadata for the item",
                  },
                },
                required: ["id", "content"],
              },
            },
            title: {
              type: "string",
              description: "Optional title for the list",
            },
            allowReorder: {
              type: "boolean",
              default: true,
              description: "Allow drag-and-drop reordering",
            },
            allowCheckboxes: {
              type: "boolean",
              default: true,
              description: "Show checkboxes for items",
            },
            compact: {
              type: "boolean",
              default: false,
              description: "Use compact layout mode",
            },
            showImages: {
              type: "boolean",
              default: true,
              description: "Display item images if available",
            },
          },
          required: ["items"],
        },
        _meta: {
          ui: {
            resourceUri: "list://display",
            visibility: ["model", "app"],
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

  if (name === "display_image") {
    const input = ImageToolInputSchema.parse(args);

    // Convert file paths to data URIs for browser compatibility
    const processedInput = {
      ...input,
      src: fileToDataUri(input.src),
    };

    return {
      content: [
        {
          type: "text",
          text: `Displaying image preview.${input.title ? ` Title: ${input.title}` : ""}`,
        },
      ],
      _meta: {
        ui: {
          data: processedInput,
        },
      },
    };
  }

  if (name === "display_master_detail") {
    const input = MasterDetailToolInputSchema.parse(args);

    // Process image sources in detail contents
    const processedDetailContents: Record<string, any> = {};
    for (const [itemId, content] of Object.entries(input.detailContents)) {
      if (content.type === "image") {
        processedDetailContents[itemId] = {
          ...content,
          data: {
            ...content.data,
            src: fileToDataUri(content.data.src),
          },
        };
      } else {
        processedDetailContents[itemId] = content;
      }
    }

    const processedInput = {
      ...input,
      detailContents: processedDetailContents,
    };

    return {
      content: [
        {
          type: "text",
          text: `Displaying master-detail view with ${input.masterItems.length} items.${input.title ? ` Title: ${input.title}` : ""}`,
        },
      ],
      _meta: {
        ui: {
          data: processedInput,
        },
      },
    };
  }

  if (name === "display_tree") {
    const input = TreeToolInputSchema.parse(args);

    // Count total nodes recursively
    const countNodes = (nodes: any[]): number => {
      return nodes.reduce(
        (count, node) =>
          count + 1 + (node.children ? countNodes(node.children) : 0),
        0,
      );
    };

    const totalNodes = countNodes(input.nodes);

    return {
      content: [
        {
          type: "text",
          text: `Displaying tree view with ${totalNodes} total nodes.${input.title ? ` Title: ${input.title}` : ""}`,
        },
      ],
      _meta: {
        ui: {
          data: input,
        },
      },
    };
  }

  if (name === "display_list") {
    const input = ListToolInputSchema.parse(args);

    // Convert image file paths to data URIs if present
    const processedItems = input.items.map((item) => {
      if (item.image) {
        return {
          ...item,
          image: fileToDataUri(item.image),
        };
      }
      return item;
    });

    const processedInput = {
      ...input,
      items: processedItems,
    };

    return {
      content: [
        {
          type: "text",
          text: `Displaying list with ${input.items.length} items.${input.title ? ` Title: ${input.title}` : ""}`,
        },
      ],
      _meta: {
        ui: {
          data: processedInput,
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
      {
        uri: "image://preview",
        name: "Image Preview Card",
        description: "HTML resource for rendering image preview cards",
        mimeType: "text/html",
      },
      {
        uri: "master-detail://display",
        name: "Master-Detail View",
        description:
          "HTML resource for rendering master-detail layouts with tables, images, and text",
        mimeType: "text/html",
      },
      {
        uri: "tree://display",
        name: "Interactive Tree View",
        description:
          "HTML resource for rendering hierarchical tree structures with expand/collapse and export",
        mimeType: "text/html",
      },
      {
        uri: "list://display",
        name: "Interactive List Display",
        description:
          "HTML resource for rendering interactive lists with drag-and-drop reordering, checkboxes, and export",
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
      const htmlPath = join(__dirname, "mcp-table.html");
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

  if (uri === "image://preview") {
    try {
      const htmlPath = join(__dirname, "mcp-image.html");
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

  if (uri === "master-detail://display") {
    try {
      const htmlPath = join(__dirname, "mcp-master-detail.html");
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

  if (uri === "tree://display") {
    try {
      const htmlPath = join(__dirname, "mcp-tree.html");
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

  if (uri === "list://display") {
    try {
      const htmlPath = join(__dirname, "mcp-list.html");
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
