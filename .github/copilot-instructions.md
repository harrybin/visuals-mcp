# MCP Table Server - Copilot Instructions

## Project Overview

This is a **Model Context Protocol (MCP) Server** that provides visual table UI components for AI agents. It implements the MCP-Apps pattern, enabling LLMs to display interactive data tables using TanStack Table v8.

**Key Technologies:**
- TypeScript
- MCP SDK (`@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps`)
- React 18 with `useApp` hook
- TanStack Table v8 (headless table library)
- Vite with single-file bundling

## Architecture

### Components

1. **server.ts** - MCP server that:
   - Registers `display_table` tool (visible to LLM)
   - Registers `query_table_data` tool (UI-only, not visible to LLM)
   - Serves bundled HTML via resource handler at `table://display`
   - Runs over stdio transport

2. **src/app.tsx** - React component that:
   - Uses `useApp()` hook for MCP App lifecycle
   - Implements TanStack Table with sorting, filtering, pagination, row selection, column visibility
   - Sends user interactions back to LLM via `app.updateModelContext()`
   - Calls server tools via `app.callServerTool()` for server-side operations

3. **types.ts** - Shared TypeScript types:
   - `TableToolInput` - Tool input schema (columns, rows, config)
   - `TableState` - UI state sent back to LLM
   - `QueryTableDataInput` - Server-side query schema

4. **mcp-app.html** - Entry point bundled by Vite into single self-contained HTML file

## Data Flow

```
Agent (LLM) → display_table tool → MCP Server → Returns HTML resource
                                                          ↓
                                                    VS Code renders UI
                                                          ↓
User interacts (sort/filter/select) → React updates state → updateModelContext()
                                                                    ↓
                                                          Agent sees state changes
```

### Tool Visibility Pattern

- **`display_table`**: Visible to LLM (`_meta.ui.visibility` includes "model")
  - LLM calls this to show table to user
  - Returns MCP App with UI resource URI

- **`query_table_data`**: UI-only (`_meta.ui.visibility: ["app"]`)
  - UI calls this for server-side filtering/sorting on large datasets
  - Not visible or callable by LLM
  - Handled in `app.ontoolresult`

## Code Conventions

### Server (server.ts)

1. **Tool Registration**: Use standard MCP SDK tool registration
   ```typescript
   server.setRequestHandler(ListToolsRequestSchema, async () => {
     return {
       tools: [{
         name: "display_table",
         description: "...",
         inputSchema: { type: "object", properties: {...} },
         _meta: { ui: { resourceUri: "table://display" } }
       }]
     };
   });
   ```

2. **Resource Registration**: Handle ReadResourceRequestSchema
   ```typescript
   server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
     if (request.params.uri === "table://display") {
       const htmlContent = readFileSync('dist/mcp-app.html', 'utf-8');
       return { contents: [{ uri, mimeType: "text/html", text: htmlContent }] };
     }
   });
   ```

3. **Transport**: Use StdioServerTransport for stdio communication

### React Component (src/app.tsx)

1. **Hooks**:
   - `useApp({ appInfo, capabilities, onAppCreated })` - Manages MCP App lifecycle

2. **Event Handlers**:
   - `app.ontoolinput = (params) => { ... }` - Receive tool arguments from LLM
   - `app.ontoolresult = (result) => { ... }` - Handle UI tool call results
   - `app.onhostcontextchanged = (ctx) => { ... }` - Handle theme/safe area changes
   - Always destructure with defaults: `const { columns = [], rows = [] } = params.arguments || {}`

3. **State Updates to LLM**:
   ```typescript
   app.updateModelContext({
     type: "table_state",
     state: {
       sortBy: sorting,
       filters: columnFilters,
       selectedRowIds: Object.keys(rowSelection),
       visibleColumns: Object.keys(columnVisibility).filter(k => columnVisibility[k])
     },
     summary: "X rows selected, Y filters active"
   });
   ```

