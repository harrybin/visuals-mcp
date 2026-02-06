# MCP Table Server - Copilot Instructions

## Project Overview

This is a **Model Context Protocol (MCP) Server** that provides interactive visual UI components for AI agents. It implements the MCP-Apps pattern, enabling LLMs to display tables and images using React + Vite single-file bundling.

**Currently Supported Components:**
- Interactive data tables with sorting, filtering, pagination, row selection, column visibility, and CSV/TSV/PDF export
- Image preview cards with metadata (title, caption, dimensions, file size)

**Key Technologies:**
- TypeScript + Node.js (server) & React 19 (UI)
- MCP SDK (`@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps`)
- TanStack Table v8 (headless table library)
- Vite with single-file bundling (no external asset requests)
- jsPDF + autotable (PDF export)

## Architecture

### Components

1. **server.ts** - MCP server that:
   - Registers 2 tools visible to LLM: `display_table` and `display_image`
   - Registers 1 UI-only tool: `query_table_data` (not visible to LLM)
   - **`fileToDataUri()` helper**: Converts local file paths and file:// URLs to base64 data URIs for browser compatibility
     - Handles Windows drive letters and URL decoding
     - MIME type detection by file extension
     - Graceful fallback if file not found
   - Serves bundled HTML via resource handlers at `table://display` and `image://preview`
   - Runs over stdio transport

2. **src/table-app.tsx** - Table React component that:
   - Uses `useApp()` hook for MCP App lifecycle
   - Implements TanStack Table v8 with sorting, filtering, pagination, column visibility, row selection
   - Handles theme detection (dark/light) and safe area insets
   - Sends user interactions back to LLM via `app.updateModelContext()`
   - Calls server tool `query_table_data` for server-side operations

3. **src/image-app.tsx** - Image React component that:
   - Uses `useApp()` hook for MCP App lifecycle
   - Displays image preview card with metadata (title, caption, filename, dimensions, file size)
   - Theme-aware styling matching host environment
   - Formats file sizes and truncates long URLs for display
   - Handles safe area insets

4. **src/table.tsx** - TanStack Table implementation with:
   - Dynamic column definition from schema
   - Cell formatting for date, boolean, number types
   - Multi-row selection with row IDs
   - Integrated export utilities (CSV, TSV, PDF)

5. **types.ts** - Shared TypeScript schemas:
   - `TableToolInput` - Tool input for `display_table`
   - `ImageToolInput` - Tool input for `display_image`
   - `QueryTableDataInput` - Server-side query schema
   - All validated with Zod at runtime

6. **HTML Entry Points:**
   - `mcp-table.html` → builds to `dist/mcp-table.html` (table UI)
   - `mcp-image.html` → builds to `dist/mcp-image.html` (image UI)

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

- **`display_table`**: Visible to LLM (`_meta.ui.visibility: ["model", "app"]`)
  - LLM calls this to show interactive table to user
  - Returns MCP App with table UI resource URI
  - Features: sort, filter, paginate, select rows, toggle columns, export data

- **`display_image`**: Visible to LLM (`_meta.ui.visibility: ["model", "app"]`)
  - LLM calls this to show images (screenshots, diagrams, photos, etc.)
  - Server converts local file paths to data URIs automatically via `fileToDataUri()`
  - Returns MCP App with image preview resource URI
  - Supports metadata: title, caption, alt text, dimensions, file size, filename

- **`query_table_data`**: UI-only (`_meta.ui.visibility: ["app"]`)
  - Hidden from LLM - only UI calls this for performance with large datasets
  - Applies server-side filtering, sorting, and pagination
  - Reduces client-side memory pressure for tables with 1000+ rows
  - Called via `app.callServerTool()` after user interactions

## Code Conventions

### File-to-Data-URI Conversion (server.ts)

The `fileToDataUri()` function handles image paths for browser compatibility:

```typescript
// Converts: file paths, file:// URLs → base64 data URIs
// Supports: PNG, JPG, GIF, SVG, WebP, BMP
// Process:
// 1. Decode URL-encoded characters
// 2. Handle Windows drive letters (C:/, D:/, etc.)
// 3. Check file exists
// 4. Detect MIME type from extension
// 5. Read file and convert to base64 data URI
// 6. Graceful fallback if file not found
```

**Use Case:** When LLM passes local file paths to `display_image`, the server converts them to embedded data URIs so the browser can load them without CORS issues.

### Theme Resolution & Safe Area Insets

Both React components (table-app.tsx, image-app.tsx) include theme detection:

```typescript
const resolveThemeMode = (ctx?: any): ThemeMode => {
  // Checks 8 different context properties:
  // isDarkTheme, theme.kind, colorTheme.kind, colorScheme, etc.
  // Falls back to "dark" if undetected
  // Applies class names: theme-dark or theme-light to document.documentElement
}

// Respects VS Code safe area insets:
if (ctx.safeAreaInsets) {
  const { top, right, bottom, left } = ctx.safeAreaInsets;
  document.body.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
}
```

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
      const htmlContent = readFileSync('dist/mcp-table.html', 'utf-8');
       return { contents: [{ uri, mimeType: "text/html", text: htmlContent }] };
     }
   });
   ```

3. **Transport**: Use StdioServerTransport for stdio communication

### React Component (src/table-app.tsx)

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

### Build Process

The build pipeline creates 2 single-file HTML bundles + 1 Node.js server:

```
npm run build
├─ npm run build:ui
│  ├─ build:table (vite build --config vite.config.ts)
│  │  Input:  mcp-table.html + src/table-app.tsx
│  │  Output: dist/mcp-table.html (single bundled file, ~1.4MB)
│  └─ build:image (vite build --config vite.config.image.ts)
│     Input:  mcp-image.html + src/image-app.tsx
│     Output: dist/mcp-image.html (single bundled file, ~580KB)
└─ npm run build:server (tsc -p tsconfig.server.json)
   Input:  server.ts + types.ts
   Output: dist/server.js
```

**Key Detail:** Uses `vite-plugin-singlefile` for zero-external-dependencies bundling.

### Scripts
- `npm run build` - Build both UIs and server
- `npm run serve` - Start MCP server (reads from dist/ files)
- `npm run dev` - Watch mode for development (rebuilds on file change)

### Testing Workflow
1. Run build: `npm run build`
2. Start server: `npm run serve`
3. Use MCP client (VS Code with Copilot or Claude Desktop)
4. Test `display_table` and `display_image` tools
5. Verify interactions update model context via `updateModelContext()`

## Key Guidelines for Copilot

1. **Always build before running**: The UIs MUST be built into single HTML files first
   - Error: "Failed to read HTML resource" → run `npm run build`
   - Both `mcp-table.html` and `mcp-image.html` must exist in dist/
2. **Tool visibility matters**: Use `_meta.ui.visibility` to control tool visibility to LLM
3. **Single-file bundling**: UIs are bundled into single self-contained HTML files (Vite handles this)
4. **Image file conversion**: `display_image` accepts local file paths; server auto-converts to data URIs
5. **State synchronization**: UI changes MUST call `updateModelContext()` to keep agent informed
6. **Error handling**: Wrap async operations in try/catch, provide user-friendly error messages
7. **Accessibility**: Add ARIA labels, keyboard navigation for table interactions
8. **Performance**: For large datasets (>1000 rows), use server-side pagination via `query_table_data`

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

