import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	try {
		const user = await getAuthUser();
		if (!user) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		const invoices = await prisma.invoice.findMany({
			where: { userId: user.id },
			include: {
				items: { include: { booth: { select: { id: true, name: true, section: true, audience: true, sponsorLevel: true } } } },
				payments: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(invoices);
	} catch (error) {
		console.error("Failed to fetch invoices:", error);
		return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
	}
}
