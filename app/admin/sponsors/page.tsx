"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, Loader2Icon, StarIcon } from "lucide-react";

interface Sponsor {
    id: string;
    name: string;
    email: string;
    companyName: string;
    phone: string;
    category: string | null;
    logoUrl: string | null;
    createdAt: string;
}

export default function AdminSponsorsPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/sponsors")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setSponsors(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link href="/admin" className="text-gray-400 hover:text-maroon transition-colors">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-deepBlue font-poppins flex items-center gap-2">
                        <StarIcon className="h-6 w-6 text-maroon" /> Sponsors ({sponsors.length})
                    </h1>
                </div>

                {sponsors.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                        No sponsors registered yet.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-600">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sponsors.map((s) => (
                                    <tr key={s.id}>
                                        <td className="px-4 py-3 font-medium text-deepBlue">{s.name}</td>
                                        <td className="px-4 py-3">{s.companyName}</td>
                                        <td className="px-4 py-3 text-gray-600">{s.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                                        <td className="px-4 py-3 text-gray-600">{s.category || "—"}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(s.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
