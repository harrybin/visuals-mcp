/**
 * Renders the repo metrics chart dashboard using Recharts in a headless Chromium browser
 * and saves the result as a PNG screenshot.
 *
 * Usage:
 *   node scripts/screenshot-chart-dashboard.cjs
 *   node scripts/screenshot-chart-dashboard.cjs --metrics doc/repo-metrics.json --out doc/screenshots/chart-grid.png
 *
 * Requires: playwright (devDependency), doc/repo-metrics.json
 * React 19 dropped UMD builds, so React 18 is loaded from jsdelivr CDN at render time.
 * Recharts UMD is loaded from local node_modules.
 */

"use strict";

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function argVal(flag, def) {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : def;
}
const metricsFile = argVal("--metrics", "doc/repo-metrics.json");
const outFile = argVal("--out", "doc/screenshots/chart-grid.png");

const repoRoot = path.resolve(__dirname, "..");
const metricsPath = path.resolve(repoRoot, metricsFile);
const outPath = path.resolve(repoRoot, outFile);
const rechartsUmd = path.join(
  repoRoot,
  "node_modules",
  "recharts",
  "umd",
  "Recharts.js",
);

// ── Validate inputs ─────────────────────────────────────────────────────────
if (!fs.existsSync(metricsPath)) {
  console.error(`Metrics file not found: ${metricsPath}`);
  console.error("Run:  npm run metrics:repo:write");
  process.exit(1);
}
if (!fs.existsSync(rechartsUmd)) {
  console.error(`Recharts UMD not found: ${rechartsUmd}`);
  process.exit(1);
}

// ── Build chart data from metrics snapshot ───────────────────────────────────
const metrics = JSON.parse(fs.readFileSync(metricsPath, "utf8"));
let cumulative = 0;
const chartData = metrics.byLanguage.map((row, i) => {
  cumulative += row.lines;
  return { ...row, rank: i + 1, cumulativeLines: cumulative };
});

