/**
 * Get the base URL for the main pishro2 application (for file uploads)
 * Used by pishro-admin2 to reference pishro2 resources
 */
export function getPishro2BaseUrl(): string {
  // Use environment variable if available
  if (process.env.NEXT_PUBLIC_FILE_UPLOAD_URL) {
    return process.env.NEXT_PUBLIC_FILE_UPLOAD_URL;
  }

  // Client-side fallback
  if (typeof window !== "undefined") {
    // For local development
    return "http://localhost:3000";
  }

  // Server-side fallback
  return "http://localhost:3000";
}

/**
 * Get full URL for a pishro2 resource
 */
export function getPishro2ResourceUrl(path: string): string {
  const baseUrl = getPishro2BaseUrl();
  if (path.startsWith("http")) {
    return path;
  }
  return `${baseUrl}${path.startsWith("/") ? path : "/" + path}`;
}
