"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2Icon, Loader2Icon, SearchIcon } from "lucide-react";
import { ExportActions } from "@/components/admin/ExportActions";

interface Reservation {
    id: string;
    status: string;
    createdAt: string;
    user: { id: string; companyName: string; email: string; role: string };
    booth: { id: string; name: string; section: string; audience: string; status: string };
    invoice: { id: string; invoiceNumber: string; status: string; totalAmount: string } | null;
}

const statusOptions = ["ALL", "PENDING", "CONFIRMED", "EXPIRED"];

export default function AdminReservationsPage() {
    const [rows, setRows] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        fetch("/api/admin/reservations")
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) setRows(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return rows.filter((row) => {
            if (statusFilter !== "ALL" && row.status !== statusFilter) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                row.user.companyName.toLowerCase().includes(q) ||
                row.user.email.toLowerCase().includes(q) ||
                row.booth.name.toLowerCase().includes(q) ||
                (row.invoice?.invoiceNumber.toLowerCase().includes(q) ?? false)
            );
        });
    }, [rows, search, statusFilter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-deepBlue font-poppins flex items-center gap-2">
                        <CalendarCheck2Icon className="h-6 w-6 text-maroon" /> Reservations
                    </h1>
                    <p className="text-gray-500 mt-1">{rows.length} total reservations</p>
                </div>
                <ExportActions
                    title="ABTF Reservation Report"
                    filenameBase="abtf-reservations"
                    rows={filtered}
                    metadata={{ "Rows Included": filtered.length }}
                    columns={[
                        { header: "Reservation ID", value: (row) => row.id },
                        { header: "Status", value: (row) => row.status },
                        { header: "Company", value: (row) => row.user.companyName },
                        { header: "Email", value: (row) => row.user.email },
                        { header: "Role", value: (row) => row.user.role },
                        { header: "Booth", value: (row) => row.booth.name },
                        { header: "Section", value: (row) => row.booth.section },
                        { header: "Audience", value: (row) => row.booth.audience },
                        { header: "Invoice", value: (row) => row.invoice?.invoiceNumber || "-" },
                        { header: "Invoice Status", value: (row) => row.invoice?.status || "-" },
                        { header: "Invoice Amount", value: (row) => row.invoice?.totalAmount || "-" },
                        { header: "Created At", value: (row) => new Date(row.createdAt).toLocaleString() },
                    ]}
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by company, email, booth, or invoice..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none"
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status === "ALL" ? "All Statuses" : status}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Reservation</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Company</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Booth</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Invoice</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-gray-400">No reservations found</td>
                                </tr>
                            ) : (
                                filtered.map((row) => (
                                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-700">{row.id.slice(0, 12)}...</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-deepBlue">{row.user.companyName}</p>
                                            <p className="text-xs text-gray-500">{row.user.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">{row.booth.name}</p>
                                            <p className="text-xs text-gray-500">{row.booth.section} • {row.booth.audience}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {row.invoice ? `${row.invoice.invoiceNumber} (${row.invoice.status})` : "-"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{row.status}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(row.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