4. **Calling Server Tools from UI**:
   ```typescript
   const result = await app.callServerTool('query_table_data', {
     sortBy: sorting,
     filters: columnFilters
   });
   ```

5. **Safe Area Insets**: Respect `ctx.safeAreaInsets` in layout:
   ```typescript
   if (ctx.safeAreaInsets) {
     const { top, right, bottom, left } = ctx.safeAreaInsets;
     document.body.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
   }
   ```

### TanStack Table Patterns

1. **Column Definition**: Create columns dynamically from input schema
   ```typescript
   const dynamicColumns = columns.map(col => ({
     accessorKey: col.key,
     header: col.label,
     enableSorting: col.sortable ?? true,
     enableColumnFilter: col.filterable ?? true,
     cell: ({ getValue }) => {
       const value = getValue();
       if (col.type === "date") return new Date(value).toLocaleDateString();
       if (col.type === "boolean") return value ? "✓" : "✗";
       if (col.type === "number") return value.toLocaleString();
       return String(value ?? "");
     }
   }));
   ```

2. **Table Instance**:
   ```typescript
   const table = useReactTable({
     data: rows,
     columns: dynamicColumns,
     state: { sorting, columnFilters, columnVisibility, rowSelection },
     onSortingChange: setSorting,
     getCoreRowModel: getCoreRowModel(),
     getSortedRowModel: getSortedRowModel(),
     getFilteredRowModel: getFilteredRowModel(),
     getPaginationRowModel: getPaginationRowModel()
   });
   ```

3. **Row Selection**: Use row IDs for selection state
   ```typescript
   enableRowSelection: true,
   getRowId: (row) => row.id || String(row.index)
   ```

## Type Safety

1. **Generic Data Structure**: Rows are `Record<string, any>` to support arbitrary data
2. **Column Types**: Support `"string" | "number" | "date" | "boolean"`
3. **Input Validation**: Use Zod schemas for runtime validation

## Styling

1. **Use CSS Variables** for theme integration:
   - `--color-background-primary`, `--color-background-secondary`
   - `--color-text-primary`, `--color-text-secondary`
   - `--font-sans`, `--font-mono`
   - `--border-radius-md`, `--border-radius-lg`

2. **Theme Awareness**: Component adapts to host theme via CSS variables

3. **Responsive**: Design works in VS Code panels (min-width ~300px)

## Build & Development

### Scripts
- `npm run build` - Build bundled HTML with Vite
- `npm run serve` - Start MCP server (stdio)
- `npm run dev` - Build and serve with auto-reload

### Testing Workflow
1. Build UI: `npm run build`
2. Start server: `npm run serve`
3. Use MCP client (VS Code with Copilot or Claude Desktop) to test
4. Call `display_table` with sample data
5. Verify interactions update model context

## Key Guidelines for Copilot

1. **Always build before running**: The UI MUST be built into single HTML file first
2. **Tool visibility matters**: Use `_meta.ui.visibility` to control tool visibility
3. **Single-file bundling**: The UI is bundled into one HTML file (Vite handles this)
4. **State synchronization**: UI changes MUST call `updateModelContext()` to keep agent informed
5. **Error handling**: Wrap async operations in try/catch, provide user-friendly error messages
6. **Accessibility**: Add ARIA labels, keyboard navigation for table interactions
7. **Performance**: For large datasets (>1000 rows), use server-side pagination via `query_table_data`

## Future Enhancements

- Add chart visualizations (bar, line, pie)
- Support list view (simple item list with search)
- Add export to CSV functionality
- Implement column resizing and reordering
- Add cell editing with validation
- Support nested/hierarchical data
- Add data aggregation views (grouping, totals)
- Add GraphQL/REST API data sources

## References

- [MCP-Apps Blog Post](https://code.visualstudio.com/blogs/2026/01/26/mcp-apps-support)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [MCP-Apps Examples](https://github.com/modelcontextprotocol/ext-apps)

