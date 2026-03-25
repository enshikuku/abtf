"use client";

import { useEffect, useState } from "react";
import {
	CheckCircleIcon,
	XCircleIcon,
	Loader2Icon,
	EyeIcon,
	CreditCardIcon,
	SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { ExportActions } from "@/components/admin/ExportActions";

interface Payment {
	id: string;
	method: string;
	transactionCode: string | null;
	proofImageUrl: string | null;
	notes: string | null;
	status: string;
	submittedAt: string;
	invoice: {
		id: string;
		invoiceNumber: string;
		totalAmount: string;
		status: string;
		user: { id: string; name: string; companyName: string; email: string };
		items: { booth: { name: string; section: string } }[];
	};
}

type TabKey = "SUBMITTED" | "VERIFIED" | "REJECTED";

export default function AdminPaymentsPage() {
	const [payments, setPayments] = useState<Payment[]>([]);
	const [loading, setLoading] = useState(true);
	const [acting, setActing] = useState<string | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<TabKey>("SUBMITTED");
	const [search, setSearch] = useState("");

	const fetchPayments = () => {
		fetch("/api/admin/payments")
			.then((r) => r.json())
			.then((data) => {
				if (Array.isArray(data)) setPayments(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	};

	useEffect(() => {
		fetchPayments();
	}, []);

	const handleAction = async (paymentId: string, action: "VERIFIED" | "REJECTED") => {
		setActing(paymentId);
		try {
			const res = await fetch("/api/admin/payments", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ paymentId, action }),
			});
			if (res.ok) fetchPayments();
		} finally {
			setActing(null);
		}
	};

	const pending = payments.filter((p) => p.status === "SUBMITTED");
	const verified = payments.filter((p) => p.status === "VERIFIED");
	const rejected = payments.filter((p) => p.status === "REJECTED");

	const tabs: { key: TabKey; label: string; count: number; color: string }[] = [
		{ key: "SUBMITTED", label: "Pending", count: pending.length, color: "text-yellow-600 border-yellow-600" },
		{ key: "VERIFIED", label: "Verified", count: verified.length, color: "text-green-600 border-green-600" },
		{ key: "REJECTED", label: "Rejected", count: rejected.length, color: "text-red-600 border-red-600" },
	];

	const currentPayments = { SUBMITTED: pending, VERIFIED: verified, REJECTED: rejected }[activeTab];

	const filtered = currentPayments.filter((p) => {
		if (!search) return true;
		const q = search.toLowerCase();
		return (
			p.invoice.user.companyName.toLowerCase().includes(q) ||
			p.invoice.invoiceNumber.toLowerCase().includes(q) ||
			(p.transactionCode?.toLowerCase().includes(q) ?? false)
		);
	});

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
						<CreditCardIcon className="h-6 w-6 text-maroon" /> Payment Verification
					</h1>
					<p className="text-gray-500 mt-1">{payments.length} total payments</p>
				</div>
				<ExportActions
					title="ABTF Payment Report"
					filenameBase="abtf-payments"
					rows={filtered}
					metadata={{
						"Rows Included": filtered.length,
						"Tab Filter": activeTab,
					}}
					columns={[
						{ header: "Invoice", value: (row) => row.invoice.invoiceNumber },
						{ header: "Company", value: (row) => row.invoice.user.companyName },
						{ header: "Method", value: (row) => row.method },
						{ header: "Transaction Code", value: (row) => row.transactionCode || "-" },
						{ header: "Invoice Amount", value: (row) => Number(row.invoice.totalAmount).toLocaleString() },
						{ header: "Payment Status", value: (row) => row.status },
						{ header: "Invoice Status", value: (row) => row.invoice.status },
						{ header: "Submitted At", value: (row) => new Date(row.submittedAt).toLocaleString() },
					]}
				/>
			</div>

			{/* Tabs */}
			<div className="flex border-b border-gray-200 mb-6">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActiveTab(tab.key)}
						className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
							? tab.color
							: "text-gray-500 border-transparent hover:text-gray-700"
							}`}
					>
						{tab.label}{" "}
						<span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-gray-100" : "bg-gray-50"
							}`}>
							{tab.count}
						</span>
					</button>
				))}
			</div>

			{/* Search */}
			<div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
				<div className="relative">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search by company, invoice number, or transaction code..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-maroon focus:border-transparent outline-none"
					/>
				</div>
			</div>

			{/* Payment Cards */}
			{filtered.length === 0 ? (
				<div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
					{search ? "No payments match your search." : `No ${activeTab.toLowerCase()} payments.`}
				</div>
			) : (
				<div className="space-y-4">
					{filtered.map((p) => (
						<div key={p.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
							<div className="flex flex-col lg:flex-row lg:items-start gap-6">
								<div className="flex-1 space-y-2">
									<div className="flex items-center gap-3 flex-wrap">
										<span className="font-bold text-deepBlue text-lg">{p.invoice.invoiceNumber}</span>
										<span className={`px-2 py-1 text-xs font-bold rounded-full ${p.status === "SUBMITTED" ? "bg-yellow-100 text-yellow-800" :
											p.status === "VERIFIED" ? "bg-green-100 text-green-800" :
												"bg-red-100 text-red-800"
											}`}>
											{p.status}
										</span>
									</div>
									<p className="text-gray-700">
										<span className="font-medium">{p.invoice.user.companyName}</span>
										<span className="text-gray-400 ml-2">({p.invoice.user.email})</span>
									</p>
									<p className="text-sm text-gray-500">
										Method: <span className="font-medium">{p.method}</span>
										{p.transactionCode && <> &mdash; Code: <span className="font-medium">{p.transactionCode}</span></>}
									</p>
									<p className="text-sm text-gray-500">
										Booths: {p.invoice.items.map((i) => i.booth.name).join(", ")}
									</p>
									<p className="text-lg font-bold text-maroon">
										KES {Number(p.invoice.totalAmount).toLocaleString()}
									</p>
									<p className="text-xs text-gray-400">
										Submitted: {new Date(p.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
									</p>
									{p.notes && <p className="text-sm text-gray-500 italic">Note: {p.notes}</p>}
								</div>

								<div className="flex flex-col items-center gap-3">
									{p.proofImageUrl && (
										<button
											onClick={() => setPreviewImage(p.proofImageUrl)}
											className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
										>
											<EyeIcon className="h-4 w-4" /> View Proof
										</button>
									)}
									{p.status === "SUBMITTED" && (
										<div className="flex gap-2">
											<button
												onClick={() => handleAction(p.id, "VERIFIED")}
												disabled={acting === p.id}
												className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-medium disabled:opacity-50"
											>
												{acting === p.id ? (
													<Loader2Icon className="h-4 w-4 animate-spin" />
												) : (
													<CheckCircleIcon className="h-4 w-4" />
												)}
												Approve
											</button>
											<button
												onClick={() => handleAction(p.id, "REJECTED")}
												disabled={acting === p.id}
												className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-medium disabled:opacity-50"
											>
												<XCircleIcon className="h-4 w-4" /> Reject
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Image Preview Modal */}
			{previewImage && (
				<div
					className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
					onClick={() => setPreviewImage(null)}
				>
					<div
						className="max-w-3xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-between items-center p-4 border-b">
							<span className="font-bold text-deepBlue">Payment Proof</span>
							<button onClick={() => setPreviewImage(null)} className="text-gray-400 hover:text-gray-600">
								<XCircleIcon className="h-5 w-5" />
							</button>
						</div>
						<div className="p-4">
							<Image
								src={previewImage}
								alt="Payment proof"
								width={1400}
								height={900}
								unoptimized
								className="max-w-full max-h-[70vh] object-contain mx-auto"
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
