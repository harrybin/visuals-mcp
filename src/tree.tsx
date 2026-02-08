import React, { useEffect, useMemo, useState } from "react";
import type { TreeToolInput, TreeState, TreeNode } from "../types";
import {
  exportTreeToHTML,
  exportTreeToImage,
  copyTreeToClipboard,
} from "./tree-export";

type TreeViewProps = {
  treeData: TreeToolInput;
  onStateChange?: (state: TreeState, summary: string) => void;
};

type TreeNodeComponentProps = {
  node: TreeNode;
  level: number;
  expandedNodes: Set<string>;
  selectedNode: string | null;
  showMetadata: boolean;
  onToggle: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
};

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({
  node,
  level,
  expandedNodes,
  selectedNode,
  showMetadata,
  onToggle,
  onSelect,
}) => {
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNode === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node">
      <div
        className={`tree-node-content ${isSelected ? "selected" : ""}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => onSelect(node.id)}
      >
        {hasChildren && (
          <button
            className="tree-node-toggle"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        )}
        {!hasChildren && <span className="tree-node-spacer"></span>}
        {node.icon && <span className="tree-node-icon">{node.icon}</span>}
        <span className="tree-node-label">{node.label}</span>
        {showMetadata && node.metadata && (
          <span className="tree-node-metadata">
            {Object.entries(node.metadata)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-node-children">
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              selectedNode={selectedNode}
              showMetadata={showMetadata}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function TreeView({ treeData, onStateChange }: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>();

    // Expand nodes based on expandAll or node.expanded property
    const collectExpandedNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (treeData.expandAll || node.expanded) {
          initialExpanded.add(node.id);
        }
        if (node.children) {
          collectExpandedNodes(node.children);
        }
      });
    };

    collectExpandedNodes(treeData.nodes);
    return initialExpanded;
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    // Reset state when tree data changes
    const initialExpanded = new Set<string>();
    const collectExpandedNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (treeData.expandAll || node.expanded) {
          initialExpanded.add(node.id);
        }
        if (node.children) {
          collectExpandedNodes(node.children);
        }
      });
    };
    collectExpandedNodes(treeData.nodes);
    setExpandedNodes(initialExpanded);
    setSelectedNode(null);
  }, [treeData]);

  useEffect(() => {
    if (!onStateChange) return;

    const state: TreeState = {
      expandedNodeIds: Array.from(expandedNodes),
      selectedNodeId: selectedNode || undefined,
    };

    const summary = `${expandedNodes.size} nodes expanded${selectedNode ? ", 1 node selected" : ""}`;
    onStateChange(state, summary);
  }, [expandedNodes, selectedNode, onStateChange]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allNodeIds = new Set<string>();
    const collectAllNodes = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        allNodeIds.add(node.id);
        if (node.children) {
          collectAllNodes(node.children);
        }
      });
    };
    collectAllNodes(treeData.nodes);
    setExpandedNodes(allNodeIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const totalNodes = useMemo(() => {
    const count = (nodes: TreeNode[]): number => {
      return nodes.reduce(
        (sum, node) => sum + 1 + (node.children ? count(node.children) : 0),
        0,
      );
    };
    return count(treeData.nodes);
  }, [treeData.nodes]);

  return (
    <div className="tree-container">
      {toast && <div className="toast">{toast}</div>}
      {treeData.title && <h1 className="tree-title">{treeData.title}</h1>}

      <div className="controls">
        <div className="tree-controls">
          <button className="tree-btn" onClick={expandAll} title="Expand all nodes">
            ⊞ Expand All
          </button>
          <button className="tree-btn" onClick={collapseAll} title="Collapse all nodes">
            ⊟ Collapse All
          </button>
          <span className="tree-info">{totalNodes} total nodes</span>
        </div>

        <div className="export-buttons">
          <button
            className="export-btn"
            onClick={async () => {
              const ok = await copyTreeToClipboard(treeData);
              showToast(ok ? "Tree copied to clipboard!" : "Copy failed");
            }}
            title="Copy tree structure to clipboard"
          >
            📋 Copy
          </button>
          <button
            className="export-btn"
            onClick={() => {
              exportTreeToHTML(treeData);
              showToast("HTML file downloaded!");
            }}
            title="Export tree as HTML"
          >
            📄 Export HTML
          </button>
          <button
            className="export-btn"
            onClick={async () => {
              const ok = await exportTreeToImage();
              showToast(
                ok ? "Image downloaded!" : "Screenshot not supported in this browser",
              );
            }}
            title="Export tree as image (PNG)"
          >
            🖼️ Export Image
          </button>
        </div>
      </div>

      <div className="tree-wrapper">
        {treeData.nodes.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            expandedNodes={expandedNodes}
            selectedNode={selectedNode}
            showMetadata={treeData.showMetadata ?? true}
            onToggle={toggleNode}
            onSelect={setSelectedNode}
          />
        ))}
      </div>
    </div>
  );
}
