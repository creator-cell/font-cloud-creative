import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { GoogleOnboarding } from "@/components/google-onboarding";

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

export default async function GoogleOnboardingPage({ searchParams }: PageProps) {
  const session = await auth();
  const next = resolveNext(searchParams);

  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(next)}`);
  }

  if (session.user.provider !== "google") {
    redirect(next);
  }

  if (session.user.plan !== "free") {
    redirect(next);
  }

  if (!session.apiToken) {
    redirect("/signin");
  }

  return (
    <GoogleOnboarding
      email={session.user.email ?? ""}
      token={session.apiToken}
      nextPath={next}
    />
  );
}
