import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import type { MasterDetailToolInput } from "../types";
import { TableView } from "./table";
import { ListView } from "./list";
import "./app.css";
import "./master-detail.css";
import "./table-app.css";
import "./list.css";
import "./image.css";

const formatBytes = (bytes?: number) => {
  if (!bytes && bytes !== 0) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};

type DetailRendererProps = {
  content: any;
  item: any;
};

function DetailRenderer({ content, item }: DetailRendererProps) {
  if (content.type === "table") {
    return (
      <div className="detail-content">
        <TableView tableData={content.data} />
      </div>
    );
  }

  if (content.type === "list") {
    return (
      <div className="detail-content">
        <ListView listData={content.data} />
      </div>
    );
  }

  if (content.type === "image") {
    const imageData = content.data;
    const metaItems = [
      { label: "Filename", value: imageData.filename },
      {
        label: "Dimensions",
        value:
          imageData.width && imageData.height
            ? `${imageData.width} x ${imageData.height}`
            : undefined,
      },
      { label: "Size", value: formatBytes(imageData.sizeBytes) },
    ].filter((item) => item.value);

    const sourceDisplay = imageData.src.startsWith("data:")
      ? "data:... (inline)"
      : imageData.src.length > 140
        ? `${imageData.src.slice(0, 140)}...`
        : imageData.src;

    return (
      <div className="detail-content">
        <div className="image-shell">
          <section className="image-card">
            <div className="image-frame">
              <img
                src={imageData.src}
                alt={imageData.alt || imageData.title || item.label}
                style={{
                  width: imageData.width ? `${imageData.width}px` : "100%",
                  height: imageData.height ? `${imageData.height}px` : "auto",
                }}
              />
            </div>

            {imageData.caption ? (
              <p className="image-caption">{imageData.caption}</p>
            ) : null}

            {metaItems.length > 0 ? (
              <dl className="image-meta">
                {metaItems.map((metaItem) => (
                  <div key={metaItem.label}>
                    <dt>{metaItem.label}</dt>
                    <dd>{metaItem.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="image-source">
              <span>Source</span>
              <p>{sourceDisplay}</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (content.type === "text") {
    const textData = content.data;
    return (
      <div className="detail-content">
        <div className="detail-text-content">
          {textData.isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: textData.content }} />
          ) : (
            <pre>{textData.content}</pre>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="detail-content">
      <div className="detail-empty">Unknown content type</div>
    </div>
  );
}

// Storybook-friendly master-detail component
function MasterDetailStory({ data }: { data: MasterDetailToolInput }) {
  const [selectedId, setSelectedId] = useState<string | null>(
    data.defaultSelectedId ||
      (data.masterItems.length > 0 ? data.masterItems[0].id : null),
  );

  const selectedItem = data.masterItems.find((item) => item.id === selectedId);
  const detailContent = selectedId ? data.detailContents[selectedId] : null;
  const orientation = data.orientation || "horizontal";
  const masterWidth = data.masterWidth || 300;

  return (
    <div className={`master-detail-container ${orientation}`}>
      <div
        className="master-panel"
        style={
          orientation === "horizontal"
            ? { width: `${masterWidth}px`, minWidth: `${masterWidth}px` }
            : { height: "40%" }
        }
      >
        <div className="master-list">
          {data.masterItems.map((item) => (
            <div
              key={item.id}
              className={`master-item ${selectedId === item.id ? "selected" : ""}`}
              onClick={() => setSelectedId(item.id)}
            >
              {item.icon && <div className="master-item-icon">{item.icon}</div>}
              <div className="master-item-content">
                <p className="master-item-label">{item.label}</p>
                {item.description && (
                  <p className="master-item-description">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-panel">
        {data.title && (
          <div
            className="detail-header"
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            <h1 style={{ fontSize: "1.25rem", margin: "0.5rem 0" }}>
              {data.title}
            </h1>
          </div>
        )}
        {selectedItem && (
          <div className="detail-header">
            <h2>{selectedItem.label}</h2>
            {selectedItem.description && (
              <p className="detail-header-subtitle">
                {selectedItem.description}
              </p>
            )}
          </div>
        )}
        {detailContent ? (
          <DetailRenderer content={detailContent} item={selectedItem!} />
        ) : (
          <div className="detail-content">
            <div className="detail-empty">Select an item to view details</div>
          </div>
        )}
      </div>
    </div>
  );
}

const meta: Meta<typeof MasterDetailStory> = {
  title: "MCP Visuals/Master-Detail",
  component: MasterDetailStory,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Master-detail view component that displays a list of items on one side and detailed content on the other. Supports tables, images, lists, and custom text content as detail views.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MasterDetailStory>;

// Sample stories
const productsMasterDetail: MasterDetailToolInput = {
  title: "Product Catalog",
  masterItems: [
    {
      id: "prod1",
      label: "Laptop Pro",
      icon: "💻",
      description: "High-performance laptop",
    },
    {
      id: "prod2",
      label: "Wireless Mouse",
      icon: "🖱️",
      description: "Precision input device",
    },
    {
      id: "prod3",
      label: "USB-C Hub",
      icon: "🔌",
      description: "Multi-port connectivity",
    },
    {
      id: "prod4",
      label: "Monitor 4K",
      icon: "🖥️",
      description: "Ultra-high resolution display",
    },
  ],
  detailContents: {
    prod1: {
      type: "table",
      data: {
        title: "Laptop Pro Details",
        columns: [
          { key: "field", label: "Field", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { field: "Product ID", value: "PROD-001" },
          { field: "Category", value: "Electronics" },
          { field: "Price", value: "$1,299.99" },
          { field: "Stock", value: "45 units" },
          { field: "Rating", value: "4.8/5.0" },
        ],
      },
    },
    prod2: {
      type: "table",
      data: {
        title: "Mouse Details",
        columns: [
          { key: "field", label: "Field", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { field: "Product ID", value: "PROD-002" },
          { field: "Category", value: "Accessories" },
          { field: "Price", value: "$29.99" },
          { field: "Stock", value: "234 units" },
          { field: "Rating", value: "4.6/5.0" },
        ],
      },
    },
    prod3: {
      type: "table",
      data: {
        title: "Hub Details",
        columns: [
          { key: "field", label: "Field", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { field: "Product ID", value: "PROD-003" },
          { field: "Category", value: "Accessories" },
          { field: "Price", value: "$49.99" },
          { field: "Stock", value: "567 units" },
          { field: "Rating", value: "4.7/5.0" },
        ],
      },
    },
    prod4: {
      type: "table",
      data: {
        title: "Monitor Details",
        columns: [
          { key: "field", label: "Field", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { field: "Product ID", value: "PROD-004" },
          { field: "Resolution", value: "3840 x 2160 (4K)" },
          { field: "Price", value: "$399.99" },
          { field: "Stock", value: "23 units" },
          { field: "Rating", value: "4.9/5.0" },
        ],
      },
    },
  },
};

export const Default: Story = {
  args: {
    data: productsMasterDetail,
  },
};

const employeesMasterDetail: MasterDetailToolInput = {
  title: "Team Directory",
  masterItems: [
    {
      id: "emp1",
      label: "Alice Johnson",
      icon: "👩‍💼",
      description: "Senior Developer",
    },
    {
      id: "emp2",
      label: "Bob Smith",
      icon: "👨‍💼",
      description: "Product Manager",
    },
    {
      id: "emp3",
      label: "Carol White",
      icon: "👩‍💼",
      description: "UX Designer",
    },
    {
      id: "emp4",
      label: "David Brown",
      icon: "👨‍💼",
      description: "DevOps Engineer",
    },
  ],
  detailContents: {
    emp1: {
      type: "table",
      data: {
        title: "Employee Details",
        columns: [
          { key: "field", label: "Field", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { field: "Name", value: "Alice Johnson" },
          { field: "Department", value: "Engineering" },
          { field: "Title", value: "Senior Developer" },
          { field: "Email", value: "alice@company.com" },
          { field: "Start Date", value: "2020-03-15" },
        ],
      },
    },
    emp2: {
      type: "table",
      data: {
        title: "Employee Details",
        columns: [
          { key: "field", label: "Field", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { field: "Name", value: "Bob Smith" },
          { field: "Department", value: "Product" },
          { field: "Title", value: "Product Manager" },
          { field: "Email", value: "bob@company.com" },
          { field: "Start Date", value: "2019-07-20" },
        ],
      },
    },
    emp3: {
      type: "table",
      data: {
        title: "Employee Details",
        columns: [
          { key: "field", label: "Field", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { field: "Name", value: "Carol White" },
          { field: "Department", value: "Design" },
          { field: "Title", value: "Senior UX Designer" },
          { field: "Email", value: "carol@company.com" },
          { field: "Start Date", value: "2021-01-15" },
        ],
      },
    },
    emp4: {
      type: "table",
      data: {
        title: "Employee Details",
        columns: [
          { key: "field", label: "Field", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { field: "Name", value: "David Brown" },
          { field: "Department", value: "Infrastructure" },
          { field: "Title", value: "DevOps Engineer" },
          { field: "Email", value: "david@company.com" },
          { field: "Start Date", value: "2020-09-10" },
        ],
      },
    },
  },
};

export const TeamDirectory: Story = {
  args: {
    data: employeesMasterDetail,
  },
};

const projectsMasterDetail: MasterDetailToolInput = {
  title: "Active Projects",
  masterItems: [
    {
      id: "proj1",
      label: "Website Redesign",
      icon: "🎨",
      description: "Q1 Initiative",
    },
    { id: "proj2", label: "Mobile App", icon: "📱", description: "Q2 Launch" },
    {
      id: "proj3",
      label: "Backend Refactor",
      icon: "⚙️",
      description: "Technical Debt",
    },
  ],
  detailContents: {
    proj1: {
      type: "list",
      data: {
        title: "Task List",
        items: [
          { id: "1", content: "Design mockups", checked: true },
          { id: "2", content: "Get stakeholder approval", checked: true },
          { id: "3", content: "Setup design system", checked: false },
          { id: "4", content: "Implement components", checked: false },
          { id: "5", content: "Testing & refinements", checked: false },
        ],
      },
    },
    proj2: {
      type: "list",
      data: {
        title: "Task List",
        items: [
          { id: "1", content: "Requirements gathering", checked: true },
          { id: "2", content: "Design sprint", checked: true },
          { id: "3", content: "Frontend development", checked: true },
          { id: "4", content: "Backend API", checked: false },
          { id: "5", content: "Testing", checked: false },
          { id: "6", content: "Soft launch", checked: false },
        ],
      },
    },
    proj3: {
      type: "list",
      data: {
        title: "Task List",
        items: [
          { id: "1", content: "Code audit", checked: true },
          { id: "2", content: "Architecture planning", checked: true },
          { id: "3", content: "Module migration", checked: false },
          { id: "4", content: "Integration testing", checked: false },
          { id: "5", content: "Performance benchmarking", checked: false },
        ],
      },
    },
  },
};

export const ProjectManagement: Story = {
  args: {
    data: projectsMasterDetail,
  },
};

const knowledgeBaseMasterDetail: MasterDetailToolInput = {
  title: "Knowledge Base",
  masterItems: [
    {
      id: "kb1",
      label: "Getting Started",
      icon: "🚀",
      description: "Quick start guide",
    },
    {
      id: "kb2",
      label: "Configuration",
      icon: "⚙️",
      description: "Setup options",
    },
    {
      id: "kb3",
      label: "API Reference",
      icon: "🔌",
      description: "Developer docs",
    },
  ],
  detailContents: {
    kb1: {
      type: "text",
      data: {
        content: `# Getting Started

Welcome to our platform! Follow these steps to get up and running:

1. **Create an Account**: Sign up at our website
2. **Configure Your Profile**: Add your information
3. **Create Your First Project**: Start building
4. **Integrate with Your Tools**: Connect your services
5. **Deploy**: Launch your application

For detailed instructions, check out our full documentation.`,
        isHtml: false,
      },
    },
    kb2: {
      type: "text",
      data: {
        content: `# Configuration Guide

## Environment Variables
API_KEY=your_api_key_here
DEBUG=true
LOG_LEVEL=info

## Settings
- Timeout: 30 seconds
- Max Retries: 3
- Cache TTL: 5 minutes

## Performance Tuning
- Use connection pooling for databases
- Enable caching for static content
- Compress API responses`,
        isHtml: false,
      },
    },
    kb3: {
      type: "text",
      data: {
        content: `# API Reference

## Endpoints

### GET /api/users
Returns a list of users with ID, name, and email.

### POST /api/users
Create a new user with name and email.

### GET /api/users/:id
Get user by ID.

### DELETE /api/users/:id
Delete user by ID.

### PUT /api/users/:id
Update user information.`,
        isHtml: false,
      },
    },
  },
};

export const KnowledgeBase: Story = {
  args: {
    data: knowledgeBaseMasterDetail,
  },
};

const verticalMasterDetail: MasterDetailToolInput = {
  title: "Dashboard",
  orientation: "vertical",
  masterItems: [
    { id: "db1", label: "Overview", icon: "📊" },
    { id: "db2", label: "Analytics", icon: "📈" },
    { id: "db3", label: "Reports", icon: "📋" },
  ],
  detailContents: {
    db1: {
      type: "table",
      data: {
        title: "Key Metrics",
        columns: [
          { key: "metric", label: "Metric", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { metric: "Total Users", value: "15,234" },
          { metric: "Active Sessions", value: "3,456" },
          { metric: "Revenue", value: "$125,000" },
          { metric: "Growth", value: "+12.5%" },
        ],
      },
    },
    db2: {
      type: "table",
      data: {
        title: "Performance",
        columns: [
          { key: "date", label: "Date", type: "string" },
          { key: "pageviews", label: "Page Views", type: "string" },
        ],
        rows: [
          { date: "2024-01-15", pageviews: "45,230" },
          { date: "2024-01-16", pageviews: "52,100" },
          { date: "2024-01-17", pageviews: "48,950" },
        ],
      },
    },
    db3: {
      type: "table",
      data: {
        title: "Recent Reports",
        columns: [
          { key: "title", label: "Title", type: "string" },
          { key: "date", label: "Date", type: "string" },
        ],
        rows: [
          { title: "Monthly Summary", date: "2024-01-31" },
          { title: "Quarterly Review", date: "2024-01-30" },
          { title: "Annual Report", date: "2023-12-31" },
        ],
      },
    },
  },
};

export const VerticalLayout: Story = {
  args: {
    data: verticalMasterDetail,
  },
};

const wideMasterDetail: MasterDetailToolInput = {
  title: "File Explorer",
  masterWidth: 400,
  masterItems: [
    { id: "file1", label: "Documents", icon: "📁" },
    { id: "file2", label: "Projects", icon: "📁" },
    { id: "file3", label: "Archive", icon: "📁" },
  ],
  detailContents: {
    file1: {
      type: "table",
      data: {
        title: "Files in Documents",
        columns: [
          { key: "name", label: "Name", type: "string" },
          { key: "size", label: "Size", type: "string" },
          { key: "modified", label: "Modified", type: "string" },
        ],
        rows: [
          { name: "Report.pdf", size: "2.4 MB", modified: "2024-01-15" },
          { name: "Presentation.pptx", size: "8.7 MB", modified: "2024-01-14" },
          { name: "Spreadsheet.xlsx", size: "1.2 MB", modified: "2024-01-13" },
        ],
      },
    },
    file2: {
      type: "table",
      data: {
        title: "Active Projects",
        columns: [
          { key: "project", label: "Project", type: "string" },
          { key: "files", label: "Files", type: "string" },
        ],
        rows: [
          { project: "Website Redesign", files: "45 files" },
          { project: "Mobile App", files: "120 files" },
          { project: "API Integration", files: "78 files" },
        ],
      },
    },
    file3: {
      type: "table",
      data: {
        title: "Archived Items",
        columns: [
          { key: "name", label: "Name", type: "string" },
          { key: "date", label: "Archived", type: "string" },
        ],
        rows: [
          { name: "Old_Project_2022", date: "2023-01-01" },
          { name: "Legacy_Code", date: "2022-12-15" },
          { name: "Backup_Data_2021", date: "2022-01-01" },
        ],
      },
    },
  },
};

export const CustomMasterWidth: Story = {
  args: {
    data: wideMasterDetail,
  },
};

const preselectMasterDetail: MasterDetailToolInput = {
  title: "Feature Flags",
  defaultSelectedId: "feat2",
  masterItems: [
    { id: "feat1", label: "Dark Mode", icon: "🌙", description: "Disabled" },
    { id: "feat2", label: "Analytics", icon: "📊", description: "Enabled" },
    { id: "feat3", label: "Beta Features", icon: "🔬", description: "Enabled" },
  ],
  detailContents: {
    feat1: {
      type: "table",
      data: {
        title: "Dark Mode Status",
        columns: [
          { key: "property", label: "Property", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { property: "Status", value: "Disabled" },
          { property: "Rollout %", value: "0%" },
          { property: "Target Users", value: "None" },
          { property: "Last Updated", value: "2024-01-10" },
        ],
      },
    },
    feat2: {
      type: "table",
      data: {
        title: "Analytics Status",
        columns: [
          { key: "property", label: "Property", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { property: "Status", value: "Enabled" },
          { property: "Rollout %", value: "100%" },
          { property: "Target Users", value: "All" },
          { property: "Last Updated", value: "2024-01-15" },
        ],
      },
    },
    feat3: {
      type: "table",
      data: {
        title: "Beta Features Status",
        columns: [
          { key: "property", label: "Property", type: "string" },
          { key: "value", label: "Value", type: "string" },
        ],
        rows: [
          { property: "Status", value: "Enabled" },
          { property: "Rollout %", value: "25%" },
          { property: "Target Users", value: "Beta Testers" },
          { property: "Last Updated", value: "2024-01-12" },
        ],
      },
    },
  },
};

export const WithDefaultSelection: Story = {
  args: {
    data: preselectMasterDetail,
  },
};
