import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://pishro-0.vercel.app/api";

export async function GET(request: NextRequest) {
  try {
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get("cookie");

    // Forward the request to the actual backend with cookies
    const response = await fetch(`${BACKEND_URL}/auth/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Session proxy error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "خطا در بررسی سشن",
        data: null,
      },
      { status: 500 },
    );
  }
}
