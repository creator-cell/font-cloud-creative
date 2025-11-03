import type { Response } from "express";

const escapeCell = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "bigint") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  const str = String(value);
  if (str.includes(",") || str.includes("\n") || str.includes("\"")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const buildCsvResponse = <T extends Record<string, unknown>>(res: Response, rows: T[]): void => {
  if (rows.length === 0) {
    res.write("\n");
    res.end();
    return;
  }

  const headers = Object.keys(rows[0]);
  res.write(`${headers.join(",")}\n`);
  rows.forEach((row) => {
    const line = headers.map((header) => escapeCell(row[header])).join(",");
    res.write(`${line}\n`);
  });
  res.end();
};

