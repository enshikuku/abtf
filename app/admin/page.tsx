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
	CheckCircleIcon,
	ClockIcon,
	AlertCircleIcon,
	ShieldIcon,
} from "lucide-react";

interface Stats {
	totalExhibitors: number;
	totalSponsors: number;
	totalBooths: number;
	reservedBooths: number;
	paymentSubmittedBooths: number;
	confirmedBooths: number;
	availableBooths: number;
	paidInvoices: number;
	pendingPayments: number;
	totalUsers: number;
	verifiedPayments: number;
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
			<div className="flex items-center justify-center py-32">
				<Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
			</div>
		);
	}

	const statCards = stats
		? [
				{ label: "Total Exhibitors", value: stats.totalExhibitors, icon: UsersIcon, color: "text-blue-600 bg-blue-50", href: "/admin/exhibitors" },
				{ label: "Total Sponsors", value: stats.totalSponsors, icon: StarIcon, color: "text-purple-600 bg-purple-50", href: "/admin/sponsors" },
				{ label: "Total Booths", value: stats.totalBooths, icon: LayoutGridIcon, color: "text-gray-600 bg-gray-100", href: "/admin/booths" },
				{ label: "Available Booths", value: stats.availableBooths, icon: CheckCircleIcon, color: "text-green-600 bg-green-50", href: "/admin/booths" },
				{ label: "Reserved Booths", value: stats.reservedBooths, icon: ClockIcon, color: "text-orange-600 bg-orange-50", href: "/admin/booths" },
				{ label: "Confirmed Booths", value: stats.confirmedBooths, icon: CheckCircleIcon, color: "text-emerald-600 bg-emerald-50", href: "/admin/booths" },
				{ label: "Pending Payments", value: stats.pendingPayments, icon: AlertCircleIcon, color: "text-yellow-600 bg-yellow-50", href: "/admin/payments" },
				{ label: "Verified Payments", value: stats.verifiedPayments, icon: CreditCardIcon, color: "text-green-600 bg-green-50", href: "/admin/payments" },
				{ label: "Total Users", value: stats.totalUsers, icon: ShieldIcon, color: "text-indigo-600 bg-indigo-50", href: "/admin/users" },
		  ]
		: [];

	const quickLinks = [
		{ name: "Payments", href: "/admin/payments", icon: CreditCardIcon, desc: "Verify payment proofs and manage transactions" },
		{ name: "Booths", href: "/admin/booths", icon: LayoutGridIcon, desc: "Manage booth assignments and reservations" },
		{ name: "Exhibitors", href: "/admin/exhibitors", icon: UsersIcon, desc: "View and manage registered exhibitors" },
		{ name: "Sponsors", href: "/admin/sponsors", icon: StarIcon, desc: "View and manage registered sponsors" },
		{ name: "Invoices", href: "/admin/invoices", icon: FileTextIcon, desc: "View all invoices and payment statuses" },
		{ name: "Users", href: "/admin/users", icon: ShieldIcon, desc: "Manage user accounts and roles" },
	];

	return (
		<div className="max-w-7xl mx-auto">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-deepBlue font-poppins flex items-center gap-3">
					<BarChart3Icon className="h-7 w-7 text-maroon" />
					Dashboard Overview
				</h1>
				<p className="text-gray-500 mt-1">Agri-Business Trade Fair Management</p>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
				{statCards.map((card) => (
					<Link
						key={card.label}
						href={card.href}
						className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-maroon/30 transition-all group"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className={`p-2 rounded-lg ${card.color}`}>
								<card.icon className="h-5 w-5" />
							</div>
							<span className="text-sm text-gray-500 font-medium">{card.label}</span>
						</div>
						<p className="text-3xl font-bold text-deepBlue font-poppins group-hover:text-maroon transition-colors">
							{card.value}
						</p>
					</Link>
				))}
			</div>

			{/* Quick Links */}
			<h2 className="text-lg font-bold text-deepBlue font-poppins mb-4">Quick Access</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{quickLinks.map((link) => (
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
	);
}
