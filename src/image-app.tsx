import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type { ImageToolInput } from "../types";
import "./app.css";
import "./image.css";

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

function ImageApp() {
  const [imageData, setImageData] = useState<ImageToolInput | null>(null);

  const { app } = useApp({
    appInfo: { name: "image-preview", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (createdApp) => {
      applyThemeMode("dark");

      createdApp.ontoolinput = (params) => {
        const data = params.arguments as ImageToolInput;
        setImageData(data);
      };

      createdApp.ontoolresult = (result: any) => {
        const uiData = result?._meta?.ui?.data as ImageToolInput | undefined;
        if (uiData?.src) {
          setImageData(uiData);
        }
      };

      createdApp.onhostcontextchanged = (ctx) => {
        applyThemeMode(resolveThemeMode(ctx));

        if (ctx.safeAreaInsets) {
          const { top, right, bottom, left } = ctx.safeAreaInsets;
          document.body.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
        }
      };

      createdApp.onteardown = async () => {
        return {};
      };
    },
  });

  useEffect(() => {
    if (!app || !imageData) return;
    const summary =
      imageData.title || imageData.filename || "Image preview loaded";

    app
      .sendLog({
        level: "info",
        data: `Image preview: ${summary}`,
      })
      .catch(console.error);
  }, [app, imageData]);

  const metaItems = useMemo(() => {
    if (!imageData) return [];

    return [
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
  }, [imageData]);

  const sourceDisplay = useMemo(() => {
    if (!imageData) return "";
    if (imageData.src.startsWith("data:")) {
      return "data:... (inline)";
    }
    if (imageData.src.length > 140) {
      return `${imageData.src.slice(0, 140)}...`;
    }
    return imageData.src;
  }, [imageData]);

  if (!imageData) {
    return (
      <div className="image-loading">
        <p>Loading image preview...</p>
      </div>
    );
  }

  return (
    <div className="image-shell">
      <header className="image-header">
        <div>
          <h1>{imageData.title || "Image Preview"}</h1>
          {imageData.filename ? (
            <p className="image-subtitle">{imageData.filename}</p>
          ) : null}
        </div>
      </header>

      <section className="image-card">
        <div className="image-frame">
          <img
            src={imageData.src}
            alt={imageData.alt || imageData.title || "Image preview"}
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
            {metaItems.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
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
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<ImageApp />);
}
