"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
	LayoutGridIcon,
	FileTextIcon,
	DownloadIcon,
	UploadIcon,
	Loader2Icon,
	CheckCircleIcon,
	XCircleIcon,
	ClockIcon,
	AlertCircleIcon,
	CreditCardIcon,
} from "lucide-react";

interface UserProfile {
	id: string;
	name: string;
	companyName: string;
	email: string;
	phone: string;
	role: "EXHIBITOR" | "SPONSOR";
	category: string | null;
	logoUrl: string | null;
}

interface BoothReservation {
	id: string;
	name: string;
	section: string;
	price: string;
	status: "AVAILABLE" | "RESERVED" | "PAYMENT_SUBMITTED" | "CONFIRMED";
	reservedUntil: string | null;
}

interface InvoiceItem {
	id: string;
	price: string;
	booth: { name: string; section: string };
}

interface Payment {
	id: string;
	status: string;
	method: string;
	transactionCode: string | null;
	proofImageUrl: string | null;
	submittedAt: string;
}

interface Invoice {
	id: string;
	invoiceNumber: string;
	totalAmount: string;
	status: string;
	createdAt: string;
	items: InvoiceItem[];
	payments: Payment[];
}

const boothStatusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircleIcon }> = {
	AVAILABLE: { label: "Available", color: "bg-green-100 text-green-800", icon: CheckCircleIcon },
	RESERVED: { label: "Reserved", color: "bg-orange-100 text-orange-800", icon: ClockIcon },
	PAYMENT_SUBMITTED: { label: "Payment Submitted", color: "bg-blue-100 text-blue-800", icon: CreditCardIcon },
	CONFIRMED: { label: "Confirmed", color: "bg-emerald-100 text-emerald-800", icon: CheckCircleIcon },
};

const invoiceStatusConfig: Record<string, { label: string; color: string }> = {
	UNPAID: { label: "Unpaid", color: "bg-red-100 text-red-800" },
	PENDING_VERIFICATION: { label: "Pending Verification", color: "bg-yellow-100 text-yellow-800" },
	PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
	REJECTED: { label: "Rejected", color: "bg-gray-100 text-gray-800" },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
	SUBMITTED: { label: "Payment Submitted", color: "bg-yellow-100 text-yellow-800" },
	VERIFIED: { label: "Payment Verified", color: "bg-green-100 text-green-800" },
	REJECTED: { label: "Payment Rejected", color: "bg-red-100 text-red-800" },
};

