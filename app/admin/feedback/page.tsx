"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2Icon, SearchIcon, MessageSquareTextIcon } from "lucide-react";
import { ExportActions } from "@/components/admin/ExportActions";

interface FeedbackItem {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    category: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

const statusOptions = ["ALL", "NEW", "IN_REVIEW", "RESOLVED", "ARCHIVED"];

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/admin/feedback");
                const data = await response.json();
                if (!cancelled && Array.isArray(data)) setFeedback(data);
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
        return feedback.filter((item) => {
            if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                item.fullName.toLowerCase().includes(q) ||
                (item.email || "").toLowerCase().includes(q) ||
                item.subject.toLowerCase().includes(q) ||
                item.message.toLowerCase().includes(q)
            );
        });
    }, [feedback, search, statusFilter]);

    const updateStatus = async (feedbackId: string, status: string) => {
        setUpdatingId(feedbackId);
        const res = await fetch("/api/admin/feedback", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feedbackId, status }),
        });

        if (res.ok) {
            setFeedback((prev) => prev.map((item) => (item.id === feedbackId ? { ...item, status } : item)));
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
                        <MessageSquareTextIcon className="h-6 w-6 text-maroon" /> Public Feedback
                    </h1>
                    <p className="text-gray-500 mt-1">{feedback.length} total feedback submissions</p>
                </div>
                <ExportActions
                    title="ABTF Feedback Report"
                    filenameBase="abtf-feedback"
                    rows={filtered}
                    metadata={{
                        "Rows Included": filtered.length,
                        "Status Filter": statusFilter,
                    }}
                    columns={[
                        { header: "Full Name", value: (row) => row.fullName },
                        { header: "Email", value: (row) => row.email || "-" },
                        { header: "Phone", value: (row) => row.phone || "-" },
                        { header: "Category", value: (row) => row.category },
                        { header: "Subject", value: (row) => row.subject },
                        { header: "Message", value: (row) => row.message },
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
                        placeholder="Search by name, email, subject, message..."
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

            <div className="space-y-4">
                {filtered.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl py-12 text-center text-gray-400">No feedback records found</div>
                ) : (
                    filtered.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="font-semibold text-deepBlue">{item.subject}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.category.replace(/_/g, " ")} • {item.fullName}
                                        {item.email ? ` • ${item.email}` : ""}
                                        {item.phone ? ` • ${item.phone}` : ""}
                                    </p>
                                    <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{item.message}</p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                                    <select
                                        value={item.status}
                                        onChange={(e) => updateStatus(item.id, e.target.value)}
                                        disabled={updatingId === item.id}
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
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
