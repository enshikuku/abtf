import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const invoices = await prisma.invoice.findMany({
		include: {
			user: { select: { id: true, name: true, companyName: true, email: true } },
			items: { include: { booth: { select: { name: true, section: true } } } },
			payments: {
				select: { id: true, status: true, method: true, submittedAt: true },
				orderBy: { submittedAt: "desc" },
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json(invoices);
}
