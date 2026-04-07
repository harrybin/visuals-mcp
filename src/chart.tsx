import React, { useState, useCallback, useRef } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { ChartToolInput, ChartConfig, ChartState } from "../types";

type ChartViewProps = {
  chartData: ChartToolInput;
  onStateChange?: (state: ChartState, summary: string) => void;
};

const DEFAULT_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
  "#8dd1e1",
];

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const copyBlobToClipboard = async (
  blob: Blob,
  mimeType: string,
): Promise<boolean> => {
  try {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
      return false;
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        [mimeType]: blob,
      }),
    ]);
    return true;
  } catch {
    return false;
  }
};

const svgToJpegBlob = async (
  svgMarkup: string,
  width: number,
  height: number,
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const image = new Image();
    const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }

      // Use a white background for JPG output since JPG has no alpha channel.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    };

    image.onerror = () => resolve(null);
    image.src = svgDataUri;
  });
};

export function ChartView({ chartData, onStateChange }: ChartViewProps) {
  const [activeChart, setActiveChart] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const notifyStateChange = useCallback(
    (chartIndex: number, dataPoint?: any) => {
      if (!onStateChange) return;

      const state: ChartState = {
        activeChart: chartIndex,
        hoveredDataPoint: dataPoint,
      };

      const summary = `Chart ${chartIndex + 1} of ${chartData.charts.length}`;
      onStateChange(state, summary);
    },
    [chartData.charts.length, onStateChange],
  );

  const handleChartClick = (chartIndex: number) => {
    setActiveChart(chartIndex);
    notifyStateChange(chartIndex);
  };

  const exportAsJSON = async () => {
    const json = JSON.stringify(chartData, null, 2);
    const ok = await copyToClipboard(json);
    showToast(ok ? "Chart data copied as JSON!" : "Copy failed");
  };

  const exportAsCSV = async () => {
    const allData: string[] = [];

    chartData.charts.forEach((chart, idx) => {
      if (chart.title) {
        allData.push(`\n# ${chart.title}\n`);
      } else {
        allData.push(`\n# Chart ${idx + 1}\n`);
      }

      if (chart.data.length === 0) {
        allData.push("No data\n");
        return;
      }

      // Get all keys from first data point
      const keys = Object.keys(chart.data[0]);
      allData.push(keys.join(","));

      chart.data.forEach((row) => {
        const values = keys.map((key) => {
          const val = row[key];
          if (typeof val === "string" && val.includes(",")) {
            return `"${val}"`;
          }
          return String(val);
        });
        allData.push(values.join(","));
      });
    });

    const ok = await copyToClipboard(allData.join("\n"));
    showToast(ok ? "Chart data copied as CSV!" : "Copy failed");
  };

  const getActiveChartSvg = (): {
    svgMarkup: string;
    width: number;
    height: number;
  } | null => {
    const container = chartContainerRef.current;
    if (!container) {
      return null;
    }

    const chartItems = container.querySelectorAll<HTMLElement>(".chart-item");
    const activeItem = chartItems[activeChart];
    if (!activeItem) {
      return null;
    }

    const svg = activeItem.querySelector<SVGElement>(
      "svg.recharts-surface, svg",
    );
    if (!svg) {
      return null;
    }

    const clonedSvg = svg.cloneNode(true) as SVGElement;
    if (!clonedSvg.getAttribute("xmlns")) {
      clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }
    if (!clonedSvg.getAttribute("xmlns:xlink")) {
      clonedSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    }

    const bounds = svg.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));

    if (!clonedSvg.getAttribute("viewBox")) {
      clonedSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
    if (!clonedSvg.getAttribute("width")) {
      clonedSvg.setAttribute("width", String(width));
    }
    if (!clonedSvg.getAttribute("height")) {
      clonedSvg.setAttribute("height", String(height));
    }

    return {
      svgMarkup: new XMLSerializer().serializeToString(clonedSvg),
      width,
      height,
    };
  };

  const exportAsSVG = async () => {
    const svgData = getActiveChartSvg();
    if (!svgData) {
      showToast("No active chart SVG found");
      return;
    }

    const svgBlob = new Blob([svgData.svgMarkup], { type: "image/svg+xml" });
    const copiedAsImage = await copyBlobToClipboard(svgBlob, "image/svg+xml");
    if (copiedAsImage) {
      showToast("Active chart copied as SVG!");
      return;
    }

    const copiedAsText = await copyToClipboard(svgData.svgMarkup);
    showToast(copiedAsText ? "SVG markup copied to clipboard!" : "Copy failed");
  };

  const exportAsJPG = async () => {
    const svgData = getActiveChartSvg();
    if (!svgData) {
      showToast("No active chart SVG found");
      return;
    }

    const jpgBlob = await svgToJpegBlob(
      svgData.svgMarkup,
      svgData.width,
      svgData.height,
    );
    if (!jpgBlob) {
      showToast("Failed to render JPG");
      return;
    }

    const copied = await copyBlobToClipboard(jpgBlob, "image/jpeg");
    showToast(copied ? "Active chart copied as JPG!" : "Copy failed");
  };

  const renderChart = (chart: ChartConfig, index: number) => {
    const width = chart.width || undefined;
    const height = chart.height || 300;
    const showGrid = chart.showGrid ?? true;
    const showLegend = chart.showLegend ?? true;
    const showTooltip = chart.showTooltip ?? true;

    const commonProps = {
      data: chart.data,
      onClick: () => handleChartClick(index),
    };

    const chartContent = (() => {
      switch (chart.type) {
        case "line":
          return (
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chart.xAxisKey || "x"} />
              <YAxis yAxisId="left" />
              {chart.series?.some((s) => s.yAxisId === "right") && (
                <YAxis yAxisId="right" orientation="right" />
              )}
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {chart.series?.map((series, idx) => (
                <Line
                  key={series.dataKey}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name || series.dataKey}
                  stroke={
                    series.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
                  }
                  yAxisId={series.yAxisId || "left"}
                />
              ))}
            </LineChart>
          );

        case "bar":
          return (
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chart.xAxisKey || "x"} />
              <YAxis yAxisId="left" />
              {chart.series?.some((s) => s.yAxisId === "right") && (
                <YAxis yAxisId="right" orientation="right" />
              )}
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {chart.series?.map((series, idx) => (
                <Bar
                  key={series.dataKey}
                  dataKey={series.dataKey}
                  name={series.name || series.dataKey}
                  fill={
                    series.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
                  }
                  yAxisId={series.yAxisId || "left"}
                  stackId={chart.stacked ? "stack" : undefined}
                />
              ))}
            </BarChart>
          );

        case "area":
          return (
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chart.xAxisKey || "x"} />
              <YAxis yAxisId="left" />
              {chart.series?.some((s) => s.yAxisId === "right") && (
                <YAxis yAxisId="right" orientation="right" />
              )}
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {chart.series?.map((series, idx) => (
                <Area
                  key={series.dataKey}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name || series.dataKey}
                  stroke={
                    series.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
                  }
                  fill={
                    series.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
                  }
                  yAxisId={series.yAxisId || "left"}
                  stackId={chart.stacked ? "stack" : undefined}
                />
              ))}
            </AreaChart>
          );

        case "pie":
          return (
            <PieChart onClick={() => handleChartClick(index)}>
              <Pie
                data={chart.data}
                dataKey={chart.dataKey || "value"}
                nameKey={chart.nameKey || "name"}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(height / 3, 120)}
                label
              >
                {chart.data.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
            </PieChart>
          );

        case "scatter":
          return (
            <ScatterChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chart.xAxisKey || "x"} type="number" />
              <YAxis type="number" />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {chart.series?.map((series, idx) => (
                <Scatter
                  key={series.dataKey}
                  name={series.name || series.dataKey}
                  dataKey={series.dataKey}
                  fill={
                    series.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]
                  }
                />
              ))}
            </ScatterChart>
          );

        case "composed":
          return (
            <ComposedChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={chart.xAxisKey || "x"} />
              <YAxis yAxisId="left" />
              {chart.series?.some((s) => s.yAxisId === "right") && (
                <YAxis yAxisId="right" orientation="right" />
              )}
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              {chart.series?.map((series, idx) => {
                const color =
                  series.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
                const name = series.name || series.dataKey;
                const yAxisId = series.yAxisId || "left";

                switch (series.type) {
                  case "bar":
                    return (
                      <Bar
                        key={series.dataKey}
                        dataKey={series.dataKey}
                        name={name}
                        fill={color}
                        yAxisId={yAxisId}
                      />
                    );
                  case "area":
                    return (
                      <Area
                        key={series.dataKey}
                        type="monotone"
                        dataKey={series.dataKey}
                        name={name}
                        stroke={color}
                        fill={color}
                        yAxisId={yAxisId}
                      />
                    );
                  case "line":
                  default:
                    return (
                      <Line
                        key={series.dataKey}
                        type="monotone"
                        dataKey={series.dataKey}
                        name={name}
                        stroke={color}
                        yAxisId={yAxisId}
                      />
                    );
                }
              })}
            </ComposedChart>
          );

        default:
          return <div>Unsupported chart type: {chart.type}</div>;
      }
    })();

    return (
      <div
        key={index}
        className={`chart-item ${activeChart === index ? "active" : ""}`}
      >
        {chart.title && <h3 className="chart-title">{chart.title}</h3>}
        <ResponsiveContainer width={width || "100%"} height={height}>
          {chartContent}
        </ResponsiveContainer>
      </div>
    );
  };

  const layoutClass = `chart-layout-${chartData.layout || "vertical"}`;

  return (
    <div className="chart-shell">
      {toast && <div className="chart-toast">{toast}</div>}

      {chartData.title && (
        <header className="chart-header">
          <h1>{chartData.title}</h1>
        </header>
      )}

      <div className="chart-controls">
        <div className="export-buttons">
          <button onClick={exportAsJSON} title="Copy chart data as JSON">
            📋 Copy JSON
          </button>
          <button onClick={exportAsCSV} title="Copy chart data as CSV">
            📋 Copy CSV
          </button>
          <button onClick={exportAsJPG} title="Copy active chart as JPG image">
            🖼️ Copy JPG
          </button>
          <button onClick={exportAsSVG} title="Copy active chart as SVG">
            🧩 Copy SVG
          </button>
        </div>
      </div>

      <div className={`chart-container ${layoutClass}`} ref={chartContainerRef}>
        {chartData.charts.length === 0 ? (
          <div className="chart-empty">No charts to display</div>
        ) : (
          chartData.charts.map((chart, idx) => renderChart(chart, idx))
        )}
      </div>

      <div className="chart-info">
        <span>
          {chartData.charts.length} chart
          {chartData.charts.length !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
