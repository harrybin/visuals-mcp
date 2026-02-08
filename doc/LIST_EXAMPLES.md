# List Visual Examples

This document provides examples of using the `display_list` tool in the MCP visuals server.

## Basic List

```javascript
{
  "items": [
    { "id": "1", "content": "First item" },
    { "id": "2", "content": "Second item" },
    { "id": "3", "content": "Third item" }
  ],
  "title": "Simple Todo List"
}
```

## List with Checkboxes

```javascript
{
  "items": [
    { "id": "1", "content": "Review pull requests", "checked": true },
    { "id": "2", "content": "Write documentation", "checked": false },
    { "id": "3", "content": "Fix bugs", "checked": true }
  ],
  "title": "Development Tasks",
  "allowCheckboxes": true
}
```

## List with Images

```javascript
{
  "items": [
    {
      "id": "1",
      "content": "Beautiful Landscape",
      "subtext": "Photo taken in 2024",
      "image": "https://example.com/landscape.jpg"
    },
    {
      "id": "2",
      "content": "Architecture",
      "subtext": "Modern building design",
      "image": "https://example.com/building.jpg"
    }
  ],
  "title": "Photo Gallery",
  "showImages": true
}
```

## Compact List

```javascript
{
  "items": [
    { "id": "1", "content": "alice@example.com", "subtext": "Active" },
    { "id": "2", "content": "bob@example.com", "subtext": "Inactive" },
    { "id": "3", "content": "charlie@example.com", "subtext": "Active" }
  ],
  "title": "User List",
  "compact": true
}
```

## File List with Metadata

```javascript
{
  "items": [
    {
      "id": "1",
      "content": "server.ts",
      "subtext": "22 KB • Modified today",
      "metadata": { "size": 22528, "modified": "2024-02-08" }
    },
    {
      "id": "2",
      "content": "types.ts",
      "subtext": "3.4 KB • Modified yesterday",
      "metadata": { "size": 3481, "modified": "2024-02-07" }
    }
  ],
  "title": "Recent Files",
  "allowCheckboxes": true,
  "allowReorder": true
}
```

## Shopping List

```javascript
{
  "items": [
    { "id": "1", "content": "Milk", "checked": true },
    { "id": "2", "content": "Bread", "checked": false },
    { "id": "3", "content": "Eggs", "checked": true },
    { "id": "4", "content": "Butter", "checked": false },
    { "id": "5", "content": "Cheese", "checked": false }
  ],
  "title": "Shopping List",
  "allowCheckboxes": true,
  "allowReorder": true
}
```

## Features

### Drag and Drop
Users can reorder items by dragging and dropping (when `allowReorder` is true).

### Checkboxes
Items can be checked/unchecked (when `allowCheckboxes` is true).

### Image Thumbnails
Items can display image thumbnails (when `showImages` is true and items have `image` property).

### Export Options
- **Copy Text**: Plain text format with checkboxes or numbering
- **Copy CSV**: CSV format with id, content, checked, subtext columns
- **Copy JSON**: Full JSON export with all item properties

### Individual Item Copy
Each item has a copy button that appears on hover to copy its content.

### Compact Mode
Use `compact: true` for a more condensed view with smaller spacing and thumbnails.

## Tool Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | Array | Required | Array of list items |
| `title` | String | Optional | Title displayed above the list |
| `allowReorder` | Boolean | `true` | Enable drag-and-drop reordering |
| `allowCheckboxes` | Boolean | `true` | Show checkboxes for items |
| `compact` | Boolean | `false` | Use compact layout mode |
| `showImages` | Boolean | `true` | Display item images if available |

## Item Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | String | Yes | Unique identifier |
| `content` | String | Yes | Main text content |
| `checked` | Boolean | No | Checkbox state (default: false) |
| `image` | String | No | Image URL or data URI |
| `subtext` | String | No | Secondary text/description |
| `metadata` | Object | No | Additional metadata |
