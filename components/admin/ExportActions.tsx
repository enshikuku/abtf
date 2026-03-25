"use client";

import { DownloadIcon, FileTextIcon, FileSpreadsheetIcon, FileTypeIcon } from "lucide-react";
import { exportRows, type ExportColumn, type ExportFormat } from "@/lib/admin-export";

interface ExportActionsProps<Row> {
    title: string;
    filenameBase: string;
    columns: ExportColumn<Row>[];
    rows: Row[];
    metadata?: Record<string, string | number>;
}

const formats: Array<{ key: ExportFormat; label: string; icon: typeof FileSpreadsheetIcon }> = [
    { key: "csv", label: "CSV", icon: FileSpreadsheetIcon },
    { key: "pdf", label: "PDF", icon: FileTextIcon },
    { key: "docx", label: "DOCX", icon: FileTypeIcon },
];

export function ExportActions<Row>({ title, filenameBase, columns, rows, metadata }: ExportActionsProps<Row>) {
    const runExport = async (format: ExportFormat) => {
        await exportRows({
            format,
            title,
            filenameBase,
            columns,
            rows,
            metadata,
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {formats.map((format) => (
                <button
                    key={format.key}
                    onClick={() => runExport(format.key)}
                    disabled={rows.length === 0}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <format.icon className="h-3.5 w-3.5" />
                    <DownloadIcon className="h-3.5 w-3.5" />
                    {format.label}
                </button>
            ))}
        </div>
    );
}
