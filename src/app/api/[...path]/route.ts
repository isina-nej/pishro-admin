import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://pishro-0.vercel.app/api";

/**
 * Generic API proxy route that forwards all requests to the backend
 * This handles all endpoints except those with specific route handlers
 * (like /api/auth/login, /api/auth/session, etc.)
 */
async function handleRequest(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const path = params.path.join("/");
    const backendUrl = `${BACKEND_URL}/${path}`;

    // Get cookies and other headers from the incoming request
    const cookieHeader = request.headers.get("cookie");
    const contentType = request.headers.get("content-type");

    // Prepare headers
    const headers: HeadersInit = {
      ...(contentType && { "Content-Type": contentType }),
      ...(cookieHeader && { Cookie: cookieHeader }),
    };

    // Get request body if it exists (for POST, PUT, PATCH)
    let body: any = null;
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        body = await request.text();
      } catch {
        // No body or already consumed
      }
    }

    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      ...(body && { body }),
      credentials: "include",
    });

    // Get response data
    const data = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = data;
    }

    // Get cookies from backend response
    const setCookieHeader = response.headers.get("set-cookie");

    // Create response
    const nextResponse = NextResponse.json(jsonData, {
      status: response.status,
    });

    // Forward cookies to the client
    if (setCookieHeader) {
      nextResponse.headers.set("set-cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error("API proxy error:", error);
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

// Export handlers for all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const HEAD = handleRequest;
export const OPTIONS = handleRequest;
