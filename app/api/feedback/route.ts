import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FEEDBACK_CATEGORIES = ["GENERAL", "REGISTRATION", "BOOTH_BOOKING", "PAYMENT", "EVENT_EXPERIENCE", "OTHER"] as const;

export async function POST(request: NextRequest) {
	try {
		const prismaDb = prisma as any;
		const body = await request.json();

		const fullName = String(body.fullName || "").trim();
		const email = String(body.email || "")
			.trim()
			.toLowerCase();
		const phone = String(body.phone || "").trim();
		const category = String(body.category || "")
			.trim()
			.toUpperCase();
		const subject = String(body.subject || "").trim();
		const message = String(body.message || "").trim();

		if (!fullName || !category || !subject || !message) {
			return NextResponse.json({ error: "Full name, category, subject, and message are required" }, { status: 400 });
		}

		if (!FEEDBACK_CATEGORIES.includes(category as (typeof FEEDBACK_CATEGORIES)[number])) {
			return NextResponse.json({ error: "Invalid feedback category selected" }, { status: 400 });
		}

		if (email && !/^\S+@\S+\.\S+$/.test(email)) {
			return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
		}

		if (message.length < 10) {
			return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 });
		}

		const submission = await prismaDb.feedbackSubmission.create({
			data: {
				fullName,
				email: email || null,
				phone: phone || null,
				category,
				subject,
				message,
			},
			select: {
				id: true,
				subject: true,
			},
		});

		return NextResponse.json(submission, { status: 201 });
	} catch (error) {
		console.error("Failed to submit feedback:", error);
		return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
	}
}
