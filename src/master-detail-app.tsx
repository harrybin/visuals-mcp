import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type {
  MasterDetailToolInput,
  MasterItem,
  DetailContent,
  MasterDetailState,
} from "../types";
import { TableView } from "./table";
import { ListView } from "./list";
import "./app.css";
import "./master-detail.css";
import "./table-app.css";
import "./image.css";
import "./list.css";

type ThemeMode = "dark" | "light";

const applyThemeMode = (mode: ThemeMode) => {
  const targets = [document.documentElement, document.body];
  for (const target of targets) {
    target.classList.toggle("theme-dark", mode === "dark");
    target.classList.toggle("theme-light", mode === "light");
    target.dataset.theme = mode;
  }
};

const resolveThemeMode = (ctx?: any): ThemeMode => {
  if (ctx?.isDarkTheme === true) return "dark";
  if (ctx?.isDarkTheme === false) return "light";

  const candidates = [
    ctx?.theme?.kind,
    ctx?.theme?.type,
    ctx?.colorTheme?.kind,
    ctx?.colorTheme?.type,
    ctx?.colorScheme,
    ctx?.theme,
    ctx?.colorTheme,
    ctx?.appearance,
  ];

  for (const value of candidates) {
    if (typeof value !== "string") continue;
    const normalized = value.toLowerCase();

    if (normalized.includes("dark") || normalized.includes("black")) {
      return "dark";
    }

    if (normalized.includes("light") || normalized.includes("white")) {
      return "light";
    }

    if (normalized.includes("hc")) {
      return normalized.includes("light") ? "light" : "dark";
    }
  }

  return "dark";
};

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
  content: DetailContent;
  item: MasterItem;
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

function MasterDetailApp() {
  const [data, setData] = useState<MasterDetailToolInput | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { app } = useApp({
    appInfo: { name: "master-detail-display", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (createdApp) => {
      applyThemeMode("dark");

      // Handle tool input - initial data load
      createdApp.ontoolinput = (params) => {
        console.log("Received tool input:", params);
        const inputData = params.arguments as MasterDetailToolInput;
        setData(inputData);

        // Set initial selection
        if (inputData.defaultSelectedId) {
          setSelectedId(inputData.defaultSelectedId);
        } else if (inputData.masterItems.length > 0) {
          setSelectedId(inputData.masterItems[0].id);
        }
      };

      // Handle host context changes (theme, safe area, etc.)
      createdApp.onhostcontextchanged = (ctx) => {
        console.log("Host context changed:", ctx);
        applyThemeMode(resolveThemeMode(ctx));

        // Handle safe area insets
        if (ctx.safeAreaInsets) {
          const { top, right, bottom, left } = ctx.safeAreaInsets;
          document.body.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
        }
      };

      // Cleanup on teardown
      createdApp.onteardown = async () => {
        console.log("App tearing down");
        return {};
      };
    },
  });

  // Send state updates to LLM
  useEffect(() => {
    if (!app || !data || !selectedId) return;

    const selectedItem = data.masterItems.find(
      (item) => item.id === selectedId,
    );
    if (!selectedItem) return;

    const state: MasterDetailState = {
      selectedItemId: selectedId,
      selectedItem: selectedItem,
    };

    app
      .updateModelContext({
        type: "master_detail_state",
        state: state,
        summary: `Selected: ${selectedItem.label}`,
      })
      .catch(console.error);
  }, [app, data, selectedId]);

  const handleItemClick = (id: string) => {
    setSelectedId(id);
  };

  if (!data) {
    return (
      <div className="master-detail-loading">
        <p>Loading master-detail view...</p>
      </div>
    );
  }

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
              onClick={() => handleItemClick(item.id)}
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

// Mount the app
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<MasterDetailApp />);
}
