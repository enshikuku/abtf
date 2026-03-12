import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export interface AuthUser {
	id: string;
	email: string;
	companyName: string;
	role: string;
	sessionId: string;
}

export async function createSession(user: { id: string; email: string; companyName: string; role: string }): Promise<string> {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const session = await prisma.session.create({
		data: { userId: user.id, expiresAt },
	});
	return new SignJWT({ id: user.id, email: user.email, companyName: user.companyName, role: user.role, sessionId: session.id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload as unknown as AuthUser;
	} catch {
		return null;
	}
}

export async function getAuthUser(): Promise<AuthUser | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	if (!token) return null;
	const user = await verifyToken(token);
	if (!user?.sessionId) return null;

	// Validate session exists in DB
	const session = await prisma.session.findUnique({ where: { id: user.sessionId } });
	if (!session || session.expiresAt < new Date()) return null;

	return user;
}

export async function getAuthUserWithDb() {
	const authUser = await getAuthUser();
	if (!authUser) return null;
	const user = await prisma.user.findUnique({
		where: { id: authUser.id },
		select: {
			id: true,
			name: true,
			companyName: true,
			email: true,
			phone: true,
			role: true,
			category: true,
			logoUrl: true,
		},
	});
	return user;
}

export function setTokenCookie(response: Response, token: string) {
	(response as any).cookies?.set?.("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7,
		path: "/",
	});
}
