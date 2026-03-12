import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const booths = await prisma.booth.findMany({
		include: {
			user: { select: { id: true, name: true, companyName: true, email: true } },
		},
		orderBy: [{ section: "asc" }, { name: "asc" }],
	});

	return NextResponse.json(booths);
}

export async function PATCH(request: NextRequest) {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const { boothId, action } = await request.json();
	if (!boothId || !["release", "confirm"].includes(action)) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	await prisma.$transaction(async (tx) => {
		const booth = await tx.booth.findUnique({ where: { id: boothId } });
		if (!booth) throw new Error("Booth not found");

		if (action === "release") {
			await tx.booth.update({
				where: { id: boothId },
				data: { status: "AVAILABLE", reservedBy: null, reservedUntil: null },
			});

			// Expire any pending reservations for this booth
			await tx.reservation.updateMany({
				where: { boothId, status: "PENDING" },
				data: { status: "EXPIRED" },
			});
		} else if (action === "confirm") {
			await tx.booth.update({
				where: { id: boothId },
				data: { status: "CONFIRMED", reservedUntil: null },
			});

			await tx.reservation.updateMany({
				where: { boothId, status: "PENDING" },
				data: { status: "CONFIRMED" },
			});
		}
	});

	return NextResponse.json({ success: true });
}
