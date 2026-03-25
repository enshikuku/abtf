import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const ALLOWED_STATUSES = ["REGISTERED", "CONTACTED", "CONFIRMED", "ARCHIVED"] as const;

export async function GET(request: NextRequest) {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	const prismaDb = prisma as any;

	const { searchParams } = new URL(request.url);
	const status = (searchParams.get("status") || "ALL").toUpperCase();
	const q = (searchParams.get("q") || "").trim();

	const attendees = await prismaDb.attendeeRegistration.findMany({
		where: {
			...(status !== "ALL" ? { status } : {}),
			...(q
				? {
						OR: [{ fullName: { contains: q } }, { email: { contains: q } }, { phone: { contains: q } }, { organization: { contains: q } }],
					}
				: {}),
		},
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json(attendees);
}

export async function PATCH(request: NextRequest) {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}
	const prismaDb = prisma as any;

	const body = await request.json();
	const attendeeId = String(body.attendeeId || "").trim();
	const status = String(body.status || "")
		.trim()
		.toUpperCase();

	if (!attendeeId || !status) {
		return NextResponse.json({ error: "Attendee ID and status are required" }, { status: 400 });
	}

	if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
		return NextResponse.json({ error: "Invalid status" }, { status: 400 });
	}

	await prismaDb.attendeeRegistration.update({
		where: { id: attendeeId },
		data: { status },
	});

	return NextResponse.json({ success: true });
}
