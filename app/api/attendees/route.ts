import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ATTENDEE_TYPES = ["FARMER", "STUDENT", "RESEARCHER", "INVESTOR", "GOVERNMENT", "OTHER"] as const;

export async function POST(request: NextRequest) {
	try {
		const prismaDb = prisma as any;
		const body = await request.json();

		const fullName = String(body.fullName || "").trim();
		const email = String(body.email || "")
			.trim()
			.toLowerCase();
		const phone = String(body.phone || "").trim();
		const attendeeType = String(body.attendeeType || "")
			.trim()
			.toUpperCase();
		const organization = String(body.organization || "").trim();
		const county = String(body.county || "").trim();
		const interests = String(body.interests || "").trim();
		const notes = String(body.notes || "").trim();

		if (!fullName || !email || !phone || !attendeeType) {
			return NextResponse.json({ error: "Full name, email, phone, and attendee type are required" }, { status: 400 });
		}

		if (!ATTENDEE_TYPES.includes(attendeeType as (typeof ATTENDEE_TYPES)[number])) {
			return NextResponse.json({ error: "Invalid attendee type selected" }, { status: 400 });
		}

		if (!/^\S+@\S+\.\S+$/.test(email)) {
			return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
		}

		if (fullName.length < 3) {
			return NextResponse.json({ error: "Full name must be at least 3 characters" }, { status: 400 });
		}

		const attendee = await prismaDb.attendeeRegistration.create({
			data: {
				fullName,
				email,
				phone,
				organization: organization || null,
				county: county || null,
				attendeeType,
				interests: interests || null,
				notes: notes || null,
			},
			select: {
				id: true,
				fullName: true,
			},
		});

		return NextResponse.json(attendee, { status: 201 });
	} catch (error) {
		console.error("Failed to save attendee registration:", error);
		return NextResponse.json({ error: "Failed to submit attendee registration" }, { status: 500 });
	}
}
