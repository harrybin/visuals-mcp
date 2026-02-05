# MCP Table Server - Quick Start Guide

## Installation

```bash
# Install dependencies
npm install

# Build the UI
npm run build
```

## Running the Server

### Stdio Mode (for production)

```bash
npm run serve
```

### Development Mode (auto-rebuild on changes)

```bash
npm run dev
```

## Configuring with VS Code

Add to your VS Code settings (File → Preferences → Settings → Extensions → GitHub Copilot → MCP Servers):

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

Or use Claude Desktop by adding to `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "table-server": {
      "command": "tsx",
      "args": ["D:\\harrybin\\visuals-mcp\\server.ts"]
    }
  }
}
```

## Testing the Server

### Quick Test with Example Data

After starting the server, you can test it by having an agent call the `display_table` tool. Here's a minimal example:

```json
{
  "columns": [
    { "key": "name", "label": "Name", "type": "string" },
    { "key": "score", "label": "Score", "type": "number" }
  ],
  "rows": [
    { "name": "Alice", "score": 95 },
    { "name": "Bob", "score": 87 },
    { "name": "Carol", "score": 92 }
  ],
  "title": "Test Scores"
}
```

### Testing with basic-host

1. Clone MCP Apps examples repository:
```bash
git clone https://github.com/modelcontextprotocol/ext-apps.git /tmp/mcp-ext-apps
```

2. Start basic-host:
```bash
cd /tmp/mcp-ext-apps/examples/basic-host
npm install
npm run start
```

3. Open http://localhost:8080 and connect to your server

## Features to Try

1. **Sorting**: Click any column header to sort
2. **Filtering**: Type in the filter box below headers and press Enter or click ⚡
3. **Column Visibility**: Click "Column Visibility" to toggle columns
4. **Row Selection**: Check boxes to select rows
5. **Pagination**: Navigate pages and change page size

## Example Prompts for Your Agent

- "Show me a table of the top 10 programming languages"
- "Display sales data in a table format"
- "Create a table comparing product features"
- "Show me user activity in a sortable table"

## Table State Feedback

When users interact with the table (sort, filter, select), the agent automatically receives:

```json
{
  "type": "table_state",
  "state": {
    "sortBy": [{ "columnKey": "score", "direction": "desc" }],
    "filters": {},
    "selectedRowIds": ["0", "2"],
    "visibleColumns": ["name", "score"]
  },
  "summary": "2 rows selected, 0 filters active, 1 columns sorted"
}
```

The agent can then respond to user selections or ask follow-up questions.

## Troubleshooting

### Build fails
- Make sure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)

### Server won't start
- Verify build completed: check `dist/mcp-app.html` exists
- Run `npm run build` before `npm run serve`

### Table doesn't display
- Check browser console for errors
- Verify tool is called with correct data structure
- Check server logs for resource loading errors

## Next Steps

- See [EXAMPLES.md](./EXAMPLES.md) for more complex table examples
- See [README.md](./README.md) for full documentation
- Customize styling in [src/app.css](./src/app.css)
- Extend functionality in [src/app.tsx](./src/app.tsx)

## Support

For issues or questions:
- Check the [MCP documentation](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- Review [MCP Apps examples](https://github.com/modelcontextprotocol/ext-apps)
- File an issue on GitHub
