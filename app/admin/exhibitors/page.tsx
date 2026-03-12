"use client";

import { useEffect, useState } from "react";
import { Loader2Icon, UsersIcon, SearchIcon, XCircleIcon } from "lucide-react";

interface Booth {
	id: string;
	name: string;
	section: string;
	status: string;
}

interface Invoice {
	id: string;
	invoiceNumber: string;
	totalAmount: string;
	status: string;
}

interface Exhibitor {
	id: string;
	name: string;
	email: string;
	companyName: string;
	phone: string;
	category: string | null;
	description: string | null;
	createdAt: string;
	booths: Booth[];
	invoices: Invoice[];
}

export default function AdminExhibitorsPage() {
	const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null);

	useEffect(() => {
		fetch("/api/admin/exhibitors")
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data)) setExhibitors(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	const filtered = exhibitors.filter((e) => {
		if (!search) return true;
		const q = search.toLowerCase();
		return (
			e.name.toLowerCase().includes(q) ||
			e.companyName.toLowerCase().includes(q) ||
			e.email.toLowerCase().includes(q)
		);
	});

	const invoiceStatusBadge = (status: string) => {
		const colors: Record<string, string> = {
			UNPAID: "bg-red-100 text-red-800",
			PENDING_VERIFICATION: "bg-yellow-100 text-yellow-800",
			PAID: "bg-green-100 text-green-800",
			REJECTED: "bg-gray-100 text-gray-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
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
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-deepBlue font-poppins flex items-center gap-2">
					<UsersIcon className="h-6 w-6 text-maroon" /> Exhibitors ({exhibitors.length})
				</h1>
			</div>

			{/* Search */}
			<div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
				<div className="relative">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search by name, company, or email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-maroon focus:border-transparent outline-none"
					/>
				</div>
			</div>

			{filtered.length === 0 ? (
				<div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
					{search ? "No exhibitors match your search." : "No exhibitors registered yet."}
				</div>
			) : (
				<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 border-b">
								<tr>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Contact Person</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Booths</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Invoice Status</th>
									<th className="text-right px-4 py-3 font-medium text-gray-600">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{filtered.map((e) => {
									const latestInvoice = e.invoices[0];
									return (
										<tr key={e.id} className="hover:bg-gray-50">
											<td className="px-4 py-3 font-bold text-deepBlue">{e.companyName}</td>
											<td className="px-4 py-3">{e.name}</td>
											<td className="px-4 py-3 text-gray-600">{e.email}</td>
											<td className="px-4 py-3 text-gray-600">{e.phone}</td>
											<td className="px-4 py-3">
												{e.booths.length > 0 ? (
													<span className="text-xs font-medium">
														{e.booths.map((b) => b.name).join(", ")}
													</span>
												) : (
													<span className="text-gray-400">None</span>
												)}
											</td>
											<td className="px-4 py-3">
												{latestInvoice ? (
													<span className={`px-2 py-1 rounded-full text-xs font-bold ${invoiceStatusBadge(latestInvoice.status)}`}>
														{latestInvoice.status.replace(/_/g, " ")}
													</span>
												) : (
													<span className="text-gray-400 text-xs">No invoice</span>
												)}
											</td>
											<td className="px-4 py-3 text-right">
												<button
													onClick={() => setSelectedExhibitor(e)}
													className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors"
												>
													View
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Detail Modal */}
			{selectedExhibitor && (
				<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedExhibitor(null)}>
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
						<div className="flex justify-between items-center p-6 border-b">
							<h2 className="text-lg font-bold text-deepBlue font-poppins">{selectedExhibitor.companyName}</h2>
							<button onClick={() => setSelectedExhibitor(null)} className="text-gray-400 hover:text-gray-600">
								<XCircleIcon className="h-5 w-5" />
							</button>
						</div>
						<div className="p-6 space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Contact Person</label>
									<p className="text-deepBlue font-medium mt-1">{selectedExhibitor.name}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Email</label>
									<p className="text-deepBlue font-medium mt-1">{selectedExhibitor.email}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
									<p className="text-deepBlue font-medium mt-1">{selectedExhibitor.phone}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Category</label>
									<p className="text-deepBlue font-medium mt-1 capitalize">{selectedExhibitor.category || "—"}</p>
								</div>
								<div className="col-span-2">
									<label className="text-xs font-bold text-gray-400 uppercase">Registered</label>
									<p className="text-deepBlue font-medium mt-1">
										{new Date(selectedExhibitor.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
									</p>
								</div>
								{selectedExhibitor.description && (
									<div className="col-span-2">
										<label className="text-xs font-bold text-gray-400 uppercase">Description</label>
										<p className="text-gray-700 mt-1 text-sm">{selectedExhibitor.description}</p>
									</div>
								)}
							</div>

							{/* Booths */}
							<div>
								<h3 className="font-bold text-deepBlue text-sm mb-2">Reserved Booths ({selectedExhibitor.booths.length})</h3>
								{selectedExhibitor.booths.length > 0 ? (
									<div className="space-y-2">
										{selectedExhibitor.booths.map((b) => (
											<div key={b.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
												<span className="font-medium text-deepBlue">{b.name}</span>
												<div className="flex items-center gap-2">
													<span className="text-xs text-gray-500 capitalize">{b.section}</span>
													<span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
														b.status === "CONFIRMED" ? "bg-green-100 text-green-800" :
														b.status === "RESERVED" ? "bg-orange-100 text-orange-800" :
														"bg-blue-100 text-blue-800"
													}`}>{b.status.replace(/_/g, " ")}</span>
												</div>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-400 text-sm">No booths reserved.</p>
								)}
							</div>

							{/* Invoices */}
							<div>
								<h3 className="font-bold text-deepBlue text-sm mb-2">Invoices ({selectedExhibitor.invoices.length})</h3>
								{selectedExhibitor.invoices.length > 0 ? (
									<div className="space-y-2">
										{selectedExhibitor.invoices.map((inv) => (
											<div key={inv.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
												<div>
													<span className="font-medium text-deepBlue">{inv.invoiceNumber}</span>
													<span className="text-gray-500 ml-2 text-sm">KES {Number(inv.totalAmount).toLocaleString()}</span>
												</div>
												<span className={`px-2 py-0.5 rounded-full text-xs font-bold ${invoiceStatusBadge(inv.status)}`}>
													{inv.status.replace(/_/g, " ")}
												</span>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-400 text-sm">No invoices.</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
