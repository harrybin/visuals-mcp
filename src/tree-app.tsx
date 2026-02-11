import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type { TreeToolInput } from "../types";
import { TreeView } from "./tree";
import "./app.css";
import "./tree.css";

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

function TreeApp() {
  const [treeData, setTreeData] = useState<TreeToolInput | null>(null);

  const { app } = useApp({
    appInfo: { name: "tree-display", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (createdApp) => {
      applyThemeMode("dark");

      // Handle tool input - initial data load
      createdApp.ontoolinput = (params) => {
        console.log("Received tool input:", params);
        const data = params.arguments as TreeToolInput;
        setTreeData(data);
      };

      // Handle tool result
      createdApp.ontoolresult = (result: any) => {
        console.log("Received tool result:", result);

        if (result._meta?.ui?.data) {
          const uiData = result._meta.ui.data as TreeToolInput;
          setTreeData(uiData);
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

  if (!treeData) {
    return (
      <div className="loading">
        <p>Loading tree data...</p>
      </div>
    );
  }

  return (
    <TreeView
      treeData={treeData}
      onStateChange={(_treeState, summary) => {
        if (!app) return;
        app
          .sendLog({
            level: "info",
            data: `Tree state: ${summary}`,
          })
          .catch(console.error);
      }}
    />
  );
}

// Mount the app
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<TreeApp />);
}
