import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const [totalExhibitors, totalSponsors, totalBooths, reservedBooths, confirmedBooths, paidInvoices, pendingPayments] = await Promise.all([prisma.user.count({ where: { role: "EXHIBITOR" } }), prisma.user.count({ where: { role: "SPONSOR" } }), prisma.booth.count(), prisma.booth.count({ where: { status: "RESERVED" } }), prisma.booth.count({ where: { status: "CONFIRMED" } }), prisma.invoice.count({ where: { status: "PAID" } }), prisma.payment.count({ where: { status: "SUBMITTED" } })]);

	return NextResponse.json({
		totalExhibitors,
		totalSponsors,
		totalBooths,
		reservedBooths,
		confirmedBooths,
		availableBooths: totalBooths - reservedBooths - confirmedBooths,
		paidInvoices,
		pendingPayments,
	});
}
