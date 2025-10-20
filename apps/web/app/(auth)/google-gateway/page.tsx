import { redirect } from "next/navigation";
import { auth } from "@/lib/session";

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

const resolveNext = (searchParams?: Record<string, string | string[] | undefined>) => {
  const value = searchParams?.next;
  if (!value) {
    return "/dashboard";
  }
  if (Array.isArray(value)) {
    return value[0] ?? "/dashboard";
  }
  try {
    const decoded = decodeURIComponent(value);
    return decoded.startsWith("/") ? decoded : "/dashboard";
  } catch {
    return "/dashboard";
  }
};

export default async function GoogleGatewayPage({ searchParams }: PageProps) {
  const session = await auth();
  const next = resolveNext(searchParams);

  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(next)}`);
  }

  const needsPlan =
    (session.user.provider === "google" || session.user.provider === undefined) &&
    (session.user.plan ?? "free") === "free";

  if (needsPlan) {
    redirect(`/google-onboarding?next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}
