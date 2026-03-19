import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// Release expired reservations helper
async function releaseExpiredReservations() {
	const now = new Date();
	await prisma.booth.updateMany({
		where: {
			status: "RESERVED",
			reservedUntil: { lt: now },
		},
		data: {
			status: "AVAILABLE",
			reservedBy: null,
			reservedUntil: null,
		},
	});
	await prisma.reservation.updateMany({
		where: {
			status: "PENDING",
			booth: { reservedUntil: { lt: now } },
		},
		data: { status: "EXPIRED" },
	});
}

export async function GET() {
	try {
		await releaseExpiredReservations();
		const authUser = await getAuthUser();

		let boothWhere: {
			audience?: "EXHIBITOR" | "SPONSOR";
			sponsorLevel?: "PLATINUM" | "GOLD" | "SILVER" | "BRONZE";
		} = { audience: "EXHIBITOR" };

		if (authUser) {
			if (authUser.role === "SPONSOR") {
				const sponsor = await prisma.user.findUnique({
					where: { id: authUser.id },
					select: { sponsorLevel: true },
				});

				// Backward compatibility for sponsors created before sponsor levels were introduced.
				// If no level is set yet, show all sponsor booths so they can proceed and select one level.
				boothWhere = sponsor?.sponsorLevel ? { audience: "SPONSOR", sponsorLevel: sponsor.sponsorLevel } : { audience: "SPONSOR" };
			} else if (authUser.role === "EXHIBITOR") {
				boothWhere = { audience: "EXHIBITOR" };
			}
		}

		const booths = await prisma.booth.findMany({
			where: boothWhere,
			orderBy: [{ section: "asc" }, { name: "asc" }],
			select: {
				id: true,
				name: true,
				section: true,
				audience: true,
				sponsorLevel: true,
				price: true,
				status: true,
				reservedBy: true,
				reservedUntil: true,
			},
		});
		return NextResponse.json(booths);
	} catch (error) {
		console.error("Failed to fetch booths:", error);
		return NextResponse.json({ error: "Failed to fetch booths" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await getAuthUser();
		if (!user) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		await releaseExpiredReservations();

		const { boothIds } = await request.json();
		if (!Array.isArray(boothIds) || boothIds.length === 0) {
			return NextResponse.json({ error: "Select at least one booth" }, { status: 400 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { id: user.id },
			select: { id: true, role: true, sponsorLevel: true },
		});

		if (!dbUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		if (dbUser.role === "ADMIN") {
			return NextResponse.json({ error: "Admin accounts cannot reserve booths" }, { status: 403 });
		}

		const roleBoothWhere = dbUser.role === "SPONSOR" ? (dbUser.sponsorLevel ? { audience: "SPONSOR" as const, sponsorLevel: dbUser.sponsorLevel } : { audience: "SPONSOR" as const }) : { audience: "EXHIBITOR" as const };

		// Verify all booths are available
		const booths = await prisma.booth.findMany({
			where: { id: { in: boothIds }, status: "AVAILABLE", ...roleBoothWhere },
		});

		if (booths.length !== boothIds.length) {
			return NextResponse.json({ error: "Some selected booths are unavailable or not eligible for your registration type" }, { status: 409 });
		}

		if (dbUser.role === "SPONSOR") {
			const selectedLevels = [...new Set(booths.map((b) => b.sponsorLevel).filter(Boolean))];

			if (selectedLevels.length !== 1) {
				return NextResponse.json({ error: "Please select booths from one sponsor category only (Platinum, Gold, Silver, or Bronze)." }, { status: 400 });
			}

			if (!dbUser.sponsorLevel && selectedLevels.length === 1) {
				await prisma.user.update({
					where: { id: dbUser.id },
					data: { sponsorLevel: selectedLevels[0] },
				});
			}

			if (dbUser.sponsorLevel && selectedLevels[0] !== dbUser.sponsorLevel) {
				return NextResponse.json({ error: `Your account is registered under ${dbUser.sponsorLevel}. Please select only ${dbUser.sponsorLevel} sponsor booths.` }, { status: 400 });
			}
		}

		const reservedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		// Calculate total
		let total = 0;
		for (const b of booths) {
			total += Number(b.price);
		}

		// Generate invoice number
		const count = await prisma.invoice.count();
		const invoiceNumber = `INV-2026-${String(count + 1).padStart(4, "0")}`;

		// Create invoice, items, reservations, and update booths in a transaction
		const invoice = await prisma.$transaction(async (tx) => {
			const inv = await tx.invoice.create({
				data: {
					invoiceNumber,
					userId: user.id,
					totalAmount: total,
					status: "UNPAID",
					items: {
						create: booths.map((b) => ({
							boothId: b.id,
							price: b.price,
						})),
					},
				},
				include: { items: { include: { booth: true } } },
			});

			// Create reservations and update booths
			for (const b of booths) {
				await tx.reservation.create({
					data: {
						userId: user.id,
						boothId: b.id,
						invoiceId: inv.id,
						status: "PENDING",
					},
				});
				await tx.booth.update({
					where: { id: b.id },
					data: {
						status: "RESERVED",
						reservedBy: user.id,
						reservedUntil,
					},
				});
			}

			return inv;
		});

		return NextResponse.json(invoice, { status: 201 });
	} catch (error) {
		console.error("Failed to reserve booths:", error);
		return NextResponse.json({ error: "Failed to reserve booths" }, { status: 500 });
	}
}
