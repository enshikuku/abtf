import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	try {
		const authUser = await getAuthUser();
		if (!authUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: authUser.id },
			select: {
				id: true,
				name: true,
				companyName: true,
				email: true,
				phone: true,
				role: true,
				category: true,
				exhibitorCategory: true,
				sponsorLevel: true,
				logoUrl: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const booths = await prisma.booth.findMany({
			where: { reservedBy: user.id },
			select: {
				id: true,
				name: true,
				section: true,
				audience: true,
				sponsorLevel: true,
				price: true,
				status: true,
				reservedUntil: true,
			},
			orderBy: [{ section: "asc" }, { name: "asc" }],
		});

		const invoices = await prisma.invoice.findMany({
			where: { userId: user.id },
			include: {
				items: { include: { booth: { select: { name: true, section: true, audience: true, sponsorLevel: true } } } },
				payments: {
					orderBy: { submittedAt: "desc" },
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json({ user, booths, invoices });
	} catch (error) {
		console.error("Dashboard fetch failed:", error);
		return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
	}
}
