User: I want to create an MCP server for MCP-Apps. Build it in TypeScript.
search online about that topic, see also: https://code.visualstudio.com/blogs/2026/01/26/mcp-apps-support

My MCP-apps server is itendet to provide simple UIs such as a list, and table to be used for every data fitting into that visual.
Start with a table implementation. Use Tanstack-table for the visual and full fill all needs to easily use it for the llm/agent

GitHub Copilot: I'll help you plan an MCP server for MCP-Apps with a table UI. Let me start by researching the topic and your workspace structure.   

Research MCP-Apps ecosystem and TanStack Table



Fetched https://code.visualstudio.com/blogs/2026/01/26/mcp-apps-support

Read [](file:///d%3A/harrybin/visuals-mcp)

Searched for files matching `**/*.md`, 1 match

Searched for files matching `**/*.{ts,tsx,json}`, no matches

Searched codebase for "MCP apps UI components visual protocol architecture SDK", 1 result

Read [](file:///d%3A/harrybin/visuals-mcp/.gituhb)

Read [](file:///d%3A/harrybin/visuals-mcp/.gituhb/skills)

Searched for regex `MCP|Model Context Protocol|ext-apps|SDK`, 20 results

Searched modelcontextprotocol/ext-apps for "architecture spec API documentation UI components resource registration tool visibility", 64 results

Searched modelcontextprotocol/ext-apps for "example servers basic-server react typescript implementation", 64 results

Searched tanstack/table for "TypeScript React headless table sorting filtering pagination API", 64 results

Searched modelcontextprotocol/typescript-sdk for "TypeScript server implementation setup stdio transport HTTP examples", 64 results

Searched modelcontextprotocol/ext-apps for "table data visualization chart examples server", 64 results

Read [](file:///d%3A/harrybin/visuals-mcp)

Read [](file:///d%3A/harrybin/visuals-mcp/.gituhb/skills/create-mpc-app/SKILL.md)

Read [](file:///d%3A/harrybin/visuals-mcp/.gituhb)

Read [](file:///d%3A/harrybin/visuals-mcp)

Read [](file:///d%3A/harrybin/visuals-mcp/.git)

Searched for regex `tanstack|table|typescript|react`, 20 results

Now I have good context. Let me clarify a few key design decisions before creating a detailed plan: 

Asked 4 questions (Framework, Interactn, DataModel, Features)

Perfect! Now I have clear requirements. Let me create a comprehensive plan for your MCP Table Server.

## Plan: MCP Table Server with React + TanStack Table

**TL;DR:** Build a TypeScript MCP server that exposes an `display_table` tool paired with a React UI component using TanStack Table (v8). The tool accepts generic column definitions and row data, returns an MCP App that renders a fully-featured table with sorting, filtering, pagination, column visibility, and row selection. The UI communicates back to the server via `callServerTool` for complex operations (sorting/filtering large datasets) and sends user interactions (selections, state changes) back to the LLM via `app.updateModelContext()`. Uses React with the `useApp` hook for lifecycle management and Vite with single-file bundling.

**Steps**

1. **Project Structure Setup**
   - Initialize TypeScript project with `package.json` 
   - Install core dependencies: `@modelcontextprotocol/sdk`, `@modelcontextprotocol/ext-apps`, `@tanstack/react-table`, React, Vite, and dev tools (`tsx`, `typescript`, `vite-plugin-singlefile`)
   - Set up directory structure:
     - `server.ts` - MCP server with tool registration
     - `src/app.tsx` - React component with `useApp` hook
     - `mcp-app.html` - Single HTML entry (bundled by Vite)
     - `vite.config.ts` - Build config with single-file plugin
     - `types.ts` - TypeScript types for table schema

2. **Define MCP Tool Interface (types.ts)**
   - Create `TableToolInput` type accepting:
     - `columns`: Array of `{ key: string; label: string; type: "string"|"number"|"date"|"boolean"; filterable?: boolean; sortable?: boolean; }`
     - `rows`: Array of generic objects matching column keys
     - `title`: Optional display title
     - `allowRowSelection`: boolean
     - `allowColumnVisibility`: boolean
   - Create `TableToolResult` with metadata (row count, selected rows ID)
   - Define `TableState` for UI → LLM feedback (sortBy, filters, selectedRowIds, visibleColumns)

3. **MCP Server Implementation (server.ts)**
   - Initialize MCP server with name and version
   - Register `display_table` tool using `registerAppTool([Tool])` from SDK
   - Tool includes `_meta.ui.resourceUri` pointing to `/mcp/table-resource`
   - Register resource handler via `registerAppResource([Resource])` serving bundled HTML from `dist/mcp-app.html`
   - Add optional secondary tool `query_table_data` for server-side filtering/sorting (UI-only visibility via `_meta.ui.visibility: ["app"]`)
   - Export server for stdio/HTTP transport

4. **React App Component (src/app.tsx)**
   - Use `useApp()` hook to initialize MCP App lifecycle
   - Use `useHostStyles()` hook for theme/font integration
   - State management: `columns`, `rows`, `sorting`, `columnFilters`, `columnVisibility`, `rowSelection`
   - Implement TanStack Table instance with full feature set
   - Handle `app.ontoolinput`: Extract table data from tool arguments
   - Handle `app.ontoolresult`: Process result if 2-step flow needed
   - Implement row selection with row IDs
   - Add column visibility toggle UI (checkbox list or eye icon per column)
   - Build sorting/filtering UI with controls and Apply button
   - On Apply: call `app.callServerTool('query_table_data', { sortBy, filters })` OR `app.updateModelContext()` with current state
   - Respect `ctx.safeAreaInsets` in layout

5. **TanStack Table Integration (src/app.tsx - table section)**
   - Create table columns array dynamically from `columns` input
   - Add column definition with:
     - Text column renderer
     - Header with sort indicator (clickable sort toggle)
     - Filter UI in column header if `filterable: true`
     - Visibility column with checkbox
   - Add `enableRowSelection` with checkbox in first column
   - Implement `useReactTable()` with:
     - `data: rows`, `columns: dynamicColumns`
     - `state: { sorting, columnFilters, columnVisibility, rowSelection }`
     - `onSortingChange`, `onColumnFiltersChange`, `onColumnVisibilityChange`, `onRowSelectionChange`
   - Add pagination controls (page size selector, prev/next buttons)

6. **HTML Entry Point (mcp-app.html)**
   - Minimal single HTML file with root div and single inline `<script>` (bundled by Vite)
   - Vite will inject bundled React + app CSS

7. **Build Configuration (vite.config.ts)**
   - Use `vite-plugin-singlefile` to bundle everything into single HTML
   - React JSX support enabled
   - Minify for production

8. **Host Style Integration**
   - Apply CSS variables from host context in component (background, text color, fonts, border-radius)
   - Use Tailwind or CSS variables for table styling
   - Respect host's `displayMode` and `theme`

9. **Data Flow & Interactivity**
   - **Agent → UI**: LLM calls `display_table` tool with columns + rows → server returns resource with bundled HTML → VS Code renders UI
   - **UI → Agent**: User sorts/filters/selects → UI updates state → calls `app.updateModelContext()` with current table state → Agent sees selection and can respond
   - **Optional**: For large datasets, UI calls `query_table_data` (UI-only tool) → server returns filtered/sorted rows → UI updates via `ontoolresult`

10. **Testing Setup**
    - Create sample table data in server for manual testing
    - Test with basic-host from MCP SDK examples (clone SDK, run `basic-host` locally)
    - Verify: sorting works, filtering works, row selection updates model context, column visibility toggles

**Verification**
- Run server: `npm run serve`
- Build UI: `npm run build`
- Start basic-host and connect to `http://localhost:3001/mcp`
- Call `display_table` with sample data
- Verify table renders, sorting/filtering UI appears, row selection works
- Check console logs show `updateModelContext` calls when user interacts

**Decisions**
- **React + TanStack**: Recommended by MCP-Apps team, better DX with `useApp` hook vs vanilla JS
- **Full generics**: Start with completely flexible column/row structure (Zod types can be added in v2)
- **Dual tools approach**: `display_table` (model-visible) + `query_table_data` (UI-only) enables both user-driven UI and server-side data operations
- **updateModelContext workflow**: UI sends state changes back to model to keep agent aware of selections (vs silent operations)
- **Single file bundling**: Ensures HTML resource is self-contained, portable, no external dependencies at runtime