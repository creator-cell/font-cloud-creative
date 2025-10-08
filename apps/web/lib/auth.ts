import type { NextAuthOptions } from "next-auth";
// import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
// import nodemailer from "nodemailer";

const apiBase = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    //   async sendVerificationRequest({ identifier, url, provider }) {
    //     const transport = nodemailer.createTransport(provider.server);
    //     const { host } = new URL(url);
    //     await transport.sendMail({
    //       to: identifier,
    //       from: provider.from,
    //       subject: `Sign in to ${host}`,
    //       text: `Sign in to ${host} by clicking the link: ${url}`,
    //       html: `<p>Sign in to <strong>${host}</strong> by clicking the link below:</p><p><a href="${url}">Sign in</a></p>`
    //     });
    //   }
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        try {
          const response = await fetch(`${apiBase}/auth/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: token.sub ?? user.id ?? user.email,
              email: user.email,
              plan: "free"
            })
          });
          if (response.ok) {
            const data = await response.json();
            token.apiToken = data.token;
            token.plan = data.user.plan;
            token.preferredProvider = data.user.preferredProvider;
            token.preferredModel = data.user.preferredModel;
            token.roles = data.user.roles;
          }
        } catch (err) {
          console.error("Failed to sync token with API", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.plan = (token.plan as string | undefined) ?? "free";
        session.user.preferredProvider = token.preferredProvider as string | undefined;
        session.user.preferredModel = token.preferredModel as string | undefined;
        session.user.roles = (token.roles as string[] | undefined) ?? ["user"];
      }
      session.apiToken = token.apiToken as string | undefined;
      return session;
    }
  }
};
