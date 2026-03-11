import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "crypto";

export async function GET() {
	try {
		const user = await getAuthUser();
		if (!user) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		const payments = await prisma.payment.findMany({
			where: { invoice: { userId: user.id } },
			include: { invoice: true },
			orderBy: { submittedAt: "desc" },
		});

		return NextResponse.json(payments);
	} catch (error) {
		console.error("Failed to fetch payments:", error);
		return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await getAuthUser();
		if (!user) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		const formData = await request.formData();
		const invoiceId = formData.get("invoiceId") as string;
		const method = formData.get("method") as string;
		const transactionCode = formData.get("transactionCode") as string | null;
		const notes = formData.get("notes") as string | null;
		const proofImage = formData.get("proofImage") as File | null;

		if (!invoiceId || !method) {
			return NextResponse.json({ error: "Invoice ID and payment method are required" }, { status: 400 });
		}

		if (!["MPESA", "BANK", "OTHER"].includes(method)) {
			return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
		}

		// Verify user owns this invoice
		const invoice = await prisma.invoice.findFirst({
			where: { id: invoiceId, userId: user.id },
		});
		if (!invoice) {
			return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
		}

		let proofImageUrl: string | null = null;

		if (proofImage && proofImage instanceof File && proofImage.size > 0) {
			const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "application/pdf"];
			if (!allowedTypes.includes(proofImage.type)) {
				return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
			}
			if (proofImage.size > 10 * 1024 * 1024) {
				return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
			}

			const ext = path.extname(proofImage.name) || ".png";
			const filename = `${randomUUID()}${ext}`;
			const uploadDir = path.join(process.cwd(), "public", "uploads", "payments");
			await mkdir(uploadDir, { recursive: true });
			const bytes = new Uint8Array(await proofImage.arrayBuffer());
			await writeFile(path.join(uploadDir, filename), bytes);
			proofImageUrl = `/uploads/payments/${filename}`;
		}

		const payment = await prisma.$transaction(async (tx) => {
			const p = await tx.payment.create({
				data: {
					invoiceId,
					method: method as "MPESA" | "BANK" | "OTHER",
					transactionCode: transactionCode || null,
					proofImageUrl,
					notes: notes || null,
					status: "SUBMITTED",
				},
			});

			await tx.invoice.update({
				where: { id: invoiceId },
				data: { status: "PENDING_VERIFICATION" },
			});

			return p;
		});

		return NextResponse.json(payment, { status: 201 });
	} catch (error) {
		console.error("Failed to submit payment:", error);
		return NextResponse.json({ error: "Failed to submit payment" }, { status: 500 });
	}
}
