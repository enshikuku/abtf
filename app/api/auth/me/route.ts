import { NextResponse } from "next/server";
import { getAuthUserWithDb } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUserWithDb();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      companyName: user.companyName,
      role: user.role,
    },
  });
}
