import React, { useState, useCallback, useEffect } from "react";
import type { ListToolInput, ListItem, ListState } from "../types";

type ListViewProps = {
  listData: ListToolInput;
  onStateChange?: (state: ListState, summary: string) => void;
};

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export function ListView({ listData, onStateChange }: ListViewProps) {
  const [items, setItems] = useState<ListItem[]>(listData.items);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    () => new Set(listData.items.filter((i) => i.checked).map((i) => i.id))
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Sync items when listData changes
  useEffect(() => {
    setItems(listData.items);
    setCheckedIds(new Set(listData.items.filter((i) => i.checked).map((i) => i.id)));
  }, [listData.items]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const notifyStateChange = useCallback(() => {
    if (!onStateChange) return;

    const state: ListState = {
      itemOrder: items.map((i) => i.id),
      checkedItemIds: Array.from(checkedIds),
      selectedItemId: selectedId,
    };

    const checkedCount = checkedIds.size;
    const summary = `${items.length} items, ${checkedCount} checked`;
    onStateChange(state, summary);
  }, [items, checkedIds, selectedId, onStateChange]);

  const handleCheckToggle = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setTimeout(notifyStateChange, 0);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);

    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIdx = items.findIndex((i) => i.id === draggedId);
    const targetIdx = items.findIndex((i) => i.id === targetId);

    if (draggedIdx === -1 || targetIdx === -1) {
      setDraggedId(null);
      return;
    }

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIdx, 1);
    newItems.splice(targetIdx, 0, draggedItem);

    setItems(newItems);
    setDraggedId(null);
    setTimeout(notifyStateChange, 0);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleCopyItem = async (item: ListItem) => {
    const ok = await copyToClipboard(item.content);
    showToast(ok ? "Copied to clipboard!" : "Copy failed");
  };

  const exportAsCSV = async () => {
    const csv = items
      .map((item) => {
        const checked = checkedIds.has(item.id) ? "true" : "false";
        const content = `"${item.content.replace(/"/g, '""')}"`;
        const subtext = item.subtext
          ? `"${item.subtext.replace(/"/g, '""')}"`
          : "";
        return `${item.id},${content},${checked},${subtext}`;
      })
      .join("\n");

    const header = "id,content,checked,subtext\n";
    const ok = await copyToClipboard(header + csv);
    showToast(ok ? "CSV copied to clipboard!" : "Copy failed");
  };

  const exportAsJSON = async () => {
    const json = JSON.stringify(
      items.map((item) => ({
        id: item.id,
        content: item.content,
        checked: checkedIds.has(item.id),
        subtext: item.subtext,
        image: item.image,
        metadata: item.metadata,
      })),
      null,
      2
    );
    const ok = await copyToClipboard(json);
    showToast(ok ? "JSON copied to clipboard!" : "Copy failed");
  };

  const exportAsText = async () => {
    const text = items
      .map((item, idx) => {
        const checkbox = checkedIds.has(item.id) ? "[x]" : "[ ]";
        const prefix = listData.allowCheckboxes ? `${checkbox} ` : `${idx + 1}. `;
        const main = item.content;
        const sub = item.subtext ? ` - ${item.subtext}` : "";
        return `${prefix}${main}${sub}`;
      })
      .join("\n");
    const ok = await copyToClipboard(text);
    showToast(ok ? "Text copied to clipboard!" : "Copy failed");
  };

  return (
    <div className="list-shell">
      {toast && <div className="list-toast">{toast}</div>}

      <header className="list-header">
        <h1>{listData.title || "List"}</h1>
      </header>

      <div className="list-controls">
        <div className="export-buttons">
          <button onClick={exportAsText} title="Copy as plain text">
            📋 Copy Text
          </button>
          <button onClick={exportAsCSV} title="Copy as CSV">
            📋 Copy CSV
          </button>
          <button onClick={exportAsJSON} title="Copy as JSON">
            📋 Copy JSON
          </button>
        </div>
      </div>

      <div className={`list-container ${listData.compact ? "compact" : ""}`}>
        {items.length === 0 ? (
          <div className="list-empty">No items to display</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`list-item ${listData.compact ? "compact" : ""} ${
                draggedId === item.id ? "dragging" : ""
              } ${dragOverId === item.id ? "drag-over" : ""} ${
                selectedId === item.id ? "selected" : ""
              }`}
              draggable={listData.allowReorder}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              onClick={() => setSelectedId(item.id)}
            >
              {listData.allowReorder && (
                <span className="drag-handle">⋮⋮</span>
              )}

              {listData.allowCheckboxes && (
                <input
                  type="checkbox"
                  className="item-checkbox"
                  checked={checkedIds.has(item.id)}
                  onChange={() => handleCheckToggle(item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <div className="item-content">
                {listData.showImages && item.image && (
                  <img
                    src={item.image}
                    alt={item.content}
                    className={`item-thumbnail ${listData.compact ? "compact" : ""}`}
                  />
                )}

                <div className="item-text">
                  <div className="item-main-text">{item.content}</div>
                  {item.subtext && (
                    <div className="item-subtext">{item.subtext}</div>
                  )}
                </div>
              </div>

              <div className="item-actions">
                <button
                  className="copy-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyItem(item);
                  }}
                  title="Copy item text"
                >
                  📋
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="list-info">
        <span>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
        {listData.allowCheckboxes && (
          <span>
            {checkedIds.size} checked
          </span>
        )}
      </div>
    </div>
  );
}
