import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://pishro-0.vercel.app/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the actual backend
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    // Get cookies from backend response
    const setCookieHeader = response.headers.get("set-cookie");

    // Create response with the data
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    // Forward cookies to the client
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "خطا در برقراری ارتباط با سرور",
        data: null,
      },
      { status: 500 },
    );
  }
}
