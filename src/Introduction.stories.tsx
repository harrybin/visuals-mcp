import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import './app.css';

const IntroComponent: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-text-primary, #1e1e1e)' }}>
        MCP Visuals - Interactive Components
      </h1>
      
      <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: 'var(--color-text-secondary, #666)' }}>
        A collection of interactive visual components for Model Context Protocol (MCP) applications.
        These components enable AI agents to display rich, interactive UI elements to users.
      </p>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-text-primary, #1e1e1e)' }}>Available Components</h2>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <ComponentCard
            icon="📊"
            title="Table"
            description="Interactive data tables with TanStack Table featuring sorting, filtering, pagination, row selection, column visibility, and export functionality (CSV, TSV, Markdown, PDF)."
            features={[
              'Multi-column sorting',
              'Column filtering',
              'Pagination',
              'Row selection',
              'Column visibility toggle',
              'Export to CSV, TSV, Markdown, PDF'
            ]}
          />
          
          <ComponentCard
            icon="🖼️"
            title="Image"
            description="Image preview cards with metadata display. Supports data URIs and external URLs."
            features={[
              'Display images from URLs or data URIs',
              'Show title and caption',
              'Display metadata (dimensions, file size, filename)',
              'Responsive sizing',
              'Theme-aware styling'
            ]}
          />
          
          <ComponentCard
            icon="🌳"
            title="Tree"
            description="Interactive tree view for hierarchical data with expand/collapse functionality, node selection, and metadata display."
            features={[
              'Expand/collapse nodes',
              'Node selection',
              'Metadata display',
              'Custom icons per node',
              'Export to Text, HTML, Image'
            ]}
          />
          
          <ComponentCard
            icon="📋"
            title="List"
            description="Interactive list component with drag-and-drop reordering, checkboxes, images, and metadata support."
            features={[
              'Drag-and-drop reordering',
              'Checkbox support',
              'Item images',
              'Compact mode',
              'Copy to clipboard'
            ]}
          />
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-text-primary, #1e1e1e)' }}>Key Features</h2>
        <ul style={{ lineHeight: '1.8', color: 'var(--color-text-secondary, #666)' }}>
          <li><strong>MCP-Apps Pattern:</strong> Implements the Model Context Protocol Apps pattern for rich UI interactions</li>
          <li><strong>Theme Support:</strong> All components support both light and dark themes</li>
          <li><strong>Interactive:</strong> Components send state updates back to AI agents via <code>updateModelContext()</code></li>
          <li><strong>Single-file Bundling:</strong> Each component is bundled into a single HTML file using Vite</li>
          <li><strong>Accessibility:</strong> Components include ARIA labels and keyboard navigation support</li>
          <li><strong>Export Functionality:</strong> Multiple export formats (CSV, PDF, HTML, Markdown, etc.)</li>
        </ul>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--color-text-primary, #1e1e1e)' }}>Technologies</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <TechBadge name="React 19" />
          <TechBadge name="TypeScript" />
          <TechBadge name="Vite" />
          <TechBadge name="TanStack Table" />
          <TechBadge name="MCP SDK" />
          <TechBadge name="Zod" />
          <TechBadge name="jsPDF" />
        </div>
      </div>

      <div style={{ background: 'var(--color-background-secondary, #f5f5f5)', padding: '1.5rem', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-text-primary, #1e1e1e)' }}>Getting Started</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary, #666)' }}>
          Explore each component in the sidebar to see various configurations and use cases.
          Each story demonstrates different features and scenarios.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="https://github.com/harrybin/visuals-mcp" target="_blank" rel="noopener noreferrer" style={{ 
            display: 'inline-block', 
            padding: '0.75rem 1.5rem', 
            background: '#2563eb', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '6px',
            fontWeight: '600'
          }}>
            View on GitHub
          </a>
          <a href="https://www.npmjs.com/package/@harrybin/visuals-mcp" target="_blank" rel="noopener noreferrer" style={{ 
            display: 'inline-block', 
            padding: '0.75rem 1.5rem', 
            background: '#059669', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '6px',
            fontWeight: '600'
          }}>
            NPM Package
          </a>
        </div>
      </div>
    </div>
  );
};

const ComponentCard: React.FC<{ icon: string; title: string; description: string; features: string[] }> = ({ icon, title, description, features }) => {
  return (
    <div style={{ 
      border: '1px solid var(--color-border, #e0e0e0)', 
      borderRadius: '8px', 
      padding: '1.5rem',
      background: 'var(--color-background-primary, #ffffff)'
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text-primary, #1e1e1e)' }}>{title}</h3>
      <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary, #666)' }}>{description}</p>
      <ul style={{ marginLeft: '1.25rem', lineHeight: '1.6', color: 'var(--color-text-secondary, #666)' }}>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

const TechBadge: React.FC<{ name: string }> = ({ name }) => {
  return (
    <span style={{ 
      display: 'inline-block', 
      padding: '0.375rem 0.875rem', 
      background: 'var(--color-background-secondary, #f5f5f5)', 
      color: 'var(--color-text-primary, #1e1e1e)', 
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: '1px solid var(--color-border, #e0e0e0)'
    }}>
      {name}
    </span>
  );
};

const meta: Meta<typeof IntroComponent> = {
  title: 'MCP Visuals/Introduction',
  component: IntroComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Welcome to MCP Visuals - A collection of interactive visual components for Model Context Protocol applications.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IntroComponent>;

export const Welcome: Story = {};
