import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
	const user = await getAuthUser();
	if (!user || user.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			companyName: true,
			phone: true,
			category: true,
			createdAt: true,
			_count: {
				select: {
					booths: true,
					invoices: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json(users);
}

export async function PATCH(request: NextRequest) {
	const currentUser = await getAuthUser();
	if (!currentUser || currentUser.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const body = await request.json();
	const { userId, action, role } = body;

	if (!userId) {
		return NextResponse.json({ error: "User ID required" }, { status: 400 });
	}

	if (action === "changeRole") {
		if (!["EXHIBITOR", "SPONSOR", "ADMIN"].includes(role)) {
			return NextResponse.json({ error: "Invalid role" }, { status: 400 });
		}
		if (userId === currentUser.id) {
			return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
		}
		await prisma.user.update({
			where: { id: userId },
			data: { role },
		});
		return NextResponse.json({ success: true });
	}

	return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
	const currentUser = await getAuthUser();
	if (!currentUser || currentUser.role !== "ADMIN") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");

	if (!userId) {
		return NextResponse.json({ error: "User ID required" }, { status: 400 });
	}

	if (userId === currentUser.id) {
		return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
	}

	const targetUser = await prisma.user.findUnique({ where: { id: userId } });
	if (!targetUser) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	await prisma.user.delete({ where: { id: userId } });
	return NextResponse.json({ success: true });
}
