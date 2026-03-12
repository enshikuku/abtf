"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2Icon, StarIcon, SearchIcon, XCircleIcon } from "lucide-react";

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

interface Sponsor {
	id: string;
	name: string;
	email: string;
	companyName: string;
	phone: string;
	website: string | null;
	logoUrl: string | null;
	description: string | null;
	createdAt: string;
	booths: Booth[];
	invoices: Invoice[];
}

export default function AdminSponsorsPage() {
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

	useEffect(() => {
		fetch("/api/admin/sponsors")
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data)) setSponsors(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	const filtered = sponsors.filter((s) => {
		if (!search) return true;
		const q = search.toLowerCase();
		return (
			s.name.toLowerCase().includes(q) ||
			s.companyName.toLowerCase().includes(q) ||
			s.email.toLowerCase().includes(q)
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
					<StarIcon className="h-6 w-6 text-maroon" /> Sponsors ({sponsors.length})
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
					{search ? "No sponsors match your search." : "No sponsors registered yet."}
				</div>
			) : (
				<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 border-b">
								<tr>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Logo</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Contact Person</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Booths</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Invoice Status</th>
									<th className="text-right px-4 py-3 font-medium text-gray-600">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{filtered.map((s) => {
									const latestInvoice = s.invoices[0];
									return (
										<tr key={s.id} className="hover:bg-gray-50">
											<td className="px-4 py-3">
												{s.logoUrl ? (
													<Image
														src={s.logoUrl}
														alt={s.companyName}
														width={40}
														height={40}
														className="w-10 h-10 object-contain rounded border border-gray-200"
													/>
												) : (
													<div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
														N/A
													</div>
												)}
											</td>
											<td className="px-4 py-3 font-bold text-deepBlue">{s.companyName}</td>
											<td className="px-4 py-3">{s.name}</td>
											<td className="px-4 py-3 text-gray-600">{s.email}</td>
											<td className="px-4 py-3">
												{s.booths.length > 0 ? (
													<span className="text-xs font-medium">
														{s.booths.map((b) => b.name).join(", ")}
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
													onClick={() => setSelectedSponsor(s)}
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
			{selectedSponsor && (
				<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedSponsor(null)}>
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
						<div className="flex justify-between items-center p-6 border-b">
							<h2 className="text-lg font-bold text-deepBlue font-poppins">{selectedSponsor.companyName}</h2>
							<button onClick={() => setSelectedSponsor(null)} className="text-gray-400 hover:text-gray-600">
								<XCircleIcon className="h-5 w-5" />
							</button>
						</div>
						<div className="p-6 space-y-6">
							{/* Logo */}
							{selectedSponsor.logoUrl && (
								<div className="flex justify-center">
									<Image
										src={selectedSponsor.logoUrl}
										alt={selectedSponsor.companyName}
										width={160}
										height={160}
										className="w-40 h-40 object-contain rounded-xl border border-gray-200"
									/>
								</div>
							)}

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Contact Person</label>
									<p className="text-deepBlue font-medium mt-1">{selectedSponsor.name}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Email</label>
									<p className="text-deepBlue font-medium mt-1">{selectedSponsor.email}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
									<p className="text-deepBlue font-medium mt-1">{selectedSponsor.phone}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Website</label>
									<p className="text-deepBlue font-medium mt-1">{selectedSponsor.website || "—"}</p>
								</div>
								<div className="col-span-2">
									<label className="text-xs font-bold text-gray-400 uppercase">Registered</label>
									<p className="text-deepBlue font-medium mt-1">
										{new Date(selectedSponsor.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
									</p>
								</div>
								{selectedSponsor.description && (
									<div className="col-span-2">
										<label className="text-xs font-bold text-gray-400 uppercase">Description</label>
										<p className="text-gray-700 mt-1 text-sm">{selectedSponsor.description}</p>
									</div>
								)}
							</div>

							{/* Booths */}
							<div>
								<h3 className="font-bold text-deepBlue text-sm mb-2">Reserved Booths ({selectedSponsor.booths.length})</h3>
								{selectedSponsor.booths.length > 0 ? (
									<div className="space-y-2">
										{selectedSponsor.booths.map((b) => (
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
								<h3 className="font-bold text-deepBlue text-sm mb-2">Invoices ({selectedSponsor.invoices.length})</h3>
								{selectedSponsor.invoices.length > 0 ? (
									<div className="space-y-2">
										{selectedSponsor.invoices.map((inv) => (
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
