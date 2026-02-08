import { type Table } from "@tanstack/react-table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { TableToolInput } from "../types";

const getVisibleColumns = (table: Table<any>) =>
  table.getVisibleLeafColumns().filter((col) => col.id !== "select");

const getHeaders = (table: Table<any>) =>
  getVisibleColumns(table).map((col) => {
    const header = col.columnDef.header;
    return typeof header === "string" ? header : col.id;
  });

const getRows = (table: Table<any>) => table.getFilteredRowModel().rows;

const generateCSVContent = (table: Table<any>) => {
  const rows = getRows(table);
  const visibleColumns = getVisibleColumns(table);
  const headers = getHeaders(table);

  return [
    headers.join(","),
    ...rows.map((row) =>
      visibleColumns
        .map((col) => {
          const value = row.getValue(col.id);
          const strValue = String(value ?? "");
          return strValue.includes(",") ||
            strValue.includes('"') ||
            strValue.includes("\n")
            ? `"${strValue.replace(/"/g, '""')}"`
            : strValue;
        })
        .join(","),
    ),
  ].join("\n");
};

const generateTSVContent = (table: Table<any>) => {
  const rows = getRows(table);
  const visibleColumns = getVisibleColumns(table);
  const headers = getHeaders(table);

  return [
    headers.join("\t"),
    ...rows.map((row) =>
      visibleColumns
        .map((col) => {
          const value = row.getValue(col.id);
          return String(value ?? "").replace(/\t/g, " ");
        })
        .join("\t"),
    ),
  ].join("\n");
};

export const copyTableToCSV = async (table: Table<any>): Promise<boolean> => {
  try {
    const csvContent = generateCSVContent(table);
    await navigator.clipboard.writeText(csvContent);
    return true;
  } catch (error) {
    console.error("Copy CSV failed:", error);
    return false;
  }
};

export const copyTableToTSV = async (table: Table<any>): Promise<boolean> => {
  try {
    const tsvContent = generateTSVContent(table);
    await navigator.clipboard.writeText(tsvContent);
    return true;
  } catch (error) {
    console.error("Copy TSV failed:", error);
    return false;
  }
};

export const exportTableToPDF = (
  table: Table<any>,
  tableData: TableToolInput,
) => {
  const doc = new jsPDF();
  const rows = getRows(table);
  const visibleColumns = getVisibleColumns(table);
  const headers = getHeaders(table);

  const data = rows.map((row) =>
    visibleColumns.map((col) => {
      const value = row.getValue(col.id);
      return String(value ?? "");
    }),
  );

  if (tableData.title) {
    doc.setFontSize(16);
    doc.text(tableData.title, 14, 15);
  }

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: tableData.title ? 25 : 15,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 100, 100] },
  });

  doc.save(`${tableData.title || "table"}.pdf`);
};

const generateMarkdownContent = (table: Table<any>) => {
  const rows = getRows(table);
  const visibleColumns = getVisibleColumns(table);
  const headers = getHeaders(table);

  // Escape pipe characters in cell content
  const escapePipe = (str: string) => str.replace(/\|/g, "\\|");

  // Create header row
  const headerRow = `| ${headers.map(escapePipe).join(" | ")} |`;

  // Create separator row (align left by default)
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;

  // Create data rows
  const dataRows = rows.map((row) =>
    `| ${visibleColumns
      .map((col) => {
        const value = row.getValue(col.id);
        return escapePipe(String(value ?? ""));
      })
      .join(" | ")} |`
  );

  return [headerRow, separatorRow, ...dataRows].join("\n");
};

const generateHTMLContent = (table: Table<any>) => {
  const rows = getRows(table);
  const visibleColumns = getVisibleColumns(table);
  const headers = getHeaders(table);

  // Escape HTML characters
  const escapeHTML = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  // Create table HTML
  const headerHTML = `<tr>${headers.map((h) => `<th>${escapeHTML(h)}</th>`).join("")}</tr>`;

  const dataHTML = rows
    .map(
      (row) =>
        `<tr>${visibleColumns
          .map((col) => {
            const value = row.getValue(col.id);
            return `<td>${escapeHTML(String(value ?? ""))}</td>`;
          })
          .join("")}</tr>`
    )
    .join("");

  return `<table border="1" cellpadding="5" cellspacing="0"><thead>${headerHTML}</thead><tbody>${dataHTML}</tbody></table>`;
};

export const copyTableToMarkdown = async (
  table: Table<any>
): Promise<boolean> => {
  try {
    const markdownContent = generateMarkdownContent(table);
    const htmlContent = generateHTMLContent(table);

    // Use multiformat clipboard API
    const clipboardItem = new ClipboardItem({
      "text/plain": new Blob([markdownContent], { type: "text/plain" }),
      "text/html": new Blob([htmlContent], { type: "text/html" }),
    });

    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.error("Copy markdown failed:", error);
    return false;
  }
};
