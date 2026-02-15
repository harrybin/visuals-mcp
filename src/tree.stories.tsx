import type { Meta, StoryObj } from '@storybook/react';
import { TreeView } from './tree';
import type { TreeToolInput, TreeNode } from '../types';
import './app.css';
import './tree.css';

const meta: Meta<typeof TreeView> = {
  title: 'MCP Visuals/Tree',
  component: TreeView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive tree view component for hierarchical data with expand/collapse functionality, node selection, metadata display, and export options (Text, HTML, Image).',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TreeView>;

const fileSystemTree: TreeNode[] = [
  {
    id: 'root',
    label: 'project',
    icon: '📁',
    expanded: true,
    children: [
      {
        id: 'src',
        label: 'src',
        icon: '📁',
        expanded: true,
        children: [
          {
            id: 'app.tsx',
            label: 'app.tsx',
            icon: '⚛️',
            metadata: { size: '3.2 KB', lines: 145, type: 'TypeScript React' },
          },
          {
            id: 'index.tsx',
            label: 'index.tsx',
            icon: '⚛️',
            metadata: { size: '0.5 KB', lines: 18, type: 'TypeScript React' },
          },
          {
            id: 'components',
            label: 'components',
            icon: '📁',
            children: [
              {
                id: 'header.tsx',
                label: 'Header.tsx',
                icon: '⚛️',
                metadata: { size: '2.1 KB', lines: 89 },
              },
              {
                id: 'footer.tsx',
                label: 'Footer.tsx',
                icon: '⚛️',
                metadata: { size: '1.5 KB', lines: 56 },
              },
            ],
          },
        ],
      },
      {
        id: 'public',
        label: 'public',
        icon: '📁',
        children: [
          {
            id: 'index.html',
            label: 'index.html',
            icon: '📄',
            metadata: { size: '0.8 KB', type: 'HTML' },
          },
          {
            id: 'favicon.ico',
            label: 'favicon.ico',
            icon: '🖼️',
            metadata: { size: '4.2 KB', type: 'Icon' },
          },
        ],
      },
      {
        id: 'package.json',
        label: 'package.json',
        icon: '📦',
        metadata: { size: '1.2 KB', type: 'JSON' },
      },
      {
        id: 'tsconfig.json',
        label: 'tsconfig.json',
        icon: '⚙️',
        metadata: { size: '0.6 KB', type: 'JSON' },
      },
    ],
  },
];

export const Default: Story = {
  args: {
    treeData: {
      title: 'File System Explorer',
      nodes: fileSystemTree,
      showMetadata: true,
      expandAll: false,
    },
  },
};

export const ExpandedAll: Story = {
  args: {
    treeData: {
      title: 'File System (All Expanded)',
      nodes: fileSystemTree,
      showMetadata: true,
      expandAll: true,
    },
  },
};

export const WithoutMetadata: Story = {
  args: {
    treeData: {
      title: 'Simple Tree View',
      nodes: fileSystemTree,
      showMetadata: false,
      expandAll: false,
    },
  },
};

const organizationTree: TreeNode[] = [
  {
    id: 'ceo',
    label: 'Jane Smith (CEO)',
    icon: '👑',
    expanded: true,
    metadata: { department: 'Executive', email: 'jane@company.com' },
    children: [
      {
        id: 'cto',
        label: 'Bob Johnson (CTO)',
        icon: '💻',
        metadata: { department: 'Technology', email: 'bob@company.com' },
        children: [
          {
            id: 'dev-lead',
            label: 'Alice Brown (Dev Lead)',
            icon: '👨‍💻',
            metadata: { department: 'Engineering', team: 'Backend' },
            children: [
              {
                id: 'dev1',
                label: 'Charlie Davis (Developer)',
                icon: '👨‍💻',
                metadata: { skills: 'Python, Go' },
              },
              {
                id: 'dev2',
                label: 'Diana Evans (Developer)',
                icon: '👨‍💻',
                metadata: { skills: 'JavaScript, TypeScript' },
              },
            ],
          },
          {
            id: 'qa-lead',
            label: 'Eve Foster (QA Lead)',
            icon: '🔍',
            metadata: { department: 'Quality Assurance' },
            children: [
              {
                id: 'qa1',
                label: 'Frank Green (QA Engineer)',
                icon: '🧪',
                metadata: { specialty: 'Automation' },
              },
            ],
          },
        ],
      },
      {
        id: 'cfo',
        label: 'Grace Harris (CFO)',
        icon: '💰',
        metadata: { department: 'Finance', email: 'grace@company.com' },
        children: [
          {
            id: 'accountant',
            label: 'Henry Irving (Accountant)',
            icon: '📊',
            metadata: { department: 'Accounting' },
          },
        ],
      },
    ],
  },
];

export const OrganizationChart: Story = {
  args: {
    treeData: {
      title: 'Company Organization Chart',
      nodes: organizationTree,
      showMetadata: true,
      expandAll: false,
    },
  },
};

const menuTree: TreeNode[] = [
  {
    id: 'file',
    label: 'File',
    icon: '📁',
    children: [
      { id: 'new', label: 'New', icon: '➕', metadata: { shortcut: 'Ctrl+N' } },
      { id: 'open', label: 'Open', icon: '📂', metadata: { shortcut: 'Ctrl+O' } },
      { id: 'save', label: 'Save', icon: '💾', metadata: { shortcut: 'Ctrl+S' } },
      { id: 'save-as', label: 'Save As...', icon: '💾', metadata: { shortcut: 'Ctrl+Shift+S' } },
      { id: 'close', label: 'Close', icon: '❌', metadata: { shortcut: 'Ctrl+W' } },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: '✏️',
    children: [
      { id: 'undo', label: 'Undo', icon: '↶', metadata: { shortcut: 'Ctrl+Z' } },
      { id: 'redo', label: 'Redo', icon: '↷', metadata: { shortcut: 'Ctrl+Y' } },
      { id: 'cut', label: 'Cut', icon: '✂️', metadata: { shortcut: 'Ctrl+X' } },
      { id: 'copy', label: 'Copy', icon: '📋', metadata: { shortcut: 'Ctrl+C' } },
      { id: 'paste', label: 'Paste', icon: '📄', metadata: { shortcut: 'Ctrl+V' } },
    ],
  },
  {
    id: 'view',
    label: 'View',
    icon: '👁️',
    children: [
      { id: 'zoom-in', label: 'Zoom In', icon: '🔍', metadata: { shortcut: 'Ctrl+Plus' } },
      { id: 'zoom-out', label: 'Zoom Out', icon: '🔎', metadata: { shortcut: 'Ctrl+Minus' } },
      { id: 'fullscreen', label: 'Full Screen', icon: '⛶', metadata: { shortcut: 'F11' } },
    ],
  },
];

export const MenuStructure: Story = {
  args: {
    treeData: {
      title: 'Application Menu',
      nodes: menuTree,
      showMetadata: true,
      expandAll: false,
    },
  },
};

export const SmallTree: Story = {
  args: {
    treeData: {
      title: 'Simple Hierarchy',
      nodes: [
        {
          id: 'root',
          label: 'Root',
          icon: '🌳',
          children: [
            { id: 'child1', label: 'Child 1', icon: '🌿' },
            { id: 'child2', label: 'Child 2', icon: '🌿' },
          ],
        },
      ],
      showMetadata: false,
    },
  },
};

export const DeepNesting: Story = {
  args: {
    treeData: {
      title: 'Deeply Nested Structure',
      nodes: [
        {
          id: 'level1',
          label: 'Level 1',
          icon: '1️⃣',
          expanded: true,
          children: [
            {
              id: 'level2',
              label: 'Level 2',
              icon: '2️⃣',
              expanded: true,
              children: [
                {
                  id: 'level3',
                  label: 'Level 3',
                  icon: '3️⃣',
                  expanded: true,
                  children: [
                    {
                      id: 'level4',
                      label: 'Level 4',
                      icon: '4️⃣',
                      expanded: true,
                      children: [
                        {
                          id: 'level5',
                          label: 'Level 5',
                          icon: '5️⃣',
                          metadata: { depth: '5 levels deep' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      showMetadata: true,
      expandAll: true,
    },
  },
};
