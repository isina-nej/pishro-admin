import { NextResponse } from 'next/server';

export async function GET() {
  // Temporary debug route removed — return 404 to avoid exposing env details in production
  return NextResponse.json({ message: 'Not Found' }, { status: 404 });
}
