"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BarChart3Icon,
    UsersIcon,
    LayoutGridIcon,
    FileTextIcon,
    CreditCardIcon,
    Loader2Icon,
    StarIcon,
} from "lucide-react";

interface Stats {
    totalExhibitors: number;
    totalSponsors: number;
    totalBooths: number;
    reservedBooths: number;
    confirmedBooths: number;
    availableBooths: number;
    paidInvoices: number;
    pendingPayments: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then((r) => r.json())
            .then((data) => {
                setStats(data);
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

    const cards = stats
        ? [
            { label: "Exhibitors", value: stats.totalExhibitors, icon: UsersIcon, color: "text-blue-600 bg-blue-50" },
            { label: "Sponsors", value: stats.totalSponsors, icon: StarIcon, color: "text-purple-600 bg-purple-50" },
            { label: "Total Booths", value: stats.totalBooths, icon: LayoutGridIcon, color: "text-gray-600 bg-gray-50" },
            { label: "Available", value: stats.availableBooths, icon: LayoutGridIcon, color: "text-green-600 bg-green-50" },
            { label: "Reserved", value: stats.reservedBooths, icon: LayoutGridIcon, color: "text-orange-600 bg-orange-50" },
            { label: "Confirmed", value: stats.confirmedBooths, icon: LayoutGridIcon, color: "text-red-600 bg-red-50" },
            { label: "Paid Invoices", value: stats.paidInvoices, icon: FileTextIcon, color: "text-green-600 bg-green-50" },
            { label: "Pending Payments", value: stats.pendingPayments, icon: CreditCardIcon, color: "text-yellow-600 bg-yellow-50" },
        ]
        : [];

    const navLinks = [
        { name: "Payments", href: "/admin/payments", icon: CreditCardIcon, desc: "Verify payment proofs" },
        { name: "Booths", href: "/admin/booths", icon: LayoutGridIcon, desc: "Manage booth assignments" },
        { name: "Exhibitors", href: "/admin/exhibitors", icon: UsersIcon, desc: "View registered exhibitors" },
        { name: "Sponsors", href: "/admin/sponsors", icon: StarIcon, desc: "View registered sponsors" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-deepBlue font-poppins flex items-center gap-3">
                        <BarChart3Icon className="h-8 w-8 text-maroon" />
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Agri-Business Trade Fair Management</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {cards.map((card) => (
                        <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${card.color}`}>
                                    <card.icon className="h-5 w-5" />
                                </div>
                                <span className="text-sm text-gray-500 font-medium">{card.label}</span>
                            </div>
                            <p className="text-3xl font-bold text-deepBlue font-poppins">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <h2 className="text-xl font-bold text-deepBlue font-poppins mb-4">Management</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-maroon transition-all group"
                        >
                            <link.icon className="h-8 w-8 text-maroon mb-3 group-hover:text-gold transition-colors" />
                            <h3 className="font-bold text-deepBlue text-lg">{link.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
