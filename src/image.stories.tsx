import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { ImageToolInput } from '../types';
import './app.css';
import './image.css';

// Create a simple wrapper component since ImageView doesn't exist as a standalone component
// We'll render the image preview card directly
const ImagePreview: React.FC<{ imageData: ImageToolInput }> = ({ imageData }) => {
  const formatBytes = (bytes?: number): string => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const truncateUrl = (url: string, maxLen = 50): string => {
    if (url.length <= maxLen) return url;
    return url.substring(0, maxLen - 3) + '...';
  };

  return (
    <div className="image-container" style={{ padding: '20px' }}>
      {imageData.title && <h2 className="image-title">{imageData.title}</h2>}
      
      <div className="image-preview-card">
        <div className="image-wrapper">
          <img
            src={imageData.src}
            alt={imageData.alt || imageData.title || 'Image preview'}
            style={{
              maxWidth: imageData.width ? `${imageData.width}px` : '100%',
              maxHeight: imageData.height ? `${imageData.height}px` : 'auto',
            }}
          />
        </div>
        
        {(imageData.caption || imageData.filename || imageData.sizeBytes) && (
          <div className="image-metadata">
            {imageData.caption && <p className="image-caption">{imageData.caption}</p>}
            {imageData.filename && <p className="image-filename">📄 {imageData.filename}</p>}
            {imageData.sizeBytes && <p className="image-size">💾 {formatBytes(imageData.sizeBytes)}</p>}
            {imageData.width && imageData.height && (
              <p className="image-dimensions">📐 {imageData.width} × {imageData.height}px</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const meta: Meta<typeof ImagePreview> = {
  title: 'MCP Visuals/Image',
  component: ImagePreview,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Image preview card component that displays images with optional metadata including title, caption, dimensions, and file size. Supports data URIs and external URLs.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImagePreview>;

// Sample base64 image (1x1 pixel red PNG)
const sampleDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

// Sample SVG image
const sampleSvg = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#4a90e2"/>
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">
    Sample Image
  </text>
  <circle cx="100" cy="100" r="40" fill="#f39c12"/>
  <circle cx="300" cy="200" r="50" fill="#e74c3c"/>
</svg>
`)}`;

export const Default: Story = {
  args: {
    imageData: {
      src: sampleSvg,
      title: 'Sample Visualization',
      caption: 'This is a simple SVG illustration demonstrating the image preview component.',
      filename: 'sample-visual.svg',
      width: 400,
      height: 300,
      sizeBytes: 1234,
    },
  },
};

export const WithoutTitle: Story = {
  args: {
    imageData: {
      src: sampleSvg,
      alt: 'Visualization without title',
      caption: 'An image can be displayed without a title.',
      filename: 'no-title.svg',
      sizeBytes: 1234,
    },
  },
};

export const WithoutMetadata: Story = {
  args: {
    imageData: {
      src: sampleSvg,
      title: 'Minimal Image',
      alt: 'Image without metadata',
    },
  },
};

export const Screenshot: Story = {
  args: {
    imageData: {
      src: sampleDataUri,
      title: 'Application Screenshot',
      caption: 'Screenshot captured on 2024-01-15 at 14:30',
      filename: 'screenshot-2024-01-15.png',
      width: 1920,
      height: 1080,
      sizeBytes: 245760,
    },
  },
};

export const Diagram: Story = {
  args: {
    imageData: {
      src: `data:image/svg+xml;base64,${btoa(`
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
    </marker>
  </defs>
  
  <!-- Boxes -->
  <rect x="50" y="100" width="120" height="60" fill="#3498db" stroke="#2c3e50" stroke-width="2" rx="5"/>
  <text x="110" y="135" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Client</text>
  
  <rect x="250" y="100" width="120" height="60" fill="#2ecc71" stroke="#2c3e50" stroke-width="2" rx="5"/>
  <text x="310" y="135" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Server</text>
  
  <rect x="450" y="100" width="120" height="60" fill="#e74c3c" stroke="#2c3e50" stroke-width="2" rx="5"/>
  <text x="510" y="135" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Database</text>
  
  <!-- Arrows -->
  <line x1="170" y1="130" x2="250" y2="130" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <text x="210" y="120" font-family="Arial, sans-serif" font-size="12" fill="#333" text-anchor="middle">HTTP</text>
  
  <line x1="370" y1="130" x2="450" y2="130" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <text x="410" y="120" font-family="Arial, sans-serif" font-size="12" fill="#333" text-anchor="middle">SQL</text>
</svg>
      `)}`,
      title: 'System Architecture Diagram',
      caption: 'Three-tier architecture showing client, server, and database layers',
      filename: 'architecture-diagram.svg',
      width: 600,
      height: 400,
      sizeBytes: 3456,
    },
  },
};

export const Photo: Story = {
  args: {
    imageData: {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      title: 'Mountain Landscape',
      caption: 'Beautiful mountain scenery at sunrise',
      alt: 'Majestic mountains with snow-capped peaks at golden hour',
      filename: 'mountain-landscape.jpg',
      width: 800,
      height: 533,
      sizeBytes: 524288,
    },
  },
};

export const LargeImage: Story = {
  args: {
    imageData: {
      src: sampleSvg,
      title: 'High Resolution Image',
      caption: 'Large image demonstrating responsive sizing',
      filename: 'large-image.svg',
      width: 4096,
      height: 2160,
      sizeBytes: 2097152,
    },
  },
};
