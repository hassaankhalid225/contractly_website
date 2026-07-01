import "server-only";
import { prisma } from "@/lib/prisma";

/** Active, non-expired announcements (shown to users as banners). */
export function activeAnnouncements() {
  const now = new Date();
  return prisma.announcement.findMany({
    where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

/** All announcements (admin). */
export function listAnnouncements() {
  return prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
}
