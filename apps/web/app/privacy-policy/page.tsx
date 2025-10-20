import Link from "next/link";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We collect account information that you provide to us, such as your name, email address, and selected subscription plan. We also gather usage insights generated while you collaborate with our creative tools to help us improve the platform.",
      "We use cookies and similar technologies to remember your preferences, keep you signed in securely, and understand how the product performs."
    ]
  },
  {
    title: "How We Use Information",
    body: [
      "We use your information to deliver and improve Front Cloud Creative, personalize your workspace, and send essential communications related to your account or service updates.",
      "Aggregated, anonymized analytics help us understand product trends, train our assistants, and build new features without exposing personal details."
    ]
  },
  {
    title: "How We Share Information",
    body: [
      "We only share data with vetted service providers who assist with hosting, analytics, and customer support. These partners are bound by contractual obligations to protect your information.",
      "We will never sell your personal information. We may disclose details if required by law or to protect the rights, property, or safety of our team or users."
    ]
  },
  {
    title: "Your Choices & Rights",
    body: [
      "You can update account information or request deletion at any time by contacting support. If you close your account, we will remove or anonymize personal data unless retention is required for legal or compliance purposes.",
      "You may control cookies in your browser settings. Disabling cookies may limit certain features, but essential functionality will still be available."
    ]
  }
];

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            How we protect your creative intelligence
          </h1>
          <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
            We built Front Cloud Creative to respect your ideas and safeguard your data. This
            policy outlines the information we collect, how we use it, and the choices you have to
            stay in control.
          </p>
        </div>

        <div className="mt-10 grid gap-10">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8"
            >
              <h2 className="text-xl font-semibold text-white sm:text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm text-slate-300 sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-indigo-300/30 bg-indigo-500/10 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Questions or Requests</h2>
          <p className="mt-3 text-sm text-indigo-100 sm:text-base">
            If you have questions about this policy or need help managing your data, reach out to our
            support team at{" "}
            <a
              href="mailto:privacy@frontcloudcreative.com"
              className="font-medium text-indigo-200 underline decoration-indigo-200/60 underline-offset-4"
            >
              privacy@frontcloudcreative.com
            </a>
            . We respond promptly and transparently.
          </p>
        </section>
      </main>
    </div>
  );
}
