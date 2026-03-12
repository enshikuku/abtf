"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/auth/me")
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (!data?.user || data.user.role !== "ADMIN") {
					router.replace("/dashboard");
					return;
				}
				setLoading(false);
			})
			.catch(() => {
				router.replace("/dashboard");
			});
	}, [router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 pt-20">
			<main className="p-4 sm:p-6 lg:p-8">{children}</main>
		</div>
	);
}
