import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Booths API endpoint",
    endpoints: {
      "GET /api/booths": "List all booths",
      "POST /api/booths": "Reserve a booth",
    },
  });
}

export async function POST() {
  return NextResponse.json(
    { message: "Booth reservation endpoint - coming soon" },
    { status: 501 }
  );
}
