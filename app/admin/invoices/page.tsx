"use client";

import { useEffect, useState } from "react";
import { Loader2Icon, FileTextIcon, SearchIcon, XCircleIcon, DownloadIcon } from "lucide-react";
import { getBoothSectionDisplay } from "@/lib/exhibition-categories";
import { ExportActions } from "@/components/admin/ExportActions";

interface InvoiceItem {
	id: string;
	price: string;
	booth: {
		name: string;
		section: string;
		audience: "EXHIBITOR" | "SPONSOR";
		sponsorLevel: "PLATINUM" | "GOLD" | "SILVER" | "BRONZE" | null;
	};
}

interface Payment {
	id: string;
	status: string;
	method: string;
	submittedAt: string;
}

interface Invoice {
	id: string;
	invoiceNumber: string;
	totalAmount: string;
	status: string;
	createdAt: string;
	user: { id: string; name: string; companyName: string; email: string };
	items: InvoiceItem[];
	payments: Payment[];
}

type StatusFilter = "ALL" | "UNPAID" | "PENDING_VERIFICATION" | "PAID" | "REJECTED";

export default function AdminInvoicesPage() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<StatusFilter>("ALL");
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

	useEffect(() => {
		fetch("/api/admin/invoices")
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data)) setInvoices(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	const filtered = invoices.filter((inv) => {
		if (filterStatus !== "ALL" && inv.status !== filterStatus) return false;
		if (search) {
			const q = search.toLowerCase();
			return (
				inv.invoiceNumber.toLowerCase().includes(q) ||
				inv.user.companyName.toLowerCase().includes(q) ||
				inv.user.email.toLowerCase().includes(q)
			);
		}
		return true;
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

	const downloadPdf = async (inv: Invoice) => {
		const { jsPDF } = await import("jspdf");
		const autoTable = (await import("jspdf-autotable")).default;
		const doc = new jsPDF();

		doc.setFontSize(20);
		doc.setTextColor(0, 0, 51);
		doc.text("Agri-Business Trade Fair 2026", 14, 22);
		doc.setFontSize(11);
		doc.setTextColor(100, 100, 100);
		doc.text("University of Eldoret", 14, 30);

		doc.setFontSize(14);
		doc.setTextColor(0, 0, 0);
		doc.text(`Invoice: ${inv.invoiceNumber}`, 14, 45);
		doc.setFontSize(10);
		doc.text(`Company: ${inv.user.companyName}`, 14, 52);
		doc.text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`, 14, 58);
		doc.text(`Status: ${inv.status.replace(/_/g, " ")}`, 14, 64);

		const rows = inv.items.map((item, i) => [
			String(i + 1),
			item.booth.name,
			`${getBoothSectionDisplay(item.booth.section, item.booth.audience)}${item.booth.audience === "SPONSOR" && item.booth.sponsorLevel ? ` (${item.booth.sponsorLevel})` : ""}`,
			`KES ${Number(item.price).toLocaleString()}`,
		]);

		autoTable(doc, {
			startY: 74,
			head: [["#", "Booth", "Section", "Price"]],
			body: rows,
			theme: "striped",
			headStyles: { fillColor: [102, 0, 0] },
		});

		const finalY = (doc as typeof doc & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || 100;
		doc.setFontSize(13);
		doc.setTextColor(102, 0, 0);
		doc.text(`Total: KES ${Number(inv.totalAmount).toLocaleString()}`, 14, finalY + 14);

		doc.setFontSize(10);
		doc.setTextColor(0, 0, 0);
		doc.text("Payment Instructions:", 14, finalY + 28);
		doc.setFontSize(9);
		doc.text("M-PESA Paybill: 123456  |  Account: " + inv.invoiceNumber, 14, finalY + 35);
		doc.text("Bank: Kenya Commercial Bank  |  Account Name: UoE Trade Fair  |  Acc No: 1122334455", 14, finalY + 41);

		doc.save(`${inv.invoiceNumber}.pdf`);
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
						<FileTextIcon className="h-6 w-6 text-maroon" /> Invoices ({invoices.length})
					</h1>
				</div>
				<ExportActions
					title="ABTF Invoice Report"
					filenameBase="abtf-invoices"
					rows={filtered}
					metadata={{
						"Rows Included": filtered.length,
						"Status Filter": filterStatus,
					}}
					columns={[
						{ header: "Invoice Number", value: (row) => row.invoiceNumber },
						{ header: "Company", value: (row) => row.user.companyName },
						{ header: "Email", value: (row) => row.user.email },
						{ header: "Booths", value: (row) => row.items.map((i) => i.booth.name).join(", ") },
						{ header: "Total Amount", value: (row) => Number(row.totalAmount).toLocaleString() },
						{ header: "Status", value: (row) => row.status },
						{ header: "Latest Payment", value: (row) => row.payments[0]?.status || "NO_PAYMENT" },
						{ header: "Created At", value: (row) => new Date(row.createdAt).toLocaleString() },
					]}
				/>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search by invoice number, company, or email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-maroon focus:border-transparent outline-none"
					/>
				</div>
				<select
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
					className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-maroon focus:border-transparent outline-none"
				>
					<option value="ALL">All Statuses</option>
					<option value="UNPAID">Unpaid</option>
					<option value="PENDING_VERIFICATION">Pending Verification</option>
					<option value="PAID">Paid</option>
					<option value="REJECTED">Rejected</option>
				</select>
			</div>

			<p className="text-sm text-gray-500 mb-3">{filtered.length} invoices shown</p>

			{filtered.length === 0 ? (
				<div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
					{search || filterStatus !== "ALL" ? "No invoices match your filters." : "No invoices yet."}
				</div>
			) : (
				<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-gray-50 border-b">
								<tr>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Invoice ID</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Company</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Booths</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
									<th className="text-left px-4 py-3 font-medium text-gray-600">Payment</th>
									<th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{filtered.map((inv) => {
									const latestPayment = inv.payments[0];
									return (
										<tr key={inv.id} className="hover:bg-gray-50">
											<td className="px-4 py-3 font-bold text-deepBlue">{inv.invoiceNumber}</td>
											<td className="px-4 py-3">{inv.user.companyName}</td>
											<td className="px-4 py-3 text-xs">
												{inv.items.map((i) => i.booth.name).join(", ")}
											</td>
											<td className="px-4 py-3 font-medium">KES {Number(inv.totalAmount).toLocaleString()}</td>
											<td className="px-4 py-3">
												<span className={`px-2 py-1 rounded-full text-xs font-bold ${invoiceStatusBadge(inv.status)}`}>
													{inv.status.replace(/_/g, " ")}
												</span>
											</td>
											<td className="px-4 py-3 text-gray-500 text-xs">
												{new Date(inv.createdAt).toLocaleDateString()}
											</td>
											<td className="px-4 py-3">
												{latestPayment ? (
													<span className={`px-2 py-1 rounded-full text-xs font-bold ${latestPayment.status === "VERIFIED" ? "bg-green-100 text-green-800" :
														latestPayment.status === "SUBMITTED" ? "bg-yellow-100 text-yellow-800" :
															"bg-red-100 text-red-800"
														}`}>
														{latestPayment.status}
													</span>
												) : (
													<span className="text-gray-400 text-xs">No payment</span>
												)}
											</td>
											<td className="px-4 py-3 text-right">
												<div className="flex items-center justify-end gap-2">
													<button
														onClick={() => setSelectedInvoice(inv)}
														className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md font-medium transition-colors"
													>
														View
													</button>
													<button
														onClick={() => downloadPdf(inv)}
														className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1"
													>
														<DownloadIcon className="h-3 w-3" /> PDF
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Invoice Detail Modal */}
			{selectedInvoice && (
				<div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedInvoice(null)}>
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
						<div className="flex justify-between items-center p-6 border-b">
							<div>
								<h2 className="text-lg font-bold text-deepBlue font-poppins">{selectedInvoice.invoiceNumber}</h2>
								<p className="text-sm text-gray-500">{selectedInvoice.user.companyName}</p>
							</div>
							<div className="flex items-center gap-3">
								<button
									onClick={() => downloadPdf(selectedInvoice)}
									className="text-sm bg-maroon hover:bg-gold text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
								>
									<DownloadIcon className="h-4 w-4" /> Download PDF
								</button>
								<button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600">
									<XCircleIcon className="h-5 w-5" />
								</button>
							</div>
						</div>
						<div className="p-6 space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Status</label>
									<p className="mt-1">
										<span className={`px-2 py-1 rounded-full text-xs font-bold ${invoiceStatusBadge(selectedInvoice.status)}`}>
											{selectedInvoice.status.replace(/_/g, " ")}
										</span>
									</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Created</label>
									<p className="text-deepBlue font-medium mt-1">
										{new Date(selectedInvoice.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
									</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Contact</label>
									<p className="text-deepBlue font-medium mt-1">{selectedInvoice.user.name}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase">Email</label>
									<p className="text-deepBlue font-medium mt-1">{selectedInvoice.user.email}</p>
								</div>
							</div>

							{/* Items */}
							<div>
								<h3 className="font-bold text-deepBlue text-sm mb-2">Booth Items</h3>
								<table className="w-full text-sm">
									<thead className="bg-gray-50 border-b">
										<tr>
											<th className="text-left px-3 py-2 font-medium text-gray-600">#</th>
											<th className="text-left px-3 py-2 font-medium text-gray-600">Booth</th>
											<th className="text-left px-3 py-2 font-medium text-gray-600">Section</th>
											<th className="text-right px-3 py-2 font-medium text-gray-600">Price</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{selectedInvoice.items.map((item, i) => (
											<tr key={item.id}>
												<td className="px-3 py-2">{i + 1}</td>
												<td className="px-3 py-2 font-medium text-deepBlue">{item.booth.name}</td>
												<td className="px-3 py-2">
													{getBoothSectionDisplay(item.booth.section, item.booth.audience)}
													{item.booth.audience === "SPONSOR" && item.booth.sponsorLevel ? ` (${item.booth.sponsorLevel})` : ""}
												</td>
												<td className="px-3 py-2 text-right">KES {Number(item.price).toLocaleString()}</td>
											</tr>
										))}
									</tbody>
									<tfoot>
										<tr className="border-t-2 border-gray-200">
											<td colSpan={3} className="px-3 py-3 font-bold text-deepBlue">Total</td>
											<td className="px-3 py-3 text-right font-bold text-maroon">
												KES {Number(selectedInvoice.totalAmount).toLocaleString()}
											</td>
										</tr>
									</tfoot>
								</table>
							</div>

							{/* Payment History */}
							<div>
								<h3 className="font-bold text-deepBlue text-sm mb-2">Payment History ({selectedInvoice.payments.length})</h3>
								{selectedInvoice.payments.length > 0 ? (
									<div className="space-y-2">
										{selectedInvoice.payments.map((p) => (
											<div key={p.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
												<div>
													<span className="font-medium text-deepBlue text-sm">{p.method}</span>
													<p className="text-xs text-gray-400">
														{new Date(p.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
													</p>
												</div>
												<span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.status === "VERIFIED" ? "bg-green-100 text-green-800" :
													p.status === "SUBMITTED" ? "bg-yellow-100 text-yellow-800" :
														"bg-red-100 text-red-800"
													}`}>
													{p.status}
												</span>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-400 text-sm">No payments submitted.</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
