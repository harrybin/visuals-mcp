# MCP Visuals Server

An MCP (Model Context Protocol) server that provides interactive visualizations for AI agents. Display data in rich, interactive formats including **tables** with TanStack Table, **image previews** with metadata, and **tree views** for hierarchical data.

## Features

### Table Visualization

- **Interactive Table Display**: Full-featured data table with TanStack Table v8
- **Sorting**: Click column headers to sort ascending/descending
- **Filtering**: Per-column text filters with apply button
- **Pagination**: Customizable page sizes (5, 10, 20, 50, 100 rows)
- **Column Visibility**: Toggle which columns are displayed
- **Row Selection**: Select individual rows or all rows
- **Export**: Copy as CSV/TSV or export as PDF
- **Agent Integration**: Table state (selections, filters, sorting) automatically sent back to the LLM via `updateModelContext`
- **Theme Integration**: Respects VS Code theme colors and fonts
- **Responsive**: Works on different screen sizes
- **Generic Data Support**: Accepts any column structure and data types

### Image Preview

- **Rich Image Cards**: Display images with title, caption, and metadata
- **Metadata Display**: Show filename, dimensions, and file size
- **Flexible Sources**: Support URLs and data URIs
- **Theme Integration**: Respects VS Code theme colors and fonts

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

## Screenshot

![Table Example](doc/table-example.png)

*Interactive table with sorting, filtering, pagination, and row selection*

## Installation

### GitHub Packages (Recommended)

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
├── server.ts                # MCP server implementation
├── types.ts                 # TypeScript type definitions
├── src/
│   ├── table-app.tsx       # React app with TanStack Table
│   ├── table-app.css       # Styling
│   ├── table.tsx           # Table component
│   ├── table-export.ts     # Table export utilities
│   ├── image-app.tsx       # React app for image previews
│   ├── image.css           # Image preview styling
│   ├── tree-app.tsx        # React app for tree views
│   ├── tree.tsx            # Tree component
│   ├── tree-export.ts      # Tree export utilities
│   └── tree.css            # Tree view styling
├── mcp-table.html          # HTML entry point for table
├── mcp-image.html          # HTML entry point for image preview
├── mcp-tree.html           # HTML entry point for tree view
├── vite.config.table.ts    # Vite build configuration for table
├── vite.config.image.ts    # Vite build configuration for image
├── vite.config.tree.ts     # Vite build configuration for tree
├── tsconfig.json           # TypeScript configuration
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

### Tool: `display_tree`

Displays an interactive tree view for hierarchical data structures. Perfect for visualizing file systems, organizational charts, nested categories, JSON/XML structures, or any hierarchical relationships.

**Input:**

```json
{
  "nodes": [
    {
      "id": "root",
      "label": "My Project",
      "icon": "📁",
      "expanded": true,
      "children": [
        {
          "id": "src",
          "label": "src",
          "icon": "📂",
          "expanded": true,
          "metadata": {
            "type": "directory",
            "items": 5
          },
          "children": [
            {
              "id": "app.ts",
              "label": "app.ts",
              "icon": "📄",
              "metadata": {
                "type": "file",
                "size": "2.5 KB"
              }
            },
            {
              "id": "utils.ts",
              "label": "utils.ts",
              "icon": "📄",
              "metadata": {
                "type": "file",
                "size": "1.8 KB"
              }
            }
          ]
        },
        {
          "id": "package.json",
          "label": "package.json",
          "icon": "📦",
          "metadata": {
            "type": "config",
            "size": "1.2 KB"
          }
        }
      ]
    }
  ],
  "title": "Project Structure",
  "expandAll": false,
  "showMetadata": true
}
```

**Node Properties:**

- `id` (required): Unique identifier for the node
- `label` (required): Display label for the node
- `children` (optional): Array of child nodes for hierarchical structure
- `metadata` (optional): Key-value pairs to display alongside the node
- `icon` (optional): Emoji or icon character for the node
- `expanded` (optional): Whether the node should be initially expanded (default: `false`)

**Optional Parameters:**

- `title`: Display title above the tree view
- `expandAll`: Expand all nodes initially (default: `false`)
- `showMetadata`: Show metadata in tree nodes (default: `true`)

**Export Features:**

- **Copy to Clipboard**: Copies tree as formatted text with tree structure characters (├──, └──, etc.)
- **Export as HTML**: Downloads standalone HTML file with styled tree visualization
- **Export as Image**: Downloads tree view as PNG image (browser-dependent)

## Example: Using in VS Code with MCP

### 1. Configure MCP Server

**For VS Code:** This workspace includes MCP configuration in `.vscode/settings.json`.

To add globally, update your VS Code settings:

