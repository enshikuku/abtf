import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
	const user = await getAuthUser();
	if (user?.sessionId) {
		await prisma.session.delete({ where: { id: user.sessionId } }).catch(() => {});
	}

	const response = NextResponse.json({ success: true });
	response.cookies.set("token", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	});
	return response;
}
