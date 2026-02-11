import type { Meta, StoryObj } from '@storybook/react';
import { TableView } from './table';
import type { TableToolInput } from '../types';
import './app.css';
import './table-app.css';

const meta: Meta<typeof TableView> = {
  title: 'MCP Visuals/Table',
  component: TableView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive table component with TanStack Table featuring sorting, filtering, pagination, row selection, column visibility, and export functionality (CSV, TSV, Markdown, PDF).',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TableView>;

const sampleData: TableToolInput = {
  title: 'Sales Report Q4 2023',
  columns: [
    { key: 'id', label: 'ID', type: 'number', sortable: true, filterable: false },
    { key: 'product', label: 'Product', type: 'string', sortable: true, filterable: true },
    { key: 'category', label: 'Category', type: 'string', sortable: true, filterable: true },
    { key: 'price', label: 'Price', type: 'number', sortable: true, filterable: true },
    { key: 'quantity', label: 'Quantity', type: 'number', sortable: true, filterable: true },
    { key: 'inStock', label: 'In Stock', type: 'boolean', sortable: true, filterable: false },
    { key: 'lastUpdated', label: 'Last Updated', type: 'date', sortable: true, filterable: false },
  ],
  rows: [
    { id: 1, product: 'Laptop Pro', category: 'Electronics', price: 1299.99, quantity: 45, inStock: true, lastUpdated: '2023-12-15' },
    { id: 2, product: 'Wireless Mouse', category: 'Accessories', price: 29.99, quantity: 234, inStock: true, lastUpdated: '2023-12-14' },
    { id: 3, product: 'USB-C Cable', category: 'Accessories', price: 12.99, quantity: 567, inStock: true, lastUpdated: '2023-12-16' },
    { id: 4, product: 'Mechanical Keyboard', category: 'Accessories', price: 89.99, quantity: 89, inStock: true, lastUpdated: '2023-12-13' },
    { id: 5, product: '4K Monitor', category: 'Electronics', price: 399.99, quantity: 23, inStock: false, lastUpdated: '2023-12-10' },
    { id: 6, product: 'Webcam HD', category: 'Electronics', price: 79.99, quantity: 156, inStock: true, lastUpdated: '2023-12-15' },
    { id: 7, product: 'Desk Lamp', category: 'Furniture', price: 34.99, quantity: 78, inStock: true, lastUpdated: '2023-12-12' },
    { id: 8, product: 'Office Chair', category: 'Furniture', price: 249.99, quantity: 12, inStock: false, lastUpdated: '2023-12-11' },
    { id: 9, product: 'Standing Desk', category: 'Furniture', price: 499.99, quantity: 8, inStock: true, lastUpdated: '2023-12-09' },
    { id: 10, product: 'Headphones', category: 'Electronics', price: 149.99, quantity: 134, inStock: true, lastUpdated: '2023-12-16' },
    { id: 11, product: 'Tablet', category: 'Electronics', price: 599.99, quantity: 67, inStock: true, lastUpdated: '2023-12-14' },
    { id: 12, product: 'Phone Case', category: 'Accessories', price: 19.99, quantity: 345, inStock: true, lastUpdated: '2023-12-15' },
  ],
  allowRowSelection: true,
  allowColumnVisibility: true,
  pageSize: 10,
};

export const Default: Story = {
  args: {
    tableData: sampleData,
  },
};

export const SmallDataset: Story = {
  args: {
    tableData: {
      title: 'User List',
      columns: [
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'email', label: 'Email', type: 'string' },
        { key: 'role', label: 'Role', type: 'string' },
        { key: 'active', label: 'Active', type: 'boolean' },
      ],
      rows: [
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', active: true },
        { name: 'Bob Smith', email: 'bob@example.com', role: 'User', active: true },
        { name: 'Carol White', email: 'carol@example.com', role: 'User', active: false },
      ],
      pageSize: 5,
    },
  },
};

export const NoRowSelection: Story = {
  args: {
    tableData: {
      ...sampleData,
      title: 'Read-only Product Catalog',
      allowRowSelection: false,
    },
  },
};

export const NoColumnVisibility: Story = {
  args: {
    tableData: {
      ...sampleData,
      title: 'Fixed Columns',
      allowColumnVisibility: false,
    },
  },
};

export const EmptyTable: Story = {
  args: {
    tableData: {
      title: 'Empty Dataset',
      columns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: 'Name', type: 'string' },
        { key: 'description', label: 'Description', type: 'string' },
      ],
      rows: [],
    },
  },
};

export const LargeDataset: Story = {
  args: {
    tableData: {
      title: 'Transaction Log (1000 rows)',
      columns: [
        { key: 'txId', label: 'Transaction ID', type: 'string' },
        { key: 'amount', label: 'Amount', type: 'number' },
        { key: 'status', label: 'Status', type: 'string' },
        { key: 'timestamp', label: 'Timestamp', type: 'date' },
      ],
      rows: Array.from({ length: 1000 }, (_, i) => ({
        txId: `TX${String(i + 1).padStart(6, '0')}`,
        amount: Math.random() * 10000,
        status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
        timestamp: new Date(2023, 11, 1 + (i % 30)).toISOString().split('T')[0],
      })),
      pageSize: 25,
    },
  },
};
