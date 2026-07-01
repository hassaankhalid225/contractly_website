import { requireUser } from "@/lib/session";
import { AppShell } from "@/components/layout/app-shell";
import { upcomingCount } from "@/modules/reminders/repository";
import { activeAnnouncements } from "@/modules/announcements/service";
import { prisma } from "@/lib/prisma";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [reminders, contracts, announcements] = await Promise.all([
    upcomingCount(user.id),
    prisma.contract.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, clientName: true },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    activeAnnouncements(),
  ]);

  return (
    <AppShell
      user={{ name: user.name, email: user.email, photoUrl: user.photoUrl, plan: user.plan, isAdmin: user.role === "admin" }}
      reminderCount={reminders}
      contracts={contracts}
      announcements={announcements.map((a) => ({ id: a.id, title: a.title, body: a.body, type: a.type }))}
    >
      {children}
    </AppShell>
  );
}
