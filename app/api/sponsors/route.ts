import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

const SPONSOR_LEVELS = ["PLATINUM", "GOLD", "SILVER", "BRONZE"] as const;

export async function GET() {
	try {
		const sponsors = await prisma.user.findMany({
			where: { role: "SPONSOR" },
			select: {
				id: true,
				name: true,
				email: true,
				companyName: true,
				phone: true,
				website: true,
				logoUrl: true,
				description: true,
				sponsorLevel: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json(sponsors);
	} catch (error) {
		console.error("Failed to fetch sponsors:", error);
		return NextResponse.json({ error: "Failed to fetch sponsors" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();

		const companyName = formData.get("companyName") as string;
		const contactPerson = formData.get("contactPerson") as string;
		const email = formData.get("email") as string;
		const phone = formData.get("phone") as string;
		const password = formData.get("password") as string;
		const sponsorLevel = formData.get("sponsorLevel") as string;
		const website = formData.get("website") as string;
		const description = formData.get("description") as string;
		const logo = formData.get("logo") as File | null;

		if (!companyName || !contactPerson || !email || !phone || !password || !website || !description || !sponsorLevel) {
			return NextResponse.json({ error: "All fields are required" }, { status: 400 });
		}

		if (!SPONSOR_LEVELS.includes(sponsorLevel as (typeof SPONSOR_LEVELS)[number])) {
			return NextResponse.json({ error: "Invalid sponsor level selected" }, { status: 400 });
		}

		if (!logo || !(logo instanceof File)) {
			return NextResponse.json({ error: "Logo file is required" }, { status: 400 });
		}

		// Validate file type
		const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
		if (!allowedTypes.includes(logo.type)) {
			return NextResponse.json({ error: "Invalid file type. Allowed: PNG, JPG, SVG" }, { status: 400 });
		}

		// Validate file size (5MB)
		if (logo.size > 5 * 1024 * 1024) {
			return NextResponse.json({ error: "File too large. Maximum size is 5MB" }, { status: 400 });
		}

		if (!password || password.length < 8) {
			return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return NextResponse.json({ error: "A registration with this email already exists" }, { status: 409 });
		}

		// Save the logo file
		const ext = path.extname(logo.name) || ".png";
		const filename = `${randomUUID()}${ext}`;
		const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
		await mkdir(uploadDir, { recursive: true });

		const bytes = new Uint8Array(await logo.arrayBuffer());
		await writeFile(path.join(uploadDir, filename), bytes);

		const logoUrl = `/uploads/logos/${filename}`;

		const hashedPassword = await bcrypt.hash(password, 10);

		const sponsor = await prisma.user.create({
			data: {
				name: contactPerson,
				companyName,
				email,
				phone,
				password: hashedPassword,
				website,
				description,
				sponsorLevel: sponsorLevel as "PLATINUM" | "GOLD" | "SILVER" | "BRONZE",
				logoUrl,
				role: "SPONSOR",
			},
		});

		const token = await createSession({
			id: sponsor.id,
			email: sponsor.email,
			companyName: sponsor.companyName,
			role: sponsor.role,
		});

		const response = NextResponse.json({ id: sponsor.id, companyName: sponsor.companyName }, { status: 201 });
		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7,
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Failed to register sponsor:", error);
		return NextResponse.json({ error: "Failed to register sponsor" }, { status: 500 });
	}
}
