"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, Loader2Icon, UsersIcon } from "lucide-react";

interface Exhibitor {
    id: string;
    name: string;
    email: string;
    companyName: string;
    phone: string;
    category: string | null;
    createdAt: string;
}

export default function AdminExhibitorsPage() {
    const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/exhibitors")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setExhibitors(data);
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
                        <UsersIcon className="h-6 w-6 text-maroon" /> Exhibitors ({exhibitors.length})
                    </h1>
                </div>

                {exhibitors.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                        No exhibitors registered yet.
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
                                {exhibitors.map((e) => (
                                    <tr key={e.id}>
                                        <td className="px-4 py-3 font-medium text-deepBlue">{e.name}</td>
                                        <td className="px-4 py-3">{e.companyName}</td>
                                        <td className="px-4 py-3 text-gray-600">{e.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{e.phone}</td>
                                        <td className="px-4 py-3 text-gray-600">{e.category || "—"}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(e.createdAt).toLocaleDateString()}
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
