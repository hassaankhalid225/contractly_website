import { NextRequest } from "next/server";
import { getFile } from "@/lib/storage";

/**
 * Serves stored files (uploaded contracts, signed PDFs). Keys are unguessable
 * random paths, and signed-copy links are shared with the client by email, so
 * access is by-possession-of-key. (For stricter control, gate upload keys on the
 * authenticated owner — see README → Security.)
 */
export async function GET(_req: NextRequest, { params }: { params: { key: string[] } }) {
  const key = params.key.join("/");
  const file = await getFile(key);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.data as BodyInit, {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `inline; filename="${key.split("/").pop()}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
