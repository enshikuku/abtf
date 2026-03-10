import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Invoices API endpoint",
    endpoints: {
      "GET /api/invoices": "List all invoices",
      "POST /api/invoices": "Create an invoice",
    },
  });
}

export async function POST() {
  return NextResponse.json(
    { message: "Invoice creation endpoint - coming soon" },
    { status: 501 }
  );
}
