# MCP Visuals Server

An MCP (Model Context Protocol) server that provides interactive visualizations for AI agents. Display data in rich, interactive formats including **tables** with TanStack Table, **image previews** with metadata, **tree views** for hierarchical data, and **customizable lists** with drag-and-drop reordering.

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

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Resources

- [MCP Apps Documentation](https://modelcontextprotocol.github.io/ext-apps/api/)
- [MCP Apps Examples](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [VS Code MCP Guide](https://code.visualstudio.com/docs/copilot/guides/mcp-developer-guide)
