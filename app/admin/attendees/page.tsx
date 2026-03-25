"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2Icon, SearchIcon, UsersIcon } from "lucide-react";
import { ExportActions } from "@/components/admin/ExportActions";

interface Attendee {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    organization: string | null;
    county: string | null;
    attendeeType: string;
    interests: string | null;
    notes: string | null;
    status: string;
    createdAt: string;
}

const statusOptions = ["ALL", "REGISTERED", "CONTACTED", "CONFIRMED", "ARCHIVED"];

export default function AdminAttendeesPage() {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/admin/attendees");
                const data = await response.json();
                if (!cancelled && Array.isArray(data)) setAttendees(data);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        return attendees.filter((a) => {
            if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                a.fullName.toLowerCase().includes(q) ||
                a.email.toLowerCase().includes(q) ||
                a.phone.toLowerCase().includes(q) ||
                (a.organization || "").toLowerCase().includes(q)
            );
        });
    }, [attendees, search, statusFilter]);

    const updateStatus = async (attendeeId: string, status: string) => {
        setUpdatingId(attendeeId);
        const res = await fetch("/api/admin/attendees", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attendeeId, status }),
        });

        if (res.ok) {
            setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? { ...a, status } : a)));
        }
        setUpdatingId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-deepBlue font-poppins flex items-center gap-2">
                        <UsersIcon className="h-6 w-6 text-maroon" /> Attendee Registrations
                    </h1>
                    <p className="text-gray-500 mt-1">{attendees.length} total registrations</p>
                </div>
                <ExportActions
                    title="ABTF Attendee Report"
                    filenameBase="abtf-attendees"
                    rows={filtered}
                    metadata={{
                        "Rows Included": filtered.length,
                        "Status Filter": statusFilter,
                    }}
                    columns={[
                        { header: "Full Name", value: (row) => row.fullName },
                        { header: "Email", value: (row) => row.email },
                        { header: "Phone", value: (row) => row.phone },
                        { header: "Attendee Type", value: (row) => row.attendeeType },
                        { header: "Organization", value: (row) => row.organization || "-" },
                        { header: "County", value: (row) => row.county || "-" },
                        { header: "Status", value: (row) => row.status },
                        { header: "Created At", value: (row) => new Date(row.createdAt).toLocaleString() },
                    ]}
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, phone, organization..."
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
                            {status === "ALL" ? "All Statuses" : status.replace(/_/g, " ")}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Contact</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Organization</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Submitted</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">No attendee records found</td>
                                </tr>
                            ) : (
                                filtered.map((a) => (
                                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-deepBlue">{a.fullName}</p>
                                            {a.county && <p className="text-xs text-gray-500">{a.county}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            <p>{a.email}</p>
                                            <p className="text-xs text-gray-500">{a.phone}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{a.attendeeType.replace(/_/g, " ")}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {a.organization || "-"}
                                            {a.interests && <p className="text-xs text-gray-500 mt-1">Interests: {a.interests}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(a.createdAt).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={a.status}
                                                onChange={(e) => updateStatus(a.id, e.target.value)}
                                                disabled={updatingId === a.id}
                                                className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-maroon/20 focus:border-maroon outline-none"
                                            >
                                                {statusOptions
                                                    .filter((status) => status !== "ALL")
                                                    .map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.replace(/_/g, " ")}
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>
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
