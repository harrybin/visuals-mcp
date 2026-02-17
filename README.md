# MCP Visuals Server

An MCP (Model Context Protocol) server that provides interactive visualizations for AI agents. Display data in rich, interactive formats including **tables** with TanStack Table, **image previews** with metadata, **master-detail views** for browsing collections, **tree views** for hierarchical data, and **customizable lists** with drag-and-drop reordering.

### Quick Install

[![Install with VS Code](https://img.shields.io/badge/install-VS%20Code-007ACC?style=for-the-badge&logo=visualstudiocode)](vscode:mcp/install?%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40harrybin%2Fvisuals-mcp%22%5D%7D)
 °°° [![Install with VS Code Insiders](https://img.shields.io/badge/install-VS%20Code%20Insiders-24bfa5?style=for-the-badge&logo=visualstudiocode)](vscode-insiders:mcp/install?%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22%40harrybin%2Fvisuals-mcp%22%5D%7D)

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

![Master-Detail Example](doc/master-detail-example.png)

*Master-detail view for browsing collections with tables, images, or custom content*

![List Example](doc/list-example.png)

*Interactive list with drag-and-drop reordering, checkboxes, and image thumbnails*

![Tree Example](doc/tree-example.png)

*Interactive tree view with expand/collapse, node selection, and export options*

## Installation

### VSCode Extension (Easiest)

Install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=harrybin.visuals-mcp):

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Visuals MCP"
4. Click Install

The extension will automatically register the MCP server with VS Code and GitHub Copilot Chat.

### npmjs (Recommended for other MCP Clients)

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
