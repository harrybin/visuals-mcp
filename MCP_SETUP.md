# MCP Server Setup Guide

This guide explains how to configure the MCP Table Server with different MCP clients.

## VS Code Configuration

The MCP server is already configured in this workspace via `.vscode/settings.json`.

### Automatic Configuration (Already Done)

If you're working in this workspace, the server is automatically configured. Just:

1. Build the project:
   ```bash
   npm install
   npm run build
   ```

2. Reload VS Code or restart Copilot Chat

3. Test by asking Copilot:
   ```
   Show me a table with sample data
   ```

### Manual Configuration

To add this server to your global VS Code settings:

1. Open VS Code Settings (JSON): `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)"

2. Add the MCP server configuration:
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

3. Replace `D:\\harrybin\\visuals-mcp\\server.ts` with the actual path to your `server.ts`

## Claude Desktop Configuration

### Windows

1. Open the Claude Desktop configuration file:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Add or merge the server configuration:
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

3. Restart Claude Desktop

### macOS

1. Open the Claude Desktop configuration file:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. Add or merge the server configuration:
   ```json
   {
     "mcpServers": {
       "table-server": {
         "command": "tsx",
         "args": ["/path/to/visuals-mcp/server.ts"]
       }
     }
   }
   ```

3. Restart Claude Desktop

### Linux

1. Open the Claude Desktop configuration file:
   ```
   ~/.config/Claude/claude_desktop_config.json
   ```

2. Add or merge the server configuration:
   ```json
   {
     "mcpServers": {
       "table-server": {
         "command": "tsx",
         "args": ["/path/to/visuals-mcp/server.ts"]
       }
     }
   }
   ```

3. Restart Claude Desktop

## Generic MCP Client Configuration

For other MCP-compatible clients, use the configuration in `mcp-config.json`:

```json
{
  "mcpServers": {
    "table-server": {
      "command": "tsx",
      "args": ["server.ts"],
      "env": {},
      "description": "Interactive table visualization server with TanStack Table"
    }
  }
}
```

## Verification

### Check if Server is Running

#### VS Code
1. Open Copilot Chat
2. Type: `@workspace /tools`
3. Look for `display_table` in the tools list

#### Claude Desktop
1. Open Claude Desktop
2. Look for the hammer icon (🔨) or tools menu
3. Check if `display_table` is available

### Test the Server

Ask your AI assistant to display a table:

**Example prompts:**
- "Show me a table with the top 5 programming languages"
- "Create a table comparing product features"
- "Display user data in a sortable table with filtering"

**Example tool call:**
```json
{
  "columns": [
    { "key": "language", "label": "Language", "type": "string" },
    { "key": "popularity", "label": "Popularity", "type": "number" },
    { "key": "year", "label": "Year Created", "type": "number" }
  ],
  "rows": [
    { "language": "Python", "popularity": 100, "year": 1991 },
    { "language": "JavaScript", "popularity": 98, "year": 1995 },
    { "language": "Java", "popularity": 85, "year": 1995 },
    { "language": "C++", "popularity": 75, "year": 1985 },
    { "language": "Go", "popularity": 70, "year": 2009 }
  ],
  "title": "Programming Languages"
}
```

## Troubleshooting

### Server Not Found

**Error:** "MCP server not responding" or "Tool not available"

**Solutions:**
1. Verify `tsx` is installed globally:
   ```bash
   npm install -g tsx
   ```

2. Or update config to use local tsx:
   ```json
   {
     "command": "npx",
     "args": ["tsx", "server.ts"]
   }
   ```

3. Ensure the path to `server.ts` is absolute and correct

### Build Not Found

**Error:** "Failed to read HTML resource"

**Solution:**
```bash
cd D:\harrybin\visuals-mcp
npm run build
```

The `dist/mcp-app.html` file must exist.

### Server Crashes

**Error:** Server exits immediately after starting

**Solutions:**
1. Check server logs in VS Code Output panel
2. Test manually:
   ```bash
   tsx server.ts
   ```
3. Verify all dependencies are installed:
   ```bash
   npm install
   ```

### Table Doesn't Display

**Issue:** Tool executes but no table appears

**Solutions:**
1. Check browser dev console (F12) for errors
2. Verify the tool response includes both text content and resource
3. Check that `_meta.ui.resourceUri` matches the registered resource

## Advanced Configuration

### Environment Variables

Add environment variables to your MCP config:

```json
{
  "mcpServers": {
    "table-server": {
      "command": "tsx",
      "args": ["server.ts"],
      "env": {
        "NODE_ENV": "production",
        "DEBUG": "mcp:*"
      }
    }
  }
}
```

### Custom Port (for HTTP transport)

If you want to run the server over HTTP instead of stdio:

1. Modify `server.ts` to use HTTP transport
2. Update config:
   ```json
   {
     "mcpServers": {
       "table-server": {
         "command": "tsx",
         "args": ["server.ts", "--http", "--port", "3001"]
       }
     }
   }
   ```

### Multiple MCP Servers

You can configure multiple MCP servers:

```json
{
  "github.copilot.chat.mcpServers": {
    "table-server": {
      "command": "tsx",
      "args": ["D:\\harrybin\\visuals-mcp\\server.ts"]
    },
    "other-server": {
      "command": "node",
      "args": ["D:\\path\\to\\other-server.js"]
    }
  }
}
```

## Resources

- [VS Code MCP Documentation](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- [MCP Specification](https://modelcontextprotocol.io/introduction)
- [MCP-Apps Extension](https://github.com/modelcontextprotocol/ext-apps)
- [Project README](./README.md)
- [Quick Start Guide](./QUICKSTART.md)