// ── HTML shell (no inline scripts — we inject them via addScriptTag) ─────────
const HTML_SHELL = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
  body   { background: #1e1e2e; color: #cdd6f4; padding: 20px; }
  h1     { font-size: 18px; margin-bottom: 16px; color: #cba6f7; text-align: center; }
  .grid  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .card  { background: #313244; border-radius: 8px; padding: 12px; }
  .card-title { font-size: 12px; font-weight: 600; color: #89b4fa; margin-bottom: 8px; text-align: center; }
</style>
</head>
<body>
  <h1>visuals-mcp Repository Metrics Dashboard</h1>
  <div class="grid" id="root"></div>
</body>
</html>`;

// ── React app (injected after React + Recharts are on window) ────────────────
const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const APP_SCRIPT = `
(function () {
  const DATA   = ${JSON.stringify(chartData)};
  const COLORS = ${JSON.stringify(COLORS)};

  const {
    BarChart, Bar, LineChart, Line, AreaChart, Area,
    PieChart, Pie, Cell, ScatterChart, Scatter,
    ComposedChart, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
  } = Recharts;

  const e = React.createElement;
  const MARGIN      = { top: 5, right: 10, bottom: 55, left: 10 };
  const LABEL_PROPS = { angle: -40, textAnchor: "end", fontSize: 10, fill: "#cdd6f4" };
  const TT_STYLE    = { contentStyle: { background: "#1e1e2e", border: "1px solid #45475a" } };
  const LEG_STYLE   = { wrapperStyle: { fontSize: 10 } };
  const TICK        = { fontSize: 10, fill: "#cdd6f4" };

  function Card(title, chart) {
    return e("div", { className: "card" },
      e("div", { className: "card-title" }, title),
      e(ResponsiveContainer, { width: "100%", height: 200 }, chart)
    );
  }

  function BarCard() {
    return Card("Lines of Code by Language",
      e(BarChart, { data: DATA, margin: MARGIN },
        e(CartesianGrid, { strokeDasharray: "3 3", stroke: "#45475a" }),
        e(XAxis, { dataKey: "language", tick: LABEL_PROPS }),
        e(YAxis, { tick: TICK }),
        e(Tooltip, TT_STYLE), e(Legend, LEG_STYLE),
        e(Bar, { dataKey: "lines", name: "Lines", fill: COLORS[0] })));
  }

  function PieCard() {
    return Card("File Count Share by Language",
      e(PieChart, {},
        e(Tooltip, TT_STYLE), e(Legend, LEG_STYLE),
        e(Pie, { data: DATA, dataKey: "files", nameKey: "language",
                 cx: "50%", cy: "50%", outerRadius: 70,
                 label: function(p) { return p.language.split("/")[0]; } },
          DATA.map(function(_, i) { return e(Cell, { key: i, fill: COLORS[i % COLORS.length] }); })
        )));
  }

  function ScatterCard() {
    return Card("Files vs Lines by Language",
      e(ScatterChart, { margin: MARGIN },
        e(CartesianGrid, { strokeDasharray: "3 3", stroke: "#45475a" }),
        e(XAxis, { dataKey: "files",  name: "Files",
                   tick: TICK, label: { value: "files",  position: "bottom", fill: "#cdd6f4", fontSize: 10 } }),
        e(YAxis, { dataKey: "lines",  name: "Lines",  tick: TICK }),
        e(Tooltip, Object.assign({ cursor: { strokeDasharray: "3 3" } }, TT_STYLE)),
        e(Scatter, { data: DATA, name: "Language", fill: COLORS[2] })));
  }

  function LineCard() {
    return Card("Language Rank Trend (Lines)",
      e(LineChart, { data: DATA, margin: MARGIN },
        e(CartesianGrid, { strokeDasharray: "3 3", stroke: "#45475a" }),
        e(XAxis, { dataKey: "rank", tick: TICK,
                   label: { value: "rank", position: "bottom", fill: "#cdd6f4", fontSize: 10 } }),
        e(YAxis, { tick: TICK }),
        e(Tooltip, TT_STYLE), e(Legend, LEG_STYLE),
        e(Line, { type: "monotone", dataKey: "lines", name: "Lines by Rank",
                  stroke: COLORS[3], dot: true })));
  }

  function AreaCard() {
    return Card("Cumulative Lines by Language Rank",
      e(AreaChart, { data: DATA, margin: MARGIN },
        e(CartesianGrid, { strokeDasharray: "3 3", stroke: "#45475a" }),
        e(XAxis, { dataKey: "rank", tick: TICK,
                   label: { value: "rank", position: "bottom", fill: "#cdd6f4", fontSize: 10 } }),
        e(YAxis, { tick: TICK }),
        e(Tooltip, TT_STYLE), e(Legend, LEG_STYLE),
        e(Area, { type: "monotone", dataKey: "cumulativeLines", name: "Cumulative Lines",
                  stroke: COLORS[1], fill: COLORS[1], fillOpacity: 0.25 })));
  }

  function ComposedCard() {
    return Card("Files and Lines by Language",
      e(ComposedChart, { data: DATA, margin: MARGIN },
        e(CartesianGrid, { strokeDasharray: "3 3", stroke: "#45475a" }),
        e(XAxis, { dataKey: "language", tick: LABEL_PROPS }),
        e(YAxis, { yAxisId: "left",  tick: TICK, orientation: "left"  }),
        e(YAxis, { yAxisId: "right", tick: TICK, orientation: "right" }),
        e(Tooltip, TT_STYLE), e(Legend, LEG_STYLE),
        e(Bar,  { yAxisId: "left",  dataKey: "files", name: "Files",  fill: COLORS[4] }),
        e(Line, { yAxisId: "right", type: "monotone", dataKey: "lines", name: "Lines",
                  stroke: COLORS[9], dot: false })));
  }

  function App() {
    return e(React.Fragment, null,
      e(BarCard), e(PieCard), e(ScatterCard),
      e(LineCard), e(AreaCard), e(ComposedCard));
  }

  ReactDOM.createRoot(document.getElementById("root")).render(e(App));
})();
`;

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("console", (m) => console.log("  browser:", m.type(), m.text()));
  page.on("pageerror", (e) => console.error("  page error:", e.message));

  await page.setViewportSize({ width: 1200, height: 900 });
  await page.setContent(HTML_SHELL);

  // React 18 UMDs must load before Recharts (React 19 dropped UMD; Recharts also needs react-is)
  await page.addScriptTag({
    url: "https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js",
  });
  await page.addScriptTag({
    url: "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js",
  });
  await page.addScriptTag({
    url: "https://cdn.jsdelivr.net/npm/react-is@18/umd/react-is.production.min.js",
  });
  await page.addScriptTag({ path: rechartsUmd });
  await page.addScriptTag({ content: APP_SCRIPT });

  // Wait for at least one Recharts SVG surface to appear
  await page.waitForSelector(".recharts-surface", { timeout: 20000 });
  // Brief pause so all 6 charts finish their animation frame
  await page.waitForTimeout(800);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();

  console.log(`Screenshot saved → ${path.relative(repoRoot, outPath)}`);
})().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
