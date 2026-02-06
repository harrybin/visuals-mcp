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
