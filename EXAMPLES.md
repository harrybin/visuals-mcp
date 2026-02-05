# Example Table Data

This file contains example data structures you can use to test the MCP Table Server.

## Example 1: User Management Table

```json
{
  "columns": [
    { "key": "id", "label": "ID", "type": "number", "width": 80, "sortable": true, "filterable": false },
    { "key": "name", "label": "Name", "type": "string", "sortable": true, "filterable": true },
    { "key": "email", "label": "Email", "type": "string", "sortable": true, "filterable": true },
    { "key": "role", "label": "Role", "type": "string", "sortable": true, "filterable": true },
    { "key": "active", "label": "Active", "type": "boolean", "sortable": true },
    { "key": "joined", "label": "Join Date", "type": "date", "sortable": true }
  ],
  "rows": [
    { "id": 1, "name": "Alice Johnson", "email": "alice@company.com", "role": "Admin", "active": true, "joined": "2023-01-15" },
    { "id": 2, "name": "Bob Smith", "email": "bob@company.com", "role": "Developer", "active": true, "joined": "2023-03-22" },
    { "id": 3, "name": "Carol White", "email": "carol@company.com", "role": "Designer", "active": false, "joined": "2023-05-10" },
    { "id": 4, "name": "David Brown", "email": "david@company.com", "role": "Developer", "active": true, "joined": "2023-06-05" },
    { "id": 5, "name": "Eve Davis", "email": "eve@company.com", "role": "Manager", "active": true, "joined": "2023-02-28" },
    { "id": 6, "name": "Frank Miller", "email": "frank@company.com", "role": "Developer", "active": true, "joined": "2023-07-12" },
    { "id": 7, "name": "Grace Lee", "email": "grace@company.com", "role": "QA Engineer", "active": false, "joined": "2023-04-18" },
    { "id": 8, "name": "Henry Wilson", "email": "henry@company.com", "role": "DevOps", "active": true, "joined": "2023-08-01" },
    { "id": 9, "name": "Ivy Chen", "email": "ivy@company.com", "role": "Designer", "active": true, "joined": "2023-09-15" },
    { "id": 10, "name": "Jack Taylor", "email": "jack@company.com", "role": "Developer", "active": true, "joined": "2023-10-20" }
  ],
  "title": "Team Members",
  "allowRowSelection": true,
  "allowColumnVisibility": true,
  "pageSize": 5
}
```

## Example 2: Product Inventory

```json
{
  "columns": [
    { "key": "sku", "label": "SKU", "type": "string", "width": 100 },
    { "key": "product", "label": "Product Name", "type": "string" },
    { "key": "category", "label": "Category", "type": "string" },
    { "key": "price", "label": "Price", "type": "number" },
    { "key": "stock", "label": "In Stock", "type": "number" },
    { "key": "available", "label": "Available", "type": "boolean" },
    { "key": "lastRestocked", "label": "Last Restocked", "type": "date" }
  ],
  "rows": [
    { "sku": "LAPTOP-001", "product": "Pro Laptop 15\"", "category": "Electronics", "price": 1299.99, "stock": 45, "available": true, "lastRestocked": "2024-01-20" },
    { "sku": "MOUSE-042", "product": "Wireless Mouse", "category": "Accessories", "price": 29.99, "stock": 200, "available": true, "lastRestocked": "2024-01-18" },
    { "sku": "DESK-013", "product": "Standing Desk", "category": "Furniture", "price": 599.00, "stock": 12, "available": true, "lastRestocked": "2024-01-10" },
    { "sku": "CHAIR-008", "product": "Ergonomic Chair", "category": "Furniture", "price": 399.99, "stock": 0, "available": false, "lastRestocked": "2023-12-05" },
    { "sku": "MONITOR-027", "product": "4K Monitor 27\"", "category": "Electronics", "price": 449.99, "stock": 28, "available": true, "lastRestocked": "2024-01-22" },
    { "sku": "KEYBOARD-055", "product": "Mechanical Keyboard", "category": "Accessories", "price": 129.99, "stock": 85, "available": true, "lastRestocked": "2024-01-15" },
    { "sku": "HEADSET-019", "product": "Noise-Canceling Headset", "category": "Accessories", "price": 199.99, "stock": 3, "available": true, "lastRestocked": "2024-01-25" },
    { "sku": "WEBCAM-031", "product": "HD Webcam", "category": "Electronics", "price": 89.99, "stock": 67, "available": true, "lastRestocked": "2024-01-12" }
  ],
  "title": "Product Inventory",
  "pageSize": 10
}
```

## Example 3: Sales Performance

```json
{
  "columns": [
    { "key": "month", "label": "Month", "type": "string", "width": 120 },
    { "key": "revenue", "label": "Revenue", "type": "number" },
    { "key": "expenses", "label": "Expenses", "type": "number" },
    { "key": "profit", "label": "Profit", "type": "number" },
    { "key": "growth", "label": "Growth %", "type": "number" },
    { "key": "targetMet", "label": "Target Met", "type": "boolean" }
  ],
  "rows": [
    { "month": "January 2024", "revenue": 125000, "expenses": 85000, "profit": 40000, "growth": 12.5, "targetMet": true },
    { "month": "February 2024", "revenue": 138000, "expenses": 92000, "profit": 46000, "growth": 10.4, "targetMet": true },
    { "month": "March 2024", "revenue": 152000, "expenses": 98000, "profit": 54000, "growth": 10.1, "targetMet": true },
    { "month": "April 2024", "revenue": 145000, "expenses": 95000, "profit": 50000, "growth": -4.6, "targetMet": false },
    { "month": "May 2024", "revenue": 168000, "expenses": 105000, "profit": 63000, "growth": 15.9, "targetMet": true },
    { "month": "June 2024", "revenue": 182000, "expenses": 112000, "profit": 70000, "growth": 8.3, "targetMet": true }
  ],
  "title": "2024 Sales Performance",
  "allowRowSelection": false,
  "pageSize": 6
}
```

## Testing with Claude Desktop or VS Code

1. Build the server: `npm run build`
2. Start the server: `npm run serve`
3. In your MCP client, call the `display_table` tool with one of the above examples
4. Interact with the table: sort, filter, select rows, change page size
5. Check that the agent receives state updates when you interact

## Column Type Examples

- **string**: Any text value
- **number**: Integers or decimals (formatted with thousands separators)
- **date**: ISO date strings (YYYY-MM-DD) formatted to locale date
- **boolean**: true/false displayed as ✓/✗