export default function DashboardPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserProfile | null>(null);
	const [booths, setBooths] = useState<BoothReservation[]>([]);
	const [invoices, setInvoices] = useState<Invoice[]>([]);

	// Payment form state
	const [payInvoiceId, setPayInvoiceId] = useState("");
	const [payMethod, setPayMethod] = useState("");
	const [payTransactionCode, setPayTransactionCode] = useState("");
	const [payNotes, setPayNotes] = useState("");
	const [payFile, setPayFile] = useState<File | null>(null);
	const [payFileName, setPayFileName] = useState("");
	const [paySubmitting, setPaySubmitting] = useState(false);
	const [paySuccess, setPaySuccess] = useState(false);
	const [payError, setPayError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const fetchDashboard = () => {
		fetch("/api/dashboard")
			.then((r) => {
				if (!r.ok) throw new Error("Unauthorized");
				return r.json();
			})
			.then((data) => {
				setUser(data.user);
				setBooths(data.booths);
				setInvoices(data.invoices);
				setLoading(false);
			})
			.catch(() => {
				router.push("/login");
			});
	};

	useEffect(() => {
		fetchDashboard();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const payableInvoices = invoices.filter(
		(i) => i.status === "UNPAID" || i.status === "REJECTED"
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (f) {
			setPayFile(f);
			setPayFileName(f.name);
		}
	};

	const handlePaymentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!payInvoiceId || !payMethod) return;
		if (!payFile && !payTransactionCode) {
			setPayError("Please upload a payment image or enter a transaction code");
			return;
		}

		setPaySubmitting(true);
		setPayError("");

		const formData = new FormData();
		formData.append("invoiceId", payInvoiceId);
		formData.append("method", payMethod);
		if (payTransactionCode) formData.append("transactionCode", payTransactionCode);
		if (payNotes) formData.append("notes", payNotes);
		if (payFile) formData.append("proofImage", payFile);

		try {
			const res = await fetch("/api/payments", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const data = await res.json();
				setPayError(data.error || "Failed to submit payment");
				setPaySubmitting(false);
				return;
			}

			setPaySuccess(true);
			setPayInvoiceId("");
			setPayMethod("");
			setPayTransactionCode("");
			setPayNotes("");
			setPayFile(null);
			setPayFileName("");
			// Refresh dashboard data
			fetchDashboard();
		} catch {
			setPayError("Network error");
		} finally {
			setPaySubmitting(false);
		}
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
		doc.text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`, 14, 52);
		doc.text(`Status: ${inv.status.replace(/_/g, " ")}`, 14, 58);

		const rows = inv.items.map((item, i) => [
			String(i + 1),
			item.booth.name,
			item.booth.section,
			`KES ${Number(item.price).toLocaleString()}`,
		]);

		autoTable(doc, {
			startY: 68,
			head: [["#", "Booth", "Section", "Price"]],
			body: rows,
			theme: "striped",
			headStyles: { fillColor: [102, 0, 0] },
		});

		const finalY = (doc as any).lastAutoTable?.finalY || 100;
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
			<div className="min-h-screen flex items-center justify-center">
				<Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-deepBlue font-poppins">Dashboard</h1>
					<p className="text-gray-500 mt-1">
						Welcome back, <span className="font-medium text-deepBlue">{user.companyName}</span>
					</p>
				</div>

				{/* =================== PROFILE SECTION =================== */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
					<div className="bg-deepBlue px-4 sm:px-6 md:px-8 py-4 sm:py-6">
						<h2 className="text-lg sm:text-xl font-bold text-white font-poppins">Registration Details</h2>
					</div>
					<div className="p-4 sm:p-6 md:p-8">
						<div className="flex flex-col md:flex-row gap-8">
							{user.role === "SPONSOR" && user.logoUrl && (
								<div className="flex-shrink-0">
									<Image
										src={user.logoUrl}
										alt={`${user.companyName} logo`}
										width={160}
										height={160}
										className="rounded-xl border border-gray-200 object-contain w-40 h-40"
									/>
								</div>
							)}
							<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</label>
									<p className="text-lg text-deepBlue font-medium mt-1">{user.name}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company</label>
									<p className="text-lg text-deepBlue font-medium mt-1">{user.companyName}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
									<p className="text-lg text-deepBlue font-medium mt-1">{user.email}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
									<p className="text-lg text-deepBlue font-medium mt-1">{user.phone}</p>
								</div>
								<div>
									<label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label>
									<p className="mt-1">
										<span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
											user.role === "EXHIBITOR"
												? "bg-blue-100 text-blue-800"
												: "bg-purple-100 text-purple-800"
										}`}>
											{user.role}
										</span>
									</p>
								</div>
								{user.category && (
									<div>
										<label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
										<p className="text-lg text-deepBlue font-medium mt-1 capitalize">{user.category}</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* =================== BOOTHS SECTION =================== */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
					<div className="bg-deepBlue px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
						<h2 className="text-lg sm:text-xl font-bold text-white font-poppins">Booth Reservations</h2>
						<Link
							href="/booths"
							className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition-colors text-center"
						>
							Reserve More Booths
						</Link>
					</div>
					<div className="p-4 sm:p-6 md:p-8">
						{booths.length === 0 ? (
							<div className="text-center py-12">
								<LayoutGridIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
								<p className="text-gray-500 mb-4">You haven&apos;t reserved any booths yet.</p>
								<Link
									href="/booths"
									className="bg-maroon hover:bg-gold text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
								>
									Browse Booths
								</Link>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead className="bg-gray-50 border-b border-gray-200">
										<tr>
											<th className="text-left px-4 py-3 font-semibold text-gray-600">Booth</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-600">Section</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
											<th className="text-left px-4 py-3 font-semibold text-gray-600">Reserved Until</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{booths.map((booth) => {
											const cfg = boothStatusConfig[booth.status] || boothStatusConfig.AVAILABLE;
											return (
												<tr key={booth.id} className="hover:bg-gray-50">
													<td className="px-4 py-3 font-bold text-deepBlue">{booth.name}</td>
													<td className="px-4 py-3 text-gray-700 capitalize">{booth.section}</td>
													<td className="px-4 py-3 font-medium text-gray-800">
														KES {Number(booth.price).toLocaleString()}
													</td>
													<td className="px-4 py-3">
														<span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
															{cfg.label}
														</span>
													</td>
													<td className="px-4 py-3 text-gray-500">
														{booth.reservedUntil
															? new Date(booth.reservedUntil).toLocaleDateString("en-GB", {
																	day: "numeric",
																	month: "short",
																	year: "numeric",
															  })
															: "—"}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>

				{/* =================== INVOICES SECTION =================== */}
				<div className="space-y-6">
					{invoices.length === 0 ? (
						<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
							<FileTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500 mb-4">No invoices yet. Reserve booths to generate an invoice.</p>
							<Link
								href="/booths"
								className="bg-maroon hover:bg-gold text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
							>
								Browse Booths
							</Link>
						</div>
					) : (
						invoices.map((inv) => {
							const statusCfg = invoiceStatusConfig[inv.status] || invoiceStatusConfig.UNPAID;
							return (
								<div
									key={inv.id}
									className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
								>
									{/* Invoice Header */}
									<div className="bg-deepBlue p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
										<div>
											<p className="text-sm text-gray-300 uppercase tracking-wider font-semibold">Invoice</p>
											<p className="text-xl font-bold text-gold font-poppins">{inv.invoiceNumber}</p>
										</div>
										<div className="flex items-center gap-3">
											<span className={`px-3 py-1 rounded-full text-xs font-bold ${statusCfg.color}`}>
												{statusCfg.label}
											</span>
											<button
												onClick={() => downloadPdf(inv)}
												className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
											>
												<DownloadIcon className="h-4 w-4" />
												Download PDF
											</button>
										</div>
									</div>

									{/* Invoice Details */}
									<div className="p-6">
										<div className="mb-4">
											<p className="text-sm text-gray-500">
												Date: {new Date(inv.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
											</p>
										</div>

										{/* Items table */}
										<div className="overflow-x-auto mb-4">
											<table className="w-full text-sm">
												<thead className="bg-gray-50 border-b border-gray-200">
													<tr>
														<th className="text-left px-4 py-2 font-semibold text-gray-600">Booth</th>
														<th className="text-left px-4 py-2 font-semibold text-gray-600">Section</th>
														<th className="text-right px-4 py-2 font-semibold text-gray-600">Price</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-100">
													{inv.items.map((item) => (
														<tr key={item.id}>
															<td className="px-4 py-2 font-medium text-deepBlue">{item.booth.name}</td>
															<td className="px-4 py-2 text-gray-600 capitalize">{item.booth.section}</td>
															<td className="px-4 py-2 text-right font-medium">
																KES {Number(item.price).toLocaleString()}
															</td>
														</tr>
													))}
												</tbody>
												<tfoot>
													<tr className="border-t-2 border-gray-200">
														<td colSpan={2} className="px-4 py-3 font-bold text-deepBlue">Total</td>
														<td className="px-4 py-3 text-right font-bold text-maroon text-lg">
															KES {Number(inv.totalAmount).toLocaleString()}
														</td>
													</tr>
												</tfoot>
											</table>
										</div>

										{/* Payment History */}
										{inv.payments.length > 0 && (
											<div className="mt-6">
												<h4 className="font-bold text-deepBlue text-sm mb-3">Payment History</h4>
												<div className="space-y-2">
													{inv.payments.map((p) => {
														const pCfg = paymentStatusConfig[p.status] || paymentStatusConfig.SUBMITTED;
														return (
															<div
																key={p.id}
																className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 gap-2"
															>
																<div className="flex items-center gap-3">
																	{p.status === "VERIFIED" && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
																	{p.status === "REJECTED" && <XCircleIcon className="h-4 w-4 text-red-600" />}
																	{p.status === "SUBMITTED" && <ClockIcon className="h-4 w-4 text-yellow-600" />}
																	<div>
																		<span className="text-sm font-medium text-gray-700">
																			{p.method}
																			{p.transactionCode && ` — ${p.transactionCode}`}
																		</span>
																		<p className="text-xs text-gray-400">
																			{new Date(p.submittedAt).toLocaleDateString("en-GB", {
																				day: "numeric",
																				month: "short",
																				year: "numeric",
																			})}
																		</p>
																	</div>
																</div>
																<span className={`px-2 py-1 rounded-full text-xs font-bold ${pCfg.color}`}>
																	{pCfg.label}
																</span>
															</div>
														);
													})}
												</div>
											</div>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* =================== PAYMENT SECTION =================== */}
				<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
					<div className="bg-deepBlue px-4 sm:px-6 md:px-8 py-4 sm:py-6">
						<h2 className="text-lg sm:text-xl font-bold text-white font-poppins">Submit Payment</h2>
						<p className="text-gray-300 text-sm mt-1">Upload a payment screenshot or enter a transaction code</p>
					</div>

					{paySuccess ? (
						<div className="p-6 sm:p-12 text-center">
							<CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
							<h3 className="text-2xl font-bold text-deepBlue font-poppins mb-2">Payment Submitted!</h3>
							<p className="text-gray-600 mb-6">
								Your payment proof has been submitted for verification. You will see the status update here once reviewed.
							</p>
							<button
								onClick={() => setPaySuccess(false)}
								className="bg-maroon hover:bg-gold text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
							>
								Submit Another Payment
							</button>
						</div>
					) : payableInvoices.length === 0 ? (
						<div className="p-6 sm:p-12 text-center">
							<AlertCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500 mb-2">No unpaid invoices.</p>
							<p className="text-sm text-gray-400">
								All your invoices have been paid or are pending verification.
							</p>
						</div>
					) : (
						<form onSubmit={handlePaymentSubmit} className="p-4 sm:p-6 md:p-8 space-y-6">
							{payError && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
									{payError}
								</div>
							)}

							{/* Invoice selector */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Select Invoice</label>
								<select
									required
									value={payInvoiceId}
									onChange={(e) => setPayInvoiceId(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white"
								>
									<option value="">Choose an invoice</option>
									{payableInvoices.map((i) => (
										<option key={i.id} value={i.id}>
											{i.invoiceNumber} — KES {Number(i.totalAmount).toLocaleString()}
											{i.status === "REJECTED" ? " (Rejected — resubmit)" : ""}
										</option>
									))}
								</select>
							</div>

							{/* Payment Method */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
								<select
									required
									value={payMethod}
									onChange={(e) => setPayMethod(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white"
								>
									<option value="">Select method</option>
									<option value="MPESA">M-PESA</option>
									<option value="BANK">Bank Transfer</option>
									<option value="OTHER">Other</option>
								</select>
							</div>

							{/* Transaction Code */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Transaction Code / Reference Number
								</label>
								<input
									type="text"
									value={payTransactionCode}
									onChange={(e) => setPayTransactionCode(e.target.value)}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon uppercase"
									placeholder="e.g. QWE123RTY4"
								/>
								<p className="text-xs text-gray-400 mt-1">Enter a transaction code OR upload a payment image (at least one is required)</p>
							</div>

							{/* File Upload */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Upload Payment Screenshot / Receipt
								</label>
								<div
									className="flex justify-center px-6 pt-6 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-maroon transition-colors cursor-pointer bg-gray-50"
									onClick={() => fileInputRef.current?.click()}
								>
									<div className="space-y-2 text-center">
										<UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
										<div className="text-sm text-gray-600">
											{payFileName ? (
												<span className="font-medium text-maroon">{payFileName}</span>
											) : (
												<span>Click to upload a file</span>
											)}
										</div>
										<p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
									</div>
								</div>
								<input
									ref={fileInputRef}
									type="file"
									className="hidden"
									accept="image/*,.pdf"
									onChange={handleFileChange}
								/>
							</div>

							{/* Notes */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
								<textarea
									value={payNotes}
									onChange={(e) => setPayNotes(e.target.value)}
									rows={3}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
									placeholder="Any additional information..."
								/>
							</div>

							<div className="pt-2">
								<button
									type="submit"
									disabled={paySubmitting || !payInvoiceId || !payMethod || (!payFile && !payTransactionCode)}
									className="w-full bg-maroon hover:bg-gold text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{paySubmitting && <Loader2Icon className="h-5 w-5 animate-spin" />}
									Submit Payment
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
