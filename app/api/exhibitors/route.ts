import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function GET() {
	try {
		const exhibitors = await prisma.user.findMany({
			where: { role: "EXHIBITOR" },
			select: {
				id: true,
				name: true,
				email: true,
				companyName: true,
				phone: true,
				category: true,
				description: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json(exhibitors);
	} catch (error) {
		console.error("Failed to fetch exhibitors:", error);
		return NextResponse.json({ error: "Failed to fetch exhibitors" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { companyName, contactPerson, email, phone, password, category, description } = body;

		if (!companyName || !contactPerson || !email || !phone || !password || !category || !description) {
			return NextResponse.json({ error: "All fields are required" }, { status: 400 });
		}

		if (password.length < 8) {
			return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return NextResponse.json({ error: "A registration with this email already exists" }, { status: 409 });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const exhibitor = await prisma.user.create({
			data: {
				name: contactPerson,
				companyName,
				email,
				phone,
				password: hashedPassword,
				category,
				description,
				role: "EXHIBITOR",
			},
		});

		const token = await createSession({
			id: exhibitor.id,
			email: exhibitor.email,
			companyName: exhibitor.companyName,
			role: exhibitor.role,
		});

		const response = NextResponse.json({ id: exhibitor.id, companyName: exhibitor.companyName }, { status: 201 });
		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7,
			path: "/",
		});
		return response;
	} catch (error) {
		console.error("Failed to register exhibitor:", error);
		return NextResponse.json({ error: "Failed to register exhibitor" }, { status: 500 });
	}
}
