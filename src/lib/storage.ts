import { supabase, STORAGE_BUCKET } from "./supabase";

/**
 * Generate a temporary signed URL to access a file in Supabase Storage.
 * @param filePath  The path stored on the document record (e.g. `eventId/timestamp_filename.pdf`)
 * @param expiresIn Seconds until the URL expires (default 1 hour)
 * @returns A signed URL string, or null if generation fails
 */
export async function getSignedUrl(
  filePath: string,
  expiresIn = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error("Failed to create signed URL:", error.message);
    return null;
  }

  return data.signedUrl;
}

/**
 * Get the public URL for a file in Supabase Storage.
 * Only works if the bucket is configured as public.
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
