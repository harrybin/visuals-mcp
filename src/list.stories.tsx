import type { Meta, StoryObj } from '@storybook/react';
import { ListView } from './list';
import type { ListToolInput, ListItem } from '../types';
import './app.css';
import './list.css';

const meta: Meta<typeof ListView> = {
  title: 'MCP Visuals/List',
  component: ListView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive list component with drag-and-drop reordering, checkboxes, images, and metadata. Supports compact mode and various list item configurations.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ListView>;

const sampleTodoList: ListItem[] = [
  {
    id: '1',
    content: 'Review pull requests',
    checked: true,
    subtext: 'Priority: High • Due: Today',
    metadata: { priority: 'high', dueDate: '2024-01-15' },
  },
  {
    id: '2',
    content: 'Update documentation',
    checked: false,
    subtext: 'Priority: Medium • Due: Tomorrow',
    metadata: { priority: 'medium', dueDate: '2024-01-16' },
  },
  {
    id: '3',
    content: 'Fix bug in authentication module',
    checked: true,
    subtext: 'Priority: Critical • Due: Today',
    metadata: { priority: 'critical', dueDate: '2024-01-15' },
  },
  {
    id: '4',
    content: 'Prepare presentation for client meeting',
    checked: false,
    subtext: 'Priority: High • Due: Friday',
    metadata: { priority: 'high', dueDate: '2024-01-19' },
  },
  {
    id: '5',
    content: 'Refactor database queries',
    checked: false,
    subtext: 'Priority: Low • Due: Next week',
    metadata: { priority: 'low', dueDate: '2024-01-22' },
  },
];

export const Default: Story = {
  args: {
    listData: {
      title: 'Task List',
      items: sampleTodoList,
      allowReorder: true,
      allowCheckboxes: true,
      showImages: false,
      compact: false,
    },
  },
};

export const CompactMode: Story = {
  args: {
    listData: {
      title: 'Compact Task List',
      items: sampleTodoList,
      allowReorder: true,
      allowCheckboxes: true,
      compact: true,
    },
  },
};

export const NoCheckboxes: Story = {
  args: {
    listData: {
      title: 'Read-only List',
      items: sampleTodoList.map(item => ({ ...item, checked: false })),
      allowReorder: true,
      allowCheckboxes: false,
      compact: false,
    },
  },
};

export const NoReordering: Story = {
  args: {
    listData: {
      title: 'Fixed Order List',
      items: sampleTodoList,
      allowReorder: false,
      allowCheckboxes: true,
      compact: false,
    },
  },
};

const contactList: ListItem[] = [
  {
    id: 'alice',
    content: 'Alice Johnson',
    subtext: 'alice@example.com • +1 (555) 123-4567',
    image: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#3498db"/>
        <text x="24" y="32" font-family="Arial" font-size="24" fill="white" text-anchor="middle">A</text>
      </svg>
    `),
    metadata: { department: 'Engineering', role: 'Senior Developer' },
  },
  {
    id: 'bob',
    content: 'Bob Smith',
    subtext: 'bob@example.com • +1 (555) 234-5678',
    image: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#2ecc71"/>
        <text x="24" y="32" font-family="Arial" font-size="24" fill="white" text-anchor="middle">B</text>
      </svg>
    `),
    metadata: { department: 'Design', role: 'UI/UX Designer' },
  },
  {
    id: 'carol',
    content: 'Carol Williams',
    subtext: 'carol@example.com • +1 (555) 345-6789',
    image: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#e74c3c"/>
        <text x="24" y="32" font-family="Arial" font-size="24" fill="white" text-anchor="middle">C</text>
      </svg>
    `),
    metadata: { department: 'Marketing', role: 'Marketing Manager' },
  },
  {
    id: 'david',
    content: 'David Brown',
    subtext: 'david@example.com • +1 (555) 456-7890',
    image: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#f39c12"/>
        <text x="24" y="32" font-family="Arial" font-size="24" fill="white" text-anchor="middle">D</text>
      </svg>
    `),
    metadata: { department: 'Sales', role: 'Sales Representative' },
  },
];

export const WithImages: Story = {
  args: {
    listData: {
      title: 'Contact List',
      items: contactList,
      allowReorder: true,
      allowCheckboxes: false,
      showImages: true,
      compact: false,
    },
  },
};

export const WithImagesCompact: Story = {
  args: {
    listData: {
      title: 'Contact List (Compact)',
      items: contactList,
      allowReorder: true,
      allowCheckboxes: false,
      showImages: true,
      compact: true,
    },
  },
};

export const SimpleList: Story = {
  args: {
    listData: {
      title: 'Shopping List',
      items: [
        { id: '1', content: 'Milk', checked: false },
        { id: '2', content: 'Bread', checked: true },
        { id: '3', content: 'Eggs', checked: false },
        { id: '4', content: 'Butter', checked: false },
        { id: '5', content: 'Cheese', checked: true },
        { id: '6', content: 'Yogurt', checked: false },
      ],
      allowReorder: true,
      allowCheckboxes: true,
      compact: false,
    },
  },
};

export const EmptyList: Story = {
  args: {
    listData: {
      title: 'Empty List',
      items: [],
      allowReorder: true,
      allowCheckboxes: true,
      compact: false,
    },
  },
};

const largeList: ListItem[] = Array.from({ length: 100 }, (_, i) => ({
  id: `item-${i + 1}`,
  content: `List Item ${i + 1}`,
  checked: Math.random() > 0.7,
  subtext: `Description for item ${i + 1}`,
  metadata: { index: i + 1, category: ['Work', 'Personal', 'Urgent'][i % 3] },
}));

export const LargeList: Story = {
  args: {
    listData: {
      title: 'Large List (100 items)',
      items: largeList,
      allowReorder: true,
      allowCheckboxes: true,
      compact: false,
    },
  },
};

const notificationList: ListItem[] = [
  {
    id: 'n1',
    content: 'New message from team',
    subtext: '2 minutes ago',
    image: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#3498db"/>
        <text x="24" y="32" font-family="Arial" font-size="28" fill="white" text-anchor="middle">💬</text>
      </svg>
    `),
    metadata: { type: 'message', unread: true },
  },
  {
    id: 'n2',
    content: 'Build completed successfully',
    subtext: '15 minutes ago',
    image: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#2ecc71"/>
        <text x="24" y="32" font-family="Arial" font-size="28" fill="white" text-anchor="middle">✓</text>
      </svg>
    `),
    metadata: { type: 'success', unread: true },
  },
  {
    id: 'n3',
    content: 'Deployment failed',
    subtext: '1 hour ago',
    image: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#e74c3c"/>
        <text x="24" y="32" font-family="Arial" font-size="28" fill="white" text-anchor="middle">⚠</text>
      </svg>
    `),
    checked: true,
    metadata: { type: 'error', unread: false },
  },
  {
    id: 'n4',
    content: 'New comment on your PR',
    subtext: '3 hours ago',
    image: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#9b59b6"/>
        <text x="24" y="32" font-family="Arial" font-size="28" fill="white" text-anchor="middle">💭</text>
      </svg>
    `),
    checked: true,
    metadata: { type: 'comment', unread: false },
  },
];

export const Notifications: Story = {
  args: {
    listData: {
      title: 'Notifications',
      items: notificationList,
      allowReorder: false,
      allowCheckboxes: true,
      showImages: true,
      compact: false,
    },
  },
};
