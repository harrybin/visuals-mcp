import type { Meta, StoryObj } from "@storybook/react";
import { ChartView } from "./chart";
import type { ChartToolInput } from "../types";
import "./app.css";
import "./chart.css";

const meta: Meta<typeof ChartView> = {
  title: "MCP Visuals/Chart",
  component: ChartView,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Interactive chart component supporting multiple chart types (line, bar, area, pie, scatter, composed) with Recharts. Supports multiple charts with customizable layouts, legends, tooltips, and data export.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChartView>;

const salesData = [
  { month: "Jan", sales: 4000, expenses: 2400, profit: 1600 },
  { month: "Feb", sales: 3000, expenses: 1398, profit: 1602 },
  { month: "Mar", sales: 2000, expenses: 9800, profit: -7800 },
  { month: "Apr", sales: 2780, expenses: 3908, profit: -1128 },
  { month: "May", sales: 1890, expenses: 4800, profit: -2910 },
  { month: "Jun", sales: 2390, expenses: 3800, profit: -1410 },
  { month: "Jul", sales: 3490, expenses: 4300, profit: -810 },
];

const pieData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 200 },
  { name: "Other", value: 100 },
];

const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

export const LineChart: Story = {
  args: {
    chartData: {
      title: "Sales Trends",
      charts: [
        {
          type: "line",
          title: "Monthly Sales Performance",
          data: salesData,
          xAxisKey: "month",
          series: [
            { dataKey: "sales", name: "Sales", color: "#8884d8" },
            { dataKey: "expenses", name: "Expenses", color: "#82ca9d" },
          ],
          height: 300,
          showLegend: true,
          showGrid: true,
          showTooltip: true,
        },
      ],
    },
  },
};

export const BarChart: Story = {
  args: {
    chartData: {
      title: "Sales Analysis",
      charts: [
        {
          type: "bar",
          title: "Monthly Sales vs Expenses",
          data: salesData,
          xAxisKey: "month",
          series: [
            { dataKey: "sales", name: "Sales", color: "#8884d8" },
            { dataKey: "expenses", name: "Expenses", color: "#82ca9d" },
          ],
          height: 300,
        },
      ],
    },
  },
};

export const StackedBarChart: Story = {
  args: {
    chartData: {
      title: "Stacked Sales Analysis",
      charts: [
        {
          type: "bar",
          title: "Monthly Sales Breakdown",
          data: salesData,
          xAxisKey: "month",
          series: [
            { dataKey: "sales", name: "Sales", color: "#8884d8" },
            { dataKey: "expenses", name: "Expenses", color: "#82ca9d" },
          ],
          height: 300,
          stacked: true,
        },
      ],
    },
  },
};

export const AreaChart: Story = {
  args: {
    chartData: {
      title: "Trend Analysis",
      charts: [
        {
          type: "area",
          title: "Monthly Trends",
          data: salesData,
          xAxisKey: "month",
          series: [
            { dataKey: "sales", name: "Sales", color: "#8884d8" },
            { dataKey: "expenses", name: "Expenses", color: "#82ca9d" },
          ],
          height: 300,
        },
      ],
    },
  },
};

export const StackedAreaChart: Story = {
  args: {
    chartData: {
      title: "Stacked Trend Analysis",
      charts: [
        {
          type: "area",
          title: "Monthly Cumulative Trends",
          data: salesData,
          xAxisKey: "month",
          series: [
            { dataKey: "sales", name: "Sales", color: "#8884d8" },
            { dataKey: "expenses", name: "Expenses", color: "#82ca9d" },
          ],
          height: 300,
          stacked: true,
        },
      ],
    },
  },
};

export const PieChart: Story = {
  args: {
    chartData: {
      title: "Platform Distribution",
      charts: [
        {
          type: "pie",
          title: "Usage by Platform",
          data: pieData,
          nameKey: "name",
          dataKey: "value",
          height: 350,
        },
      ],
    },
  },
};

export const ScatterChart: Story = {
  args: {
    chartData: {
      title: "Correlation Analysis",
      charts: [
        {
          type: "scatter",
          title: "X vs Y Correlation",
          data: scatterData,
          xAxisKey: "x",
          series: [{ dataKey: "y", name: "Y Values", color: "#8884d8" }],
          height: 300,
        },
      ],
    },
  },
};

