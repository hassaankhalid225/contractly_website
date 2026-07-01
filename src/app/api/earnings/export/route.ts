import { getCurrentUser } from "@/lib/auth";
import { earningsCsv } from "@/modules/earnings/service";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const csv = await earningsCsv(user.id);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="contractly-earnings-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
