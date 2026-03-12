import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const payments = await prisma.payment.findMany({
		include: {
			invoice: {
				include: {
					user: { select: { id: true, name: true, companyName: true, email: true } },
					items: { include: { booth: true } },
				},
			},
		},
		orderBy: { submittedAt: "desc" },
	});

	return NextResponse.json(payments);
}

export async function PATCH(request: NextRequest) {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const { paymentId, action } = await request.json();
	if (!paymentId || !["VERIFIED", "REJECTED"].includes(action)) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	const payment = await prisma.payment.findUnique({
		where: { id: paymentId },
		include: { invoice: { include: { items: true, reservations: true } } },
	});

	if (!payment) {
		return NextResponse.json({ error: "Payment not found" }, { status: 404 });
	}

	if (action === "VERIFIED") {
		await prisma.$transaction(async (tx) => {
			await tx.payment.update({
				where: { id: paymentId },
				data: { status: "VERIFIED" },
			});
			await tx.invoice.update({
				where: { id: payment.invoiceId },
				data: { status: "PAID" },
			});
			// Confirm all booths in the invoice
			const boothIds = payment.invoice.items.map((i) => i.boothId);
			await tx.booth.updateMany({
				where: { id: { in: boothIds } },
				data: { status: "CONFIRMED", reservedUntil: null },
			});
			// Confirm reservations
			await tx.reservation.updateMany({
				where: { invoiceId: payment.invoiceId },
				data: { status: "CONFIRMED" },
			});
		});
	} else {
		await prisma.$transaction(async (tx) => {
			await tx.payment.update({
				where: { id: paymentId },
				data: { status: "REJECTED" },
			});
			await tx.invoice.update({
				where: { id: payment.invoiceId },
				data: { status: "UNPAID" },
			});
			// Revert booth statuses from PAYMENT_SUBMITTED back to RESERVED
			const boothIds = payment.invoice.items.map((i) => i.boothId);
			await tx.booth.updateMany({
				where: { id: { in: boothIds }, status: "PAYMENT_SUBMITTED" },
				data: { status: "RESERVED" },
			});
		});
	}

	return NextResponse.json({ success: true });
}
