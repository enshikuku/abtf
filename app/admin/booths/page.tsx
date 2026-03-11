"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, Loader2Icon, LayoutGridIcon } from "lucide-react";

interface Booth {
    id: string;
    name: string;
    section: string;
    price: string;
    status: string;
    reservedUntil: string | null;
    user: { id: string; name: string; companyName: string; email: string } | null;
}

export default function AdminBoothsPage() {
    const [booths, setBooths] = useState<Booth[]>([]);
    const [loading, setLoading] = useState(true);
    const [releasing, setReleasing] = useState<string | null>(null);

    const fetchBooths = () => {
        fetch("/api/admin/booths")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setBooths(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchBooths(); }, []);

    const handleRelease = async (boothId: string) => {
        setReleasing(boothId);
        try {
            const res = await fetch("/api/admin/booths", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ boothId, action: "release" }),
            });
            if (res.ok) fetchBooths();
        } finally {
            setReleasing(null);
        }
    };

    const sections = [...new Set(booths.map((b) => b.section))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
            </div>
        );
    }

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            AVAILABLE: "bg-green-100 text-green-800",
            RESERVED: "bg-orange-100 text-orange-800",
            CONFIRMED: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/admin" className="text-gray-400 hover:text-maroon transition-colors">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-deepBlue font-poppins flex items-center gap-2">
                        <LayoutGridIcon className="h-6 w-6 text-maroon" /> Booth Management
                    </h1>
                </div>

                {sections.map((section) => {
                    const sectionBooths = booths.filter((b) => b.section === section);
                    return (
                        <div key={section} className="mb-8">
                            <h2 className="text-lg font-bold text-deepBlue mb-3">{section} ({sectionBooths.length})</h2>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Booth</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Reserved By</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Expires</th>
                                            <th className="text-right px-4 py-3 font-medium text-gray-600">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {sectionBooths.map((b) => (
                                            <tr key={b.id}>
                                                <td className="px-4 py-3 font-bold text-deepBlue">{b.name}</td>
                                                <td className="px-4 py-3">KES {Number(b.price).toLocaleString()}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusBadge(b.status)}`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {b.user ? `${b.user.companyName}` : "—"}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500 text-xs">
                                                    {b.reservedUntil ? new Date(b.reservedUntil).toLocaleDateString() : "—"}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {b.status !== "AVAILABLE" && (
                                                        <button
                                                            onClick={() => handleRelease(b.id)}
                                                            disabled={releasing === b.id}
                                                            className="text-xs bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            {releasing === b.id ? "..." : "Release"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
