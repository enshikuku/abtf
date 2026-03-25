"use client";

import { useEffect, useState } from "react";
import { Loader2Icon, LayoutGridIcon, SearchIcon } from "lucide-react";
import { getBoothSectionDisplay, getExhibitorSectionLabel, SPONSOR_SECTION_LABELS } from "@/lib/exhibition-categories";
import { getBoothStatusTheme } from "@/lib/booth-status";
import { ExportActions } from "@/components/admin/ExportActions";

interface Booth {
	id: string;
	name: string;
	section: string;
	audience: "EXHIBITOR" | "SPONSOR";
	sponsorLevel: "PLATINUM" | "GOLD" | "SILVER" | "BRONZE" | null;
	price: string;
	status: string;
	reservedUntil: string | null;
	user: { id: string; name: string; companyName: string; email: string } | null;
}

const statusOptions = ["ALL", "AVAILABLE", "RESERVED", "PAYMENT_SUBMITTED", "CONFIRMED"];

export default function AdminBoothsPage() {
	const [booths, setBooths] = useState<Booth[]>([]);
	const [loading, setLoading] = useState(true);
	const [acting, setActing] = useState<string | null>(null);
	const [filterSection, setFilterSection] = useState("ALL");
	const [filterAudience, setFilterAudience] = useState("ALL");
	const [filterStatus, setFilterStatus] = useState("ALL");
	const [search, setSearch] = useState("");

	const fetchBooths = () => {
		fetch("/api/admin/booths")
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data)) setBooths(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	};

	useEffect(() => {
		fetchBooths();
	}, []);

	const handleAction = async (boothId: string, action: string) => {
		setActing(boothId);
		try {
			const res = await fetch("/api/admin/booths", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ boothId, action }),
			});
			if (res.ok) fetchBooths();
		} finally {
			setActing(null);
		}
	};

	const sections = ["ALL", ...new Set(booths.map((b) => b.section))];

	const filtered = booths.filter((b) => {
		if (filterAudience !== "ALL" && b.audience !== filterAudience) return false;
		if (filterSection !== "ALL" && b.section !== filterSection) return false;
		if (filterStatus !== "ALL" && b.status !== filterStatus) return false;
		if (search) {
			const q = search.toLowerCase();
			return (
				b.name.toLowerCase().includes(q) ||
				b.section.toLowerCase().includes(q) ||
				(b.user?.companyName?.toLowerCase().includes(q) ?? false)
			);
		}
		return true;
	});

	const statusBadge = (status: string) => {
		return getBoothStatusTheme(status).badgeClass;
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
						<LayoutGridIcon className="h-6 w-6 text-maroon" /> Booth Management
					</h1>
					<p className="text-gray-500 mt-1">{booths.length} total booths</p>
				</div>
				<ExportActions
					title="ABTF Booth Report"
					filenameBase="abtf-booths"
					rows={filtered}
					metadata={{
						"Rows Included": filtered.length,
						"Audience Filter": filterAudience,
						"Section Filter": filterSection,
						"Status Filter": filterStatus,
					}}
					columns={[
						{ header: "Booth", value: (row) => row.name },
						{ header: "Audience", value: (row) => row.audience },
						{ header: "Section", value: (row) => getBoothSectionDisplay(row.section, row.audience) },
						{ header: "Sponsor Level", value: (row) => row.sponsorLevel || "-" },
						{ header: "Price", value: (row) => Number(row.price).toLocaleString() },
						{ header: "Status", value: (row) => getBoothStatusTheme(row.status).label },
						{ header: "Reserved By", value: (row) => row.user?.companyName || "-" },
						{ header: "Reserved Until", value: (row) => (row.reservedUntil ? new Date(row.reservedUntil).toLocaleString() : "-") },
					]}
				/>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search booth name or company..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-maroon focus:border-transparent outline-none"
					/>
				</div>
				<select
					value={filterAudience}
					onChange={(e) => setFilterAudience(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-maroon focus:border-transparent outline-none"
				>
					<option value="ALL">All Booth Types</option>
					<option value="EXHIBITOR">Exhibitor Booths</option>
					<option value="SPONSOR">Sponsor Booths</option>
				</select>
				<select
					value={filterSection}
					onChange={(e) => setFilterSection(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-maroon focus:border-transparent outline-none"
				>
					{sections.map((s) => (
						<option key={s} value={s}>
							{s === "ALL" ? "All Sections" : SPONSOR_SECTION_LABELS[s] || getExhibitorSectionLabel(s)}
						</option>
					))}
				</select>
				<select
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-maroon focus:border-transparent outline-none"
				>
					{statusOptions.map((s) => (
						<option key={s} value={s}>
							{s === "ALL" ? "All Statuses" : s.replace(/_/g, " ")}
						</option>
					))}
				</select>
			</div>

			{/* Results count */}
			<p className="text-sm text-gray-500 mb-3">{filtered.length} booths shown</p>

			{/* Booths Table */}
			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 border-b">
							<tr>
								<th className="text-left px-4 py-3 font-medium text-gray-600">Booth</th>
								<th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
								<th className="text-left px-4 py-3 font-medium text-gray-600">Section</th>
								<th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
								<th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
								<th className="text-left px-4 py-3 font-medium text-gray-600">Reserved By</th>
								<th className="text-left px-4 py-3 font-medium text-gray-600">Expires</th>
								<th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filtered.map((b) => (
								<tr key={b.id} className="hover:bg-gray-50">
									<td className="px-4 py-3 font-bold text-deepBlue">{b.name}</td>
									<td className="px-4 py-3 text-xs">
										<span className={`px-2 py-1 rounded-full font-bold ${b.audience === "SPONSOR" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
											{b.audience}
										</span>
									</td>
									<td className="px-4 py-3">
										{getBoothSectionDisplay(b.section, b.audience)}
										{b.audience === "SPONSOR" && b.sponsorLevel ? ` (${b.sponsorLevel})` : ""}
									</td>
									<td className="px-4 py-3">KES {Number(b.price).toLocaleString()}</td>
									<td className="px-4 py-3">
										<span className={`px-2 py-1 rounded-full text-xs font-bold ${statusBadge(b.status)}`}>
											{getBoothStatusTheme(b.status).label}
										</span>
									</td>
									<td className="px-4 py-3 text-gray-600">
										{b.user ? b.user.companyName : "—"}
									</td>
									<td className="px-4 py-3 text-gray-500 text-xs">
										{b.reservedUntil ? new Date(b.reservedUntil).toLocaleDateString() : "—"}
									</td>
									<td className="px-4 py-3 text-right">
										<div className="flex items-center justify-end gap-2">
											{(b.status === "RESERVED" || b.status === "PAYMENT_SUBMITTED") && (
												<button
													onClick={() => handleAction(b.id, "confirm")}
													disabled={acting === b.id}
													className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
												>
													{acting === b.id ? "..." : "Confirm"}
												</button>
											)}
											{b.status !== "AVAILABLE" && (
												<button
													onClick={() => handleAction(b.id, "release")}
													disabled={acting === b.id}
													className="text-xs bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 px-3 py-1.5 rounded-md font-medium transition-colors disabled:opacity-50"
												>
													{acting === b.id ? "..." : "Release"}
												</button>
											)}
										</div>
									</td>
								</tr>
							))}
							{filtered.length === 0 && (
								<tr>
									<td colSpan={8} className="px-4 py-8 text-center text-gray-500">
										No booths match your filters.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
