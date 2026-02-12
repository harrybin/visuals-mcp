# MCP Visuals Server

An MCP (Model Context Protocol) server that provides interactive visualizations for AI agents. Display data in rich, interactive formats including **tables** with TanStack Table, **image previews** with metadata, **master-detail views** for browsing collections, **tree views** for hierarchical data, and **customizable lists** with drag-and-drop reordering.

## Features

### Table Visualization

- **Interactive Table Display**: Full-featured data table with TanStack Table v8
- **Sorting**: Click column headers to sort ascending/descending
- **Filtering**: Per-column text filters with apply button
- **Pagination**: Customizable page sizes (5, 10, 20, 50, 100 rows)
- **Column Visibility**: Toggle which columns are displayed
- **Row Selection**: Select individual rows or all rows
- **Export**: Copy as CSV/TSV or export to PDF
- **Agent Integration**: Table state (selections, filters, sorting) automatically sent back to the LLM via `updateModelContext`
- **Theme Integration**: Respects VS Code theme colors and fonts
- **Responsive**: Works on different screen sizes
- **Generic Data Support**: Accepts any column structure and data types

### Image Preview

- **Rich Image Cards**: Display images with title, caption, and metadata
- **Metadata Display**: Show filename, dimensions, and file size
- **Flexible Sources**: Support URLs and data URIs
- **Local File Support**: Automatically converts local file paths to data URIs
- **Theme Integration**: Respects VS Code theme colors and fonts

### Master-Detail View

- **Flexible Layout**: Display a list of items with detailed content panel
- **Multiple Content Types**: Detail panel supports tables, images, or custom text/HTML
- **Reusable Components**: Leverages existing table and image visualizations
- **Configurable Layout**: Choose horizontal (side-by-side) or vertical (stacked) orientation
- **State Management**: Selection state automatically sent back to LLM
- **Rich Master List**: Display items with icons, labels, and descriptions
- **Theme Integration**: Consistent theming across all components

### Tree View

- **Hierarchical Data Display**: Interactive tree structure for nested data
- **Expand/Collapse**: Click to expand or collapse nodes
- **Node Selection**: Select individual nodes to highlight them
- **Metadata Support**: Display optional metadata for each node
- **Icons**: Add custom icons/emojis to nodes
- **Bulk Operations**: Expand all or collapse all nodes at once
- **Export Options**: Copy tree to clipboard, export as HTML, or save as image (PNG)
- **Agent Integration**: Tree state (expanded nodes, selection) sent back to the LLM
- **Theme Integration**: Respects VS Code theme colors and fonts
- **Use Cases**: File systems, org charts, nested categories, JSON/XML structures

### List Visualization

- **Interactive Lists**: Display any type of list with rich formatting
- **Drag-and-Drop Reordering**: Easily reorder items by dragging
- **Checkboxes**: Optional checkboxes for task lists and selections
- **Image Thumbnails**: Show images alongside list items
- **Compact Mode**: Toggle between comfortable and compact layouts
- **Export Options**: Copy as plain text, CSV, or JSON
- **Individual Item Copy**: Quick copy button for each item
- **Subtext Support**: Secondary text/description for each item
- **Metadata**: Attach custom metadata to items
- **Theme Integration**: Respects VS Code theme colors and fonts

## Screenshots

![Table Example](doc/table-example.png)

*Interactive table with sorting, filtering, pagination, and row selection*

![List Example](doc/list-example.png)

*Interactive list with drag-and-drop reordering, checkboxes, and image thumbnails*

![Tree Example](doc/tree-example.png)

*Interactive tree view with expand/collapse, node selection, and export options*

## Installation

### npmjs (Recommended)

In **VSCode** github Copilot Chat 
- click on the tools icon (Configure tools...) 
- click on "Add MCP Server"
- click on "Install from npm"
- enter `@harrybin/visuals-mcp` 
- press enter / click "Install"

Using command line:

```bash
npm install -g @harrybin/visuals-mcp
visuals-mcp
```


### GitHub Packages

1. Authenticate npm with GitHub Packages:

```bash
npm config set @harrybin:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

2. Install and run:

```bash
npm install -g @harrybin/visuals-mcp
visuals-mcp
```

### Local Development

```bash
# Install dependencies
npm install

# Build the UI
npm run build

# Run the server
npm run serve
```

## Project Structure

```
visuals-mcp/
├── server.ts                      # MCP server implementation
├── types.ts                       # TypeScript type definitions
├── src/
│   ├── table-app.tsx             # React app with TanStack Table
│   ├── table-app.css             # Table styling
│   ├── image-app.tsx             # React app for image previews
│   ├── image.css                 # Image preview styling
│   ├── master-detail-app.tsx     # React app for master-detail views
│   └── master-detail.css         # Master-detail styling
├── mcp-table.html                # HTML entry point for tables
├── mcp-image.html                # HTML entry point for images
├── mcp-master-detail.html        # HTML entry point for master-detail
├── vite.config.table.ts          # Vite build config for tables
├── vite.config.image.ts          # Vite build config for images
├── vite.config.master-detail.ts  # Vite build config for master-detail
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

## Usage

### Tool: `display_table`

