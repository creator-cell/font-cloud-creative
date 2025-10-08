import { redirect } from "next/navigation";
import { auth } from "@/lib/session";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  return <LandingPage />;
}
