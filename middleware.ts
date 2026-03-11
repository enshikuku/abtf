import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

const protectedRoutes = ["/booths", "/invoice-preview", "/payment-proof"];
const adminRoutes = ["/admin"];
const authPages = ["/login", "/register-exhibitor", "/register-sponsor"];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("token")?.value;

	let user: { id: string; role: string } | null = null;
	if (token) {
		try {
			const { payload } = await jwtVerify(token, secret);
			user = payload as unknown as { id: string; role: string };
		} catch {
			// invalid token
		}
	}

	// Redirect authenticated users away from auth pages
	if (user && authPages.some((r) => pathname === r)) {
		return NextResponse.redirect(new URL("/booths", request.url));
	}

	// Protect user routes
	if (protectedRoutes.some((r) => pathname.startsWith(r)) && !user) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Protect admin routes
	if (pathname.startsWith("/admin")) {
		if (!user) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
		if (user.role !== "ADMIN") {
			return NextResponse.redirect(new URL("/", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/booths/:path*", "/invoice-preview/:path*", "/payment-proof/:path*", "/admin/:path*", "/login", "/register-exhibitor", "/register-sponsor"],
};