Displays an interactive table with the provided column definitions and row data.

**Input:**

```json
{
  "columns": [
    {
      "key": "id",
      "label": "ID",
      "type": "number",
      "sortable": true,
      "filterable": true,
      "width": 80
    },
    {
      "key": "name",
      "label": "Name",
      "type": "string",
      "sortable": true,
      "filterable": true
    },
    {
      "key": "email",
      "label": "Email",
      "type": "string"
    },
    {
      "key": "active",
      "label": "Active",
      "type": "boolean"
    },
    {
      "key": "created",
      "label": "Created",
      "type": "date"
    }
  ],
  "rows": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "active": true,
      "created": "2024-01-15"
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "active": false,
      "created": "2024-02-20"
    }
  ],
  "title": "User Management",
  "allowRowSelection": true,
  "allowColumnVisibility": true,
  "pageSize": 10
}
```

**Column Definition:**

- `key` (required): Unique identifier that maps to data property
- `label` (required): Display name in header
- `type`: `"string"` | `"number"` | `"date"` | `"boolean"` (default: `"string"`)
- `sortable`: Enable sorting (default: `true`)
- `filterable`: Enable filtering (default: `true`)
- `width`: Column width in pixels (optional)

**Optional Parameters:**

- `title`: Display title above the table
- `allowRowSelection`: Enable row selection checkboxes (default: `true`)
- `allowColumnVisibility`: Enable column visibility toggle (default: `true`)
- `pageSize`: Initial rows per page (default: `10`)

### Tool: `query_table_data`

UI-only tool for server-side data operations (hidden from the model). The UI can call this to request filtered/sorted data from the server for large datasets.

**Input:**

```json
{
  "sortBy": [
    {
      "columnKey": "name",
      "direction": "asc"
    }
  ],
  "filters": {
    "email": "example.com"
  },
  "page": 0,
  "pageSize": 20
}
```

### Tool: `display_image`

Displays an image preview card with optional metadata.

**Input:**

```json
{
  "src": "https://example.com/preview.png",
  "title": "Preview",
  "alt": "Screenshot preview",
  "caption": "Latest build output",
  "filename": "preview.png",
  "sizeBytes": 154233,
  "width": 1200,
  "height": 800
}
```

### Tool: `display_master_detail`

Displays a master-detail view with a list of items and detailed content panel. The detail panel can show tables, images, or custom text/HTML content.

**Input:**

```json
{
  "title": "Product Catalog",
  "masterItems": [
    {
      "id": "product1",
      "label": "Smart Watch Pro",
      "description": "Advanced fitness tracking",
      "icon": "⌚"
    },
    {
      "id": "product2", 
      "label": "Wireless Earbuds",
      "description": "Premium sound quality",
      "icon": "🎧"
    }
  ],
  "detailContents": {
    "product1": {
      "type": "table",
      "data": {
        "title": "Specifications",
        "columns": [
          { "key": "feature", "label": "Feature", "type": "string" },
          { "key": "value", "label": "Value", "type": "string" }
        ],
        "rows": [
          { "feature": "Display", "value": "1.4\" AMOLED" },
          { "feature": "Battery Life", "value": "7 days" }
        ]
      }
    },
    "product2": {
      "type": "image",
      "data": {
        "src": "https://example.com/earbuds.png",
        "title": "Wireless Earbuds",
        "caption": "Premium design with active noise cancellation"
      }
    }
  },
  "defaultSelectedId": "product1",
  "masterWidth": 300,
  "orientation": "horizontal"
}
```

**Parameters:**

- `masterItems` (required): Array of items to display in the master list
  - `id` (required): Unique identifier
  - `label` (required): Display name
  - `description` (optional): Subtitle text
  - `icon` (optional): Icon or emoji
  - `metadata` (optional): Additional data
- `detailContents` (required): Map of item IDs to detail content
  - `type`: `"table"` | `"image"` | `"text"`
  - `data`: Content following the respective tool schema
- `title` (optional): View title
- `defaultSelectedId` (optional): Initially selected item
- `masterWidth` (optional): Master panel width in pixels (default: 300)
- `orientation` (optional): `"horizontal"` | `"vertical"` (default: "horizontal")

**Use Cases:**

- Product catalogs with detailed specifications
- File browsers with preview panels
- Document libraries with content viewer
- Configuration panels with settings details
- Any collection requiring item-by-item exploration

See [doc/master-detail-example.json](./doc/master-detail-example.json) for a complete example.

### 1. Configure MCP Server

**For VS Code:** This workspace includes MCP configuration in `.vscode/settings.json`.

To add globally, update your VS Code settings:

```json
{
  "github.copilot.chat.mcpServers": {
    "visuals-mcp": {
			"type": "stdio",
			"command": "node",
			"args": [
				"dist/server.js"
			]
		}
  }
}
```

**For Claude Desktop:** See `claude_desktop_config.json` for example configuration.


## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Resources

- [MCP Apps Documentation](https://modelcontextprotocol.github.io/ext-apps/api/)
- [MCP Apps Examples](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [VS Code MCP Guide](https://code.visualstudio.com/docs/copilot/guides/mcp-developer-guide)
