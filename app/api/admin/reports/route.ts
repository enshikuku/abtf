import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { createExecutiveSummary } from "@/lib/admin-reporting";
import { getBoothStatusTheme } from "@/lib/booth-status";

function toDateRange(startDate?: string | null, endDate?: string | null) {
	const now = new Date();
	const start = startDate ? new Date(startDate) : new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
	const end = endDate ? new Date(endDate) : now;

	start.setHours(0, 0, 0, 0);
	end.setHours(23, 59, 59, 999);
	return { start, end };
}

function asDay(dateInput: Date | string) {
	const date = new Date(dateInput);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function buildDaySeries(records: Array<{ createdAt: Date | string }>, start: Date, end: Date) {
	const index = new Map<string, number>();
	records.forEach((record) => {
		const key = asDay(record.createdAt);
		index.set(key, (index.get(key) || 0) + 1);
	});

	const rows: Array<{ date: string; value: number }> = [];
	const cursor = new Date(start);
	while (cursor <= end) {
		const key = asDay(cursor);
		rows.push({ date: key, value: index.get(key) || 0 });
		cursor.setDate(cursor.getDate() + 1);
	}

	return rows;
}

function toDistribution(rows: string[]) {
	const map = new Map<string, number>();
	rows.forEach((item) => {
		map.set(item, (map.get(item) || 0) + 1);
	});

	return Array.from(map.entries())
		.map(([label, value]) => ({ label: label.replace(/_/g, " "), value }))
		.sort((a, b) => b.value - a.value);
}

export async function GET(request: NextRequest) {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const { searchParams } = new URL(request.url);

	const startDateParam = searchParams.get("startDate");
	const endDateParam = searchParams.get("endDate");

	const roleFilter = searchParams.get("userRole") || "ALL";
	const sponsorLevel = searchParams.get("sponsorLevel") || "ALL";
	const exhibitorCategory = searchParams.get("exhibitorCategory") || "ALL";
	const boothAudience = searchParams.get("boothAudience") || "ALL";
	const boothStatus = searchParams.get("boothStatus") || "ALL";
	const reservationStatus = searchParams.get("reservationStatus") || "ALL";
	const invoiceStatus = searchParams.get("invoiceStatus") || "ALL";
	const paymentStatus = searchParams.get("paymentStatus") || "ALL";
	const attendeeStatus = searchParams.get("attendeeStatus") || "ALL";
	const attendeeType = searchParams.get("attendeeType") || "ALL";
	const feedbackStatus = searchParams.get("feedbackStatus") || "ALL";
	const feedbackCategory = searchParams.get("feedbackCategory") || "ALL";

	const { start, end } = toDateRange(startDateParam, endDateParam);

	const userFilter = roleFilter !== "ALL" ? { role: roleFilter as "EXHIBITOR" | "SPONSOR" | "ADMIN" } : {};

	const sponsorLevelFilter = sponsorLevel !== "ALL" ? { sponsorLevel: sponsorLevel as "PLATINUM" | "GOLD" | "SILVER" | "BRONZE" } : {};
	const prismaDb = prisma as any;

	const [users, booths, reservations, invoices, payments] = await Promise.all([
		prisma.user.findMany({
			where: {
				createdAt: { gte: start, lte: end },
				...userFilter,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				companyName: true,
				phone: true,
				sponsorLevel: true,
				category: true,
				exhibitorCategory: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.booth.findMany({
			where: {
				createdAt: { gte: start, lte: end },
				...(boothAudience !== "ALL" ? { audience: boothAudience as "EXHIBITOR" | "SPONSOR" } : {}),
				...(boothStatus !== "ALL" ? { status: boothStatus as "AVAILABLE" | "RESERVED" | "PAYMENT_SUBMITTED" | "CONFIRMED" } : {}),
				...(roleFilter !== "ALL" ? { user: { role: roleFilter as "EXHIBITOR" | "SPONSOR" | "ADMIN" } } : {}),
				...sponsorLevelFilter,
			},
			select: {
				id: true,
				name: true,
				section: true,
				audience: true,
				sponsorLevel: true,
				status: true,
				price: true,
				reservedBy: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.reservation.findMany({
			where: {
				createdAt: { gte: start, lte: end },
				...(reservationStatus !== "ALL" ? { status: reservationStatus as "PENDING" | "CONFIRMED" | "EXPIRED" } : {}),
				...(roleFilter !== "ALL" ? { user: { role: roleFilter as "EXHIBITOR" | "SPONSOR" | "ADMIN" } } : {}),
			},
			include: {
				user: { select: { id: true, companyName: true, role: true } },
				booth: { select: { id: true, name: true, status: true, audience: true } },
				invoice: { select: { id: true, invoiceNumber: true, status: true, totalAmount: true } },
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.invoice.findMany({
			where: {
				createdAt: { gte: start, lte: end },
				...(invoiceStatus !== "ALL" ? { status: invoiceStatus as "UNPAID" | "PENDING_VERIFICATION" | "PAID" | "REJECTED" } : {}),
				...(roleFilter !== "ALL" || sponsorLevel !== "ALL" || exhibitorCategory !== "ALL"
					? {
							user: {
								...(roleFilter !== "ALL" ? { role: roleFilter as "EXHIBITOR" | "SPONSOR" | "ADMIN" } : {}),
								...(sponsorLevel !== "ALL" ? { sponsorLevel: sponsorLevel as "PLATINUM" | "GOLD" | "SILVER" | "BRONZE" } : {}),
								...(exhibitorCategory !== "ALL"
									? {
											OR: [{ category: exhibitorCategory as never }, { exhibitorCategory: exhibitorCategory as never }],
										}
									: {}),
							},
						}
					: {}),
			},
			include: {
				user: { select: { id: true, companyName: true, role: true, sponsorLevel: true, category: true, exhibitorCategory: true } },
				items: { select: { id: true, price: true, booth: { select: { name: true } } } },
				payments: { select: { id: true, status: true, method: true, submittedAt: true } },
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.payment.findMany({
			where: {
				submittedAt: { gte: start, lte: end },
				...(paymentStatus !== "ALL" ? { status: paymentStatus as "SUBMITTED" | "VERIFIED" | "REJECTED" } : {}),
				...(roleFilter !== "ALL" ? { invoice: { user: { role: roleFilter as "EXHIBITOR" | "SPONSOR" | "ADMIN" } } } : {}),
			},
			include: {
				invoice: {
					select: {
						id: true,
						invoiceNumber: true,
						totalAmount: true,
						status: true,
						user: { select: { companyName: true, role: true } },
					},
				},
			},
			orderBy: { submittedAt: "desc" },
		}),
	]);

	const attendees = await prismaDb.attendeeRegistration.findMany({
		where: {
			createdAt: { gte: start, lte: end },
			...(attendeeStatus !== "ALL" ? { status: attendeeStatus } : {}),
			...(attendeeType !== "ALL" ? { attendeeType } : {}),
		},
		orderBy: { createdAt: "desc" },
	});

	const feedback = await prismaDb.feedbackSubmission.findMany({
		where: {
			createdAt: { gte: start, lte: end },
			...(feedbackStatus !== "ALL" ? { status: feedbackStatus } : {}),
			...(feedbackCategory !== "ALL" ? { category: feedbackCategory } : {}),
		},
		orderBy: { createdAt: "desc" },
	});

	const exhibitors = users
		.filter((u) => u.role === "EXHIBITOR")
		.filter((u) => {
			if (exhibitorCategory === "ALL") return true;
			return u.category === exhibitorCategory || u.exhibitorCategory === exhibitorCategory;
		});

	const sponsors = users
		.filter((u) => u.role === "SPONSOR")
		.filter((u) => {
			if (sponsorLevel === "ALL") return true;
			return u.sponsorLevel === sponsorLevel;
		});

	const invoicesTotal = invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
	const collectedRevenue = invoices.filter((invoice) => invoice.status === "PAID").reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
	const pendingRevenue = invoices.filter((invoice) => invoice.status === "UNPAID" || invoice.status === "PENDING_VERIFICATION").reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
	const rejectedRevenueCandidates = invoices.filter((invoice) => invoice.status === "REJECTED").reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);

	const breakdowns = {
		sponsorsByLevel: toDistribution(sponsors.map((s) => s.sponsorLevel || "UNSPECIFIED")),
		exhibitorsByCategory: toDistribution(exhibitors.map((e) => e.exhibitorCategory || e.category || "UNSPECIFIED")),
		boothStatusDistribution: toDistribution(booths.map((booth) => getBoothStatusTheme(booth.status).label.toUpperCase())),
		invoiceStatusDistribution: toDistribution(invoices.map((invoice) => invoice.status)),
		paymentStatusDistribution: toDistribution(payments.map((payment) => payment.status)),
		feedbackByCategory: toDistribution(feedback.map((entry: { category?: string | null }) => entry.category || "UNSPECIFIED")),
	};

	const kpis = {
		totalExhibitors: exhibitors.length,
		totalSponsors: sponsors.length,
		totalAttendees: attendees.length,
		totalFeedback: feedback.length,
		totalBooths: booths.length,
		availableBooths: booths.filter((booth) => booth.status === "AVAILABLE").length,
		reservedBooths: booths.filter((booth) => booth.status === "RESERVED").length,
		paymentSubmittedBooths: booths.filter((booth) => booth.status === "PAYMENT_SUBMITTED").length,
		confirmedBooths: booths.filter((booth) => booth.status === "CONFIRMED").length,
		totalInvoices: invoices.length,
		paidInvoices: invoices.filter((invoice) => invoice.status === "PAID").length,
		unpaidInvoices: invoices.filter((invoice) => invoice.status === "UNPAID").length,
		pendingVerificationInvoices: invoices.filter((invoice) => invoice.status === "PENDING_VERIFICATION").length,
		rejectedInvoices: invoices.filter((invoice) => invoice.status === "REJECTED").length,
		totalPaymentSubmissions: payments.length,
		verifiedPayments: payments.filter((payment) => payment.status === "VERIFIED").length,
		rejectedPayments: payments.filter((payment) => payment.status === "REJECTED").length,
		collectedRevenue,
		pendingRevenue,
		rejectedRevenueCandidates,
		invoicesTotal,
	};

	const trends = {
		registrationsOverTime: buildDaySeries(users, start, end),
		attendeeRegistrationsOverTime: buildDaySeries(attendees, start, end),
	};

	const summary = createExecutiveSummary({
		kpis,
		breakdowns,
		trends,
		dateRangeLabel: `${asDay(start)} to ${asDay(end)}`,
	});

	const filters = {
		startDate: asDay(start),
		endDate: asDay(end),
		userRole: roleFilter,
		sponsorLevel,
		exhibitorCategory,
		boothAudience,
		boothStatus,
		reservationStatus,
		invoiceStatus,
		paymentStatus,
		feedbackStatus,
		feedbackCategory,
		attendeeStatus,
		attendeeType,
	};

	return NextResponse.json({
		generatedAt: new Date().toISOString(),
		generatedBy: user.email,
		filters,
		kpis,
		breakdowns,
		trends,
		summary,
		tables: {
			exhibitors,
			sponsors,
			booths,
			reservations,
			invoices,
			payments,
			attendees,
			feedback,
		},
		metadata: {
			totalRecordsIncluded: exhibitors.length + sponsors.length + booths.length + reservations.length + invoices.length + payments.length + attendees.length + feedback.length,
		},
	});
}
