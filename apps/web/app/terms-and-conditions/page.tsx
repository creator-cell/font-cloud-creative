import Link from "next/link";

const clauses = [
  {
    title: "Using Front Cloud Creative",
    body: [
      "Front Cloud Creative provides creative intelligence tools to help teams ideate, produce, and collaborate on content. You are responsible for how you use the platform and for keeping your account credentials secure.",
      "You agree not to reverse engineer, misuse, or interfere with the service, and to comply with applicable laws when generating or sharing content."
    ]
  },
  {
    title: "Subscription & Billing",
    body: [
      "Plan fees are billed according to the tier you select during registration. Unless otherwise stated, subscriptions renew automatically at the end of each billing period until you downgrade or cancel.",
      "You may change plans at any time from the dashboard. Downgrades take effect at the next renewal cycle, while upgrades apply immediately with a prorated charge where applicable."
    ]
  },
  {
    title: "Intellectual Property",
    body: [
      "You retain ownership of the content you create using the platform. By using the service, you grant Front Cloud Creative a limited license to host and process your content for the purpose of delivering the product.",
      "All platform features, branding, and underlying technology remain the property of Front Cloud Creative. You may not use our trademarks without written permission."
    ]
  },
  {
    title: "Termination & Suspension",
    body: [
      "We may suspend or terminate access if you breach these terms, misuse the service, or if required by law. We will notify you whenever possible and provide steps to resolve the issue.",
      "You can cancel at any time from the dashboard or by contacting support. Upon cancellation, access continues until the end of the current billing term."
    ]
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#0B1220] to-[#020617] text-slate-100">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-wide text-indigo-200 hover:text-indigo-100"
          >
            Front Cloud Creative
          </Link>
          <Link
            href="/signin"
            className="text-sm font-medium text-indigo-200 underline decoration-indigo-300/60 underline-offset-4 hover:text-indigo-100"
          >
            Back to sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:py-16">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
            Terms &amp; Conditions
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            The rules for building with Front Cloud Creative
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
            These terms define the relationship between you and Front Cloud Creative. They ensure
            that the platform runs smoothly and that creators feel confident collaborating with our
            tools.
          </p>
        </div>

        <div className="mt-10 grid gap-10">
          {clauses.map((clause) => (
            <section
              key={clause.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8"
            >
              <h2 className="text-xl font-semibold text-white sm:text-2xl">{clause.title}</h2>
              <div className="mt-4 space-y-4 text-sm text-slate-300 sm:text-base">
                {clause.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-indigo-300/30 bg-indigo-500/10 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Support &amp; Contact</h2>
          <p className="mt-3 text-sm text-indigo-100 sm:text-base">
            Need help understanding these terms? Contact our team at{" "}
            <a
              href="mailto:legal@frontcloudcreative.com"
              className="font-medium text-indigo-200 underline decoration-indigo-200/60 underline-offset-4"
            >
              legal@frontcloudcreative.com
            </a>{" "}
            and we will respond within two business days.
          </p>
        </section>
      </main>
    </div>
  );
}
