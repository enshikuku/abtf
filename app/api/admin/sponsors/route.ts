import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const sponsors = await prisma.user.findMany({
		where: { role: "SPONSOR" },
		select: {
			id: true,
			name: true,
			email: true,
			companyName: true,
			phone: true,
			sponsorLevel: true,
			website: true,
			logoUrl: true,
			description: true,
			createdAt: true,
			booths: {
				select: { id: true, name: true, section: true, status: true, audience: true, sponsorLevel: true },
			},
			invoices: {
				select: { id: true, invoiceNumber: true, totalAmount: true, status: true },
				orderBy: { createdAt: "desc" },
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json(sponsors);
}
