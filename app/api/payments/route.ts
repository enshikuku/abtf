import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Payments API endpoint",
    endpoints: {
      "GET /api/payments": "List all payments",
      "POST /api/payments": "Submit a payment proof",
    },
  });
}

export async function POST() {
  return NextResponse.json(
    { message: "Payment submission endpoint - coming soon" },
    { status: 501 }
  );
}
