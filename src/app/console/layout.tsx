import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-session";
import { ConsoleShell } from "@/components/console/console-shell";

export default async function ConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login?next=/console");
  }

  return <ConsoleShell userName={session.name}>{children}</ConsoleShell>;
}
