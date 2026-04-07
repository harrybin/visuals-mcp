import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import './app.css';

const componentCards = [
  {
    title: 'Table',
    eyebrow: 'Data exploration',
    description:
      'Sortable, filterable tables with pagination, row selection, column controls, and multi-format export.',
    features: ['Sorting and filters', 'Row selection', 'CSV, TSV, Markdown, PDF export'],
  },
  {
    title: 'Chart',
    eyebrow: 'Comparisons and trends',
    description:
      'Composable chart dashboards with line, bar, area, pie, scatter, and mixed chart support.',
    features: ['Multiple chart layouts', 'Dual-axis and composed charts', 'JSON, CSV, SVG, JPG export'],
  },
  {
    title: 'Image',
    eyebrow: 'Visual context',
    description:
      'Preview cards for screenshots, diagrams, and photos with optional metadata and responsive sizing.',
    features: ['Local file and URL support', 'Metadata display', 'Theme-aware framing'],
  },
  {
    title: 'Master Detail',
    eyebrow: 'Browse collections',
    description:
      'A split-pane browser for inspecting records, documents, or entities with focused detail content.',
    features: ['Selectable master list', 'Horizontal or vertical layout', 'Rich detail panes'],
  },
  {
    title: 'Tree',
    eyebrow: 'Hierarchical data',
    description:
      'Expandable trees for nested structures with icons, metadata, selection, and export helpers.',
    features: ['Expand and collapse', 'Metadata display', 'Text, HTML, image export'],
  },
  {
    title: 'List',
    eyebrow: 'Task-like collections',
    description:
      'Flexible lists with checkboxes, drag-and-drop ordering, thumbnails, and compact display options.',
    features: ['Reordering', 'Checkboxes', 'Images and subtext', 'Copy and export-friendly output'],
  },
] as const;

const workflowSteps = [
  'Open a component story from the sidebar and validate the baseline variant.',
  'Use Controls and Docs to verify props, layout modes, and output states.',
  'Mirror the same payload shape in the MCP tool once the story looks correct.',
] as const;

const technologyBadges = ['React 19', 'TypeScript', 'Vite', 'TanStack Table', 'Recharts', 'MCP SDK', 'Zod', 'jsPDF'] as const;

