import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const reservations = await prisma.reservation.findMany({
		include: {
			user: { select: { id: true, companyName: true, email: true, role: true } },
			booth: { select: { id: true, name: true, section: true, audience: true, status: true } },
			invoice: { select: { id: true, invoiceNumber: true, status: true, totalAmount: true } },
		},
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json(reservations);
}
