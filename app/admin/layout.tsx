"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
	BarChart3Icon,
	LayoutGridIcon,
	UsersIcon,
	StarIcon,
	CreditCardIcon,
	FileTextIcon,
	ShieldIcon,
	LogOutIcon,
	Loader2Icon,
	MenuIcon,
	XIcon,
} from "lucide-react";

interface AuthUser {
	id: string;
	email: string;
	companyName: string;
	role: string;
}

const navItems = [
	{ name: "Dashboard", href: "/admin", icon: BarChart3Icon },
	{ name: "Booths", href: "/admin/booths", icon: LayoutGridIcon },
	{ name: "Exhibitors", href: "/admin/exhibitors", icon: UsersIcon },
	{ name: "Sponsors", href: "/admin/sponsors", icon: StarIcon },
	{ name: "Payments", href: "/admin/payments", icon: CreditCardIcon },
	{ name: "Invoices", href: "/admin/invoices", icon: FileTextIcon },
	{ name: "Users", href: "/admin/users", icon: ShieldIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		fetch("/api/auth/me")
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (!data?.user || data.user.role !== "ADMIN") {
					router.replace("/dashboard");
					return;
				}
				setUser(data.user);
				setLoading(false);
			})
			.catch(() => {
				router.replace("/dashboard");
			});
	}, [router]);

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		window.location.href = "/";
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
			</div>
		);
	}

	const isActive = (href: string) => {
		if (href === "/admin") return pathname === "/admin";
		return pathname.startsWith(href);
	};

	return (
		<div className="min-h-screen bg-gray-50 pt-20">
			{/* Mobile sidebar toggle */}
			<div className="lg:hidden fixed top-20 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="flex items-center gap-2 text-deepBlue hover:text-maroon text-sm font-medium"
				>
					{sidebarOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
					Admin Menu
				</button>
				<span className="text-xs text-gray-400">{user?.email}</span>
			</div>

			<div className="flex">
				{/* Sidebar */}
				<aside
					className={`fixed lg:sticky top-20 left-0 z-20 h-[calc(100vh-5rem)] w-64 bg-deepBlue text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
						sidebarOpen ? "translate-x-0" : "-translate-x-full"
					}`}
				>
					<div className="p-6 border-b border-white/10">
						<h2 className="text-lg font-bold font-poppins text-gold">Admin Panel</h2>
						<p className="text-xs text-gray-400 mt-1">ABTF Management</p>
					</div>

					<nav className="flex-1 py-4 overflow-y-auto">
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
									isActive(item.href)
										? "bg-maroon text-white border-r-4 border-gold"
										: "text-gray-300 hover:bg-white/5 hover:text-white"
								}`}
							>
								<item.icon className="h-5 w-5" />
								{item.name}
							</Link>
						))}
					</nav>

					<div className="p-4 border-t border-white/10">
						<div className="text-xs text-gray-400 mb-3 truncate">{user?.email}</div>
						<button
							onClick={handleLogout}
							className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition-colors w-full"
						>
							<LogOutIcon className="h-4 w-4" />
							Logout
						</button>
					</div>
				</aside>

				{/* Overlay for mobile */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 bg-black/50 z-10 lg:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}

				{/* Main content */}
				<main className="flex-1 min-h-[calc(100vh-5rem)] lg:ml-0">
					<div className="p-6 lg:p-8 mt-12 lg:mt-0">{children}</div>
				</main>
			</div>
		</div>
	);
}
