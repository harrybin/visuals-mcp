import type { TreeToolInput, TreeNode } from "../types";

/**
 * Convert tree structure to text representation
 */
const treeToText = (nodes: TreeNode[], prefix: string = ""): string => {
  let result = "";

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const childPrefix = isLast ? "    " : "│   ";

    const icon = node.icon ? `${node.icon} ` : "";
    const metadata = node.metadata
      ? ` (${Object.entries(node.metadata)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")})`
      : "";

    result += `${prefix}${connector}${icon}${node.label}${metadata}\n`;

    if (node.children && node.children.length > 0) {
      result += treeToText(node.children, prefix + childPrefix);
    }
  });

  return result;
};

/**
 * Copy tree structure to clipboard as formatted text
 */
export const copyTreeToClipboard = async (
  treeData: TreeToolInput,
): Promise<boolean> => {
  try {
    const title = treeData.title ? `${treeData.title}\n\n` : "";
    const treeText = treeToText(treeData.nodes);
    const fullText = title + treeText;

    await navigator.clipboard.writeText(fullText);
    return true;
  } catch (error) {
    console.error("Copy to clipboard failed:", error);
    return false;
  }
};

/**
 * Generate HTML representation of the tree
 */
const treeToHTML = (nodes: TreeNode[], showMetadata: boolean = true): string => {
  let html = '<ul class="tree-export-list">';

  nodes.forEach((node) => {
    const icon = node.icon ? `<span class="tree-export-icon">${node.icon}</span>` : "";
    const metadata =
      showMetadata && node.metadata
        ? `<span class="tree-export-metadata">(${Object.entries(node.metadata)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")})</span>`
        : "";

    html += `<li class="tree-export-item">`;
    html += `<span class="tree-export-label">${icon}${node.label}${metadata}</span>`;

    if (node.children && node.children.length > 0) {
      html += treeToHTML(node.children, showMetadata);
    }

    html += `</li>`;
  });

  html += "</ul>";
  return html;
};

/**
 * Export tree as standalone HTML file
 */
export const exportTreeToHTML = (treeData: TreeToolInput) => {
  const title = treeData.title || "Tree View";
  const treeHTML = treeToHTML(treeData.nodes, treeData.showMetadata ?? true);

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      padding: 20px;
      background: #f5f5f5;
      color: #333;
    }

    h1 {
      margin-bottom: 20px;
      font-size: 24px;
    }

    .tree-export-list {
      list-style: none;
      padding-left: 20px;
    }

    .tree-export-item {
      margin: 4px 0;
    }

    .tree-export-label {
      display: inline-block;
      padding: 4px 8px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .tree-export-icon {
      margin-right: 6px;
    }

    .tree-export-metadata {
      margin-left: 8px;
      color: #666;
      font-size: 0.9em;
    }

    .tree-export-list .tree-export-list {
      margin-top: 4px;
      margin-left: 20px;
      border-left: 2px solid #ddd;
      padding-left: 12px;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${treeHTML}
</body>
</html>`;

  // Create a blob and download
  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export tree as PNG image using html2canvas
 * Note: This requires browser support for canvas and blob APIs
 * For production use, consider integrating the html2canvas library
 */
export const exportTreeToImage = async (): Promise<boolean> => {
  try {
    // Check if the browser supports the necessary APIs
    if (!("toBlob" in HTMLCanvasElement.prototype)) {
      console.warn("Browser does not support canvas.toBlob()");
      return false;
    }

    // Note: A full implementation would use html2canvas or similar library
    // to render the DOM tree to canvas. This is a placeholder that creates
    // a simple canvas as a fallback.
    
    // For a production implementation, you would:
    // 1. Install html2canvas: npm install html2canvas
    // 2. Import it: import html2canvas from 'html2canvas';
    // 3. Use it like: const canvas = await html2canvas(treeWrapper);
    
    console.warn("Tree image export requires html2canvas library for full functionality");
    return false;
  } catch (error) {
    console.error("Export to image failed:", error);
    return false;
  }
};