export const ComposedChart: Story = {
  args: {
    chartData: {
      title: "Combined Analysis",
      charts: [
        {
          type: "composed",
          title: "Sales, Expenses, and Profit",
          data: salesData,
          xAxisKey: "month",
          series: [
            { dataKey: "sales", name: "Sales", color: "#8884d8", type: "bar" },
            {
              dataKey: "expenses",
              name: "Expenses",
              color: "#82ca9d",
              type: "bar",
            },
            {
              dataKey: "profit",
              name: "Profit",
              color: "#ffc658",
              type: "line",
            },
          ],
          height: 300,
        },
      ],
    },
  },
};

export const DualAxisChart: Story = {
  args: {
    chartData: {
      title: "Dual Axis Analysis",
      charts: [
        {
          type: "composed",
          title: "Sales (Left) vs Profit (Right)",
          data: salesData,
          xAxisKey: "month",
          series: [
            {
              dataKey: "sales",
              name: "Sales",
              color: "#8884d8",
              type: "bar",
              yAxisId: "left",
            },
            {
              dataKey: "profit",
              name: "Profit",
              color: "#ffc658",
              type: "line",
              yAxisId: "right",
            },
          ],
          height: 300,
        },
      ],
    },
  },
};

export const MultipleChartsVertical: Story = {
  args: {
    chartData: {
      title: "Sales Dashboard",
      layout: "vertical",
      charts: [
        {
          type: "line",
          title: "Sales Trend",
          data: salesData,
          xAxisKey: "month",
          series: [{ dataKey: "sales", name: "Sales", color: "#8884d8" }],
          height: 250,
        },
        {
          type: "bar",
          title: "Expenses Breakdown",
          data: salesData,
          xAxisKey: "month",
          series: [{ dataKey: "expenses", name: "Expenses", color: "#82ca9d" }],
          height: 250,
        },
        {
          type: "pie",
          title: "Platform Distribution",
          data: pieData,
          nameKey: "name",
          dataKey: "value",
          height: 300,
        },
      ],
    },
  },
};

export const MultipleChartsHorizontal: Story = {
  args: {
    chartData: {
      title: "Side by Side Comparison",
      layout: "horizontal",
      charts: [
        {
          type: "line",
          title: "Sales Trend",
          data: salesData,
          xAxisKey: "month",
          series: [{ dataKey: "sales", name: "Sales", color: "#8884d8" }],
          height: 300,
        },
        {
          type: "bar",
          title: "Expenses",
          data: salesData,
          xAxisKey: "month",
          series: [{ dataKey: "expenses", name: "Expenses", color: "#82ca9d" }],
          height: 300,
        },
      ],
    },
  },
};

export const MultipleChartsGrid: Story = {
  args: {
    chartData: {
      title: "Dashboard Grid View",
      layout: "grid",
      charts: [
        {
          type: "line",
          title: "Sales",
          data: salesData,
          xAxisKey: "month",
          series: [{ dataKey: "sales", name: "Sales", color: "#8884d8" }],
          height: 250,
        },
        {
          type: "bar",
          title: "Expenses",
          data: salesData,
          xAxisKey: "month",
          series: [{ dataKey: "expenses", name: "Expenses", color: "#82ca9d" }],
          height: 250,
        },
        {
          type: "area",
          title: "Profit",
          data: salesData,
          xAxisKey: "month",
          series: [{ dataKey: "profit", name: "Profit", color: "#ffc658" }],
          height: 250,
        },
        {
          type: "pie",
          title: "Distribution",
          data: pieData,
          nameKey: "name",
          dataKey: "value",
          height: 250,
        },
      ],
    },
  },
};

export const MinimalChart: Story = {
  args: {
    chartData: {
      charts: [
        {
          type: "line",
          data: salesData,
          xAxisKey: "month",
          series: [{ dataKey: "sales", name: "Sales" }],
          height: 300,
          showLegend: false,
          showGrid: false,
        },
      ],
    },
  },
};

export const EmptyChart: Story = {
  args: {
    chartData: {
      title: "Empty Chart View",
      charts: [],
    },
  },
};
