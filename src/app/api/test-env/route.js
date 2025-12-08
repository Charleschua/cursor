import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    nextauthUrl: process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
  });
}