```json
{
  "github.copilot.chat.mcpServers": {
    "table-server": {
      "command": "tsx",
      "args": ["D:\\harrybin\\visuals-mcp\\server.ts"]
    }
  }
}
```

**For Claude Desktop:** See `claude_desktop_config.json` for example configuration.

**For detailed setup:** See [MCP_SETUP.md](./MCP_SETUP.md)

### 2. Example Agent Interaction

**User:** "Show me a table of the top 10 GitHub repositories by stars"

**Agent:**
```typescript
// Agent calls display_table tool
{
  "columns": [
    { "key": "name", "label": "Repository", "type": "string" },
    { "key": "stars", "label": "Stars", "type": "number" },
    { "key": "language", "label": "Language", "type": "string" },
    { "key": "updated", "label": "Last Updated", "type": "date" }
  ],
  "rows": [
    { "name": "freeCodeCamp/freeCodeCamp", "stars": 385000, "language": "JavaScript", "updated": "2024-02-01" },
    { "name": "996icu/996.ICU", "stars": 268000, "language": "Markdown", "updated": "2023-12-15" },
    // ... more rows
  ],
  "title": "Top GitHub Repositories by Stars"
}
```

The agent sees an interactive table where the user can:
- Sort by any column (click header)
- Filter repositories by name/language
- Select specific repos
- Change page size

When the user selects rows or applies filters, the agent receives updates via `updateModelContext`:

```json
{
  "type": "table_state",
  "state": {
    "sortBy": [{ "columnKey": "stars", "direction": "desc" }],
    "filters": { "language": "JavaScript" },
    "selectedRowIds": ["0", "2", "5"],
    "visibleColumns": ["name", "stars", "language"]
  },
  "summary": "3 rows selected, 1 filters active, 1 columns sorted"
}
```

## Development

### Build and Watch

```bash
# Build UI and run server with auto-reload
npm run dev
```

### Testing with basic-host

1. Clone the MCP Apps SDK:
```bash
git clone https://github.com/modelcontextprotocol/ext-apps.git /tmp/mcp-ext-apps
```

2. Build and run your server:
```bash
npm run build
npm run serve
```

3. Start basic-host:
```bash
cd /tmp/mcp-ext-apps/examples/basic-host
npm install
SERVERS='["stdio:///path/to/mcp-table-server/server.ts"]' npm run start
```

4. Open http://localhost:8080 and test the table

### Debugging

Add debug logs in your React component:

```typescript
await app.sendLog({ level: "info", data: "Table rendered with X rows" });
```

Logs appear in the MCP host's console.

## Data Types and Formatting

The table automatically formats values based on column type:

- **string**: Displayed as-is
- **number**: Formatted with locale-aware thousands separators (e.g., `1,000`)
- **date**: Formatted using `toLocaleDateString()` (e.g., `1/15/2024`)
- **boolean**: Displayed as `✓` (true) or `✗` (false)

## Architecture

### Server Flow

1. Agent calls `display_table` tool with columns and rows
2. Server validates input with Zod schema
3. Server stores data in memory (for `query_table_data`)
4. Server returns resource reference (`table://display`)
5. VS Code requests HTML resource
6. Server reads bundled `dist/mcp-table.html` and returns it

### UI Flow

1. React app initializes with `useApp()` hook
2. `ontoolinput` handler receives table data
3. TanStack Table renders interactive table
4. User interactions (sort, filter, select) update local state
5. `useEffect` sends state changes to agent via `updateModelContext`
6. Agent sees current table state and can respond

### Theme Integration

The UI uses CSS variables from the host context:
- `--color-background-primary`, `--color-background-secondary`
- `--color-text-primary`, `--color-text-secondary`
- `--font-sans`, `--font-mono`
- `--border-radius-md`, etc.

Applied automatically via `useHostStyles(app)` hook.

## Advanced Usage

### Custom Column Rendering

Modify [src/table-app.tsx](src/table-app.tsx) to add custom cell renderers:

```typescript
cell: ({ getValue, row }) => {
  const value = getValue();
  
  if (col.key === "avatar") {
    return <img src={value} alt="Avatar" />;
  }
  
  if (col.key === "status") {
    return <span className={`badge ${value}`}>{value}</span>;
  }
  
  // Default rendering...
}
```

### Server-Side Filtering for Large Data

For datasets with >1000 rows, implement server-side filtering:

1. Agent calls `display_table` with initial page
2. UI calls `query_table_data` when user applies filter
3. Server returns filtered subset
4. UI updates with new data

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Resources

- [MCP Apps Documentation](https://modelcontextprotocol.github.io/ext-apps/api/)
- [MCP Apps Examples](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [VS Code MCP Guide](https://code.visualstudio.com/docs/copilot/guides/mcp-developer-guide)
