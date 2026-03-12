import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
		}

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
		}

		const token = await createSession({
			id: user.id,
			email: user.email,
			companyName: user.companyName,
			role: user.role,
		});

		const response = NextResponse.json({
			user: {
				id: user.id,
				email: user.email,
				companyName: user.companyName,
				role: user.role,
			},
		});

		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Login failed:", error);
		return NextResponse.json({ error: "Login failed" }, { status: 500 });
	}
}
