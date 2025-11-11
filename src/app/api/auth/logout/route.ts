import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://pishro-0.vercel.app/api";

export async function POST(request: NextRequest) {
  try {
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get("cookie");

    // Forward the request to the actual backend with cookies
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
    });

    const data = await response.json();

    // Get cookies from backend response (to clear session)
    const setCookieHeader = response.headers.get("set-cookie");

    // Create response
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Forward cookie clearing to the client
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("Logout proxy error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "خطا در خروج از سیستم",
        data: null,
      },
      { status: 500 },
    );
  }
}
