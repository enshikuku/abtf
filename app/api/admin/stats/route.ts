import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const [totalExhibitors, totalSponsors, totalBooths, totalExhibitorBooths, totalSponsorBooths, reservedBooths, paymentSubmittedBooths, confirmedBooths, paidInvoices, pendingPayments, totalUsers, verifiedPayments] = await Promise.all([prisma.user.count({ where: { role: "EXHIBITOR" } }), prisma.user.count({ where: { role: "SPONSOR" } }), prisma.booth.count(), prisma.booth.count({ where: { audience: "EXHIBITOR" } }), prisma.booth.count({ where: { audience: "SPONSOR" } }), prisma.booth.count({ where: { status: "RESERVED" } }), prisma.booth.count({ where: { status: "PAYMENT_SUBMITTED" } }), prisma.booth.count({ where: { status: "CONFIRMED" } }), prisma.invoice.count({ where: { status: "PAID" } }), prisma.payment.count({ where: { status: "SUBMITTED" } }), prisma.user.count(), prisma.payment.count({ where: { status: "VERIFIED" } })]);

	return NextResponse.json({
		totalExhibitors,
		totalSponsors,
		totalBooths,
		totalExhibitorBooths,
		totalSponsorBooths,
		reservedBooths,
		paymentSubmittedBooths,
		confirmedBooths,
		availableBooths: totalBooths - reservedBooths - paymentSubmittedBooths - confirmedBooths,
		paidInvoices,
		pendingPayments,
		totalUsers,
		verifiedPayments,
	});
}