const IntroComponent: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '48px 28px 72px',
        background:
          'radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 28%), radial-gradient(circle at top right, rgba(5, 150, 105, 0.16), transparent 24%), linear-gradient(180deg, var(--color-background-primary, #ffffff) 0%, var(--color-background-secondary, #f5f5f5) 100%)',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          fontFamily:
            'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          color: 'var(--color-text-primary, #1e1e1e)',
        }}
      >
        <section
          style={{
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: 'minmax(0, 1.7fr) minmax(260px, 0.9fr)',
            alignItems: 'stretch',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              padding: '32px',
              borderRadius: '28px',
              background: 'var(--color-background-primary, rgba(255,255,255,0.92))',
              border: '1px solid var(--color-border, rgba(148, 163, 184, 0.28))',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                padding: '6px 12px',
                borderRadius: '999px',
                marginBottom: '18px',
                background: 'rgba(37, 99, 235, 0.10)',
                color: '#1d4ed8',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Storybook Workspace
            </div>
            <h1 style={{ fontSize: '3rem', lineHeight: 1.05, margin: '0 0 16px' }}>
              MCP Visuals for AI-driven UI surfaces
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: '50rem',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary, #475569)',
              }}
            >
              This Storybook is the fastest way to validate the interactive components behind the MCP tools exposed by the server. Use it to inspect visual states, compare layouts, and verify payload shapes before wiring them into prompts or tool outputs.
            </p>
          </div>

          <div
            style={{
              padding: '28px',
              borderRadius: '28px',
              background: '#0f172a',
              color: '#e2e8f0',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)',
            }}
          >
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#93c5fd', marginBottom: '12px' }}>
              Included views
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1, marginBottom: '12px' }}>6</div>
            <p style={{ margin: '0 0 18px', lineHeight: 1.7, color: '#cbd5e1' }}>
              Tables, charts, images, master-detail panels, trees, and lists share the same MCP App patterns, theme handling, and export-oriented workflows.
            </p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {workflowSteps.map((step) => (
                <div
                  key={step}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: 'rgba(148, 163, 184, 0.12)',
                    lineHeight: 1.5,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.85rem', margin: '0 0 16px' }}>Component coverage</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
            }}
          >
            {componentCards.map((card) => (
              <ComponentCard
                key={card.title}
                title={card.title}
                eyebrow={card.eyebrow}
                description={card.description}
                features={card.features}
              />
            ))}
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gap: '20px',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(280px, 0.85fr)',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              padding: '28px',
              borderRadius: '24px',
              background: 'var(--color-background-primary, #ffffff)',
              border: '1px solid var(--color-border, #e2e8f0)',
            }}
          >
            <h2 style={{ fontSize: '1.7rem', margin: '0 0 14px' }}>What this repo optimizes for</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8, color: 'var(--color-text-secondary, #475569)' }}>
              <li>Single-file app bundles that can be embedded directly in MCP UI resources.</li>
              <li>Interactive states that report back to the model through updateModelContext.</li>
              <li>Theme-aware layouts that behave well inside constrained VS Code surfaces.</li>
              <li>Practical export paths for sharing tables, charts, trees, and other visual output.</li>
            </ul>
          </div>

          <div
            style={{
              padding: '28px',
              borderRadius: '24px',
              background: 'var(--color-background-primary, #ffffff)',
              border: '1px solid var(--color-border, #e2e8f0)',
            }}
          >
            <h2 style={{ fontSize: '1.7rem', margin: '0 0 14px' }}>Stack</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {technologyBadges.map((badge) => (
                <TechBadge key={badge} name={badge} />
              ))}
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://github.com/harrybin/visuals-mcp" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.8rem 1.1rem', background: '#2563eb', color: '#ffffff', textDecoration: 'none', borderRadius: '999px', fontWeight: 600 }}>
                Repository
              </a>
              <a href="https://www.npmjs.com/package/visuals-mcp" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '0.8rem 1.1rem', background: '#059669', color: '#ffffff', textDecoration: 'none', borderRadius: '999px', fontWeight: 600 }}>
                NPM package
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

type ComponentCardProps = {
  title: string;
  eyebrow: string;
  description: string;
  features: readonly string[];
};

const ComponentCard: React.FC<ComponentCardProps> = ({ title, eyebrow, description, features }) => {
  return (
    <div
      style={{
        border: '1px solid var(--color-border, rgba(148, 163, 184, 0.28))',
        borderRadius: '24px',
        padding: '24px',
        background: 'var(--color-background-primary, rgba(255,255,255,0.92))',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f766e', marginBottom: '10px' }}>
        {eyebrow}
      </div>
      <h3 style={{ fontSize: '1.45rem', margin: '0 0 10px', color: 'var(--color-text-primary, #1e1e1e)' }}>{title}</h3>
      <p style={{ margin: '0 0 14px', lineHeight: 1.7, color: 'var(--color-text-secondary, #475569)' }}>{description}</p>
      <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.7', color: 'var(--color-text-secondary, #475569)' }}>
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
};

const TechBadge: React.FC<{ name: string }> = ({ name }) => {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.45rem 0.9rem',
        background: 'var(--color-background-secondary, #f8fafc)',
        color: 'var(--color-text-primary, #1e1e1e)',
        borderRadius: '999px',
        fontSize: '0.875rem',
        fontWeight: 600,
        border: '1px solid var(--color-border, #e2e8f0)',
      }}
    >
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
        component: 'Welcome page for the MCP Visuals Storybook workspace, covering the current interactive UI surface area and validation workflow.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IntroComponent>;

export const Welcome: Story = {};
