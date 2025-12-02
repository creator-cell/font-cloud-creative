import { redirect } from "next/navigation";
import { auth } from "@/lib/session";

export const requireServerRole = async (allowed: string[], options?: { redirectTo?: string }) => {
  const session = await auth();
  if (!session?.user.roles?.some((role) => allowed.includes(role))) {
    redirect(options?.redirectTo ?? "/dashboard");
  }
  return session;
};
