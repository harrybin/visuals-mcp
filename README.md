# MCP Visuals Server

An MCP (Model Context Protocol) server that provides interactive visualizations for AI agents. Display data in rich, interactive formats including **tables** with TanStack Table, **image previews** with metadata, and **customizable lists** with drag-and-drop reordering.

## Features

### Table Visualization

- **Interactive Table Display**: Full-featured data table with TanStack Table v8
- **Sorting**: Click column headers to sort ascending/descending
- **Filtering**: Per-column text filters with apply button
- **Pagination**: Customizable page sizes (5, 10, 20, 50, 100 rows)
- **Column Visibility**: Toggle which columns are displayed
- **Row Selection**: Select individual rows or all rows
- **Export**: Copy as CSV, TSV, or export to PDF
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
│   ├── image-app.tsx       # React app for image previews
│   └── image.css           # Image preview styling
├── mcp-table.html          # HTML entry point
├── mcp-image.html          # HTML entry point for image preview
├── vite.config.ts          # Vite build configuration
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

### Tool: `display_list`

Displays an interactive, customizable list with drag-and-drop reordering, checkboxes, and export functionality.

**Input:**

```json
{
  "items": [
    {
      "id": "1",
      "content": "Review pull requests",
      "checked": true,
      "subtext": "3 PRs pending"
    },
    {
      "id": "2",
      "content": "Write documentation",
      "checked": false,
      "subtext": "API docs needed",
      "image": "https://example.com/doc-icon.png"
    },
    {
      "id": "3",
      "content": "Fix critical bugs",
      "checked": true,
      "subtext": "2 issues remaining"
    }
  ],
  "title": "Development Tasks",
  "allowReorder": true,
  "allowCheckboxes": true,
  "compact": false,
  "showImages": true
}
```

**Item Properties:**

- `id` (required): Unique identifier for the item
- `content` (required): Main text content
- `checked`: Whether the item is checked (default: `false`)
- `image`: Optional image URL or data URI for thumbnail
- `subtext`: Optional secondary text/description
- `metadata`: Optional custom metadata object

**List Options:**

- `title`: Display title above the list
- `allowReorder`: Enable drag-and-drop reordering (default: `true`)
- `allowCheckboxes`: Show checkboxes for items (default: `true`)
- `compact`: Use compact layout mode (default: `false`)
- `showImages`: Display item images if available (default: `true`)

**Features:**

- Drag items to reorder (when `allowReorder` is true)
- Check/uncheck items (when `allowCheckboxes` is true)
- Export as plain text, CSV, or JSON
- Copy individual items with hover button
- Image thumbnails for visual context
- Responsive layout with theme support

For more examples, see [LIST_EXAMPLES.md](./doc/LIST_EXAMPLES.md)

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
