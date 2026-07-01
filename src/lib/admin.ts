import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

/** Guard for admin-only server components and actions. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}
