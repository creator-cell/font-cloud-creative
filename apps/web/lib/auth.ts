import type { NextAuthOptions } from "next-auth";
// import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import nodemailer from "nodemailer";

const apiBase = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      id: "super-admin",
      name: "Super Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const username = process.env.SUPERADMIN_USERNAME;
        const password = process.env.SUPERADMIN_PASSWORD;
        const email = process.env.SUPERADMIN_EMAIL;

        if (!username || !password || !email) {
          console.error("Super admin credentials are not configured");
          return null;
        }

        if (
          credentials?.username === username &&
          credentials?.password === password
        ) {
          return {
            id: "super-admin",
            email,
            name: "Super Admin",
            plan: process.env.SUPERADMIN_PLAN ?? "team",
            roles: ["owner", "admin", "analyst", "support", "billing", "user"]
          } as any;
        }

        return null;
      }
    }),
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
    async jwt({ token, user, account }) {
      if (user?.email) {
        try {
          const plan = (user as any)?.plan ?? (account?.provider === "super-admin" ? process.env.SUPERADMIN_PLAN ?? "team" : "free");
          const response = await fetch(`${apiBase}/auth/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: token.sub ?? (user as any)?.id ?? user.email,
              email: user.email,
              plan
            })
          });
          if (response.ok) {
            const data = await response.json();
            token.apiToken = data.token;
            token.plan = data.user.plan;
            token.preferredProvider = data.user.preferredProvider;
            token.preferredModel = data.user.preferredModel;
            token.roles = data.user.roles;
            token.provider = account?.provider ?? "credentials";
          } else if (account?.provider === "super-admin") {
            token.roles = (user as any)?.roles ?? ["owner", "admin", "analyst", "support", "billing", "user"];
            token.provider = "super-admin";
          }
        } catch (err) {
          console.error("Failed to sync token with API", err);
          if (account?.provider === "super-admin" && !token.roles) {
            token.roles = ["owner", "admin", "analyst", "support", "billing", "user"];
            token.provider = "super-admin";
          }
        }
      } else if (account?.provider === "super-admin") {
        token.roles = ["owner", "admin", "analyst", "support", "billing", "user"];
        token.provider = "super-admin";
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
        session.user.provider = (token.provider as string | undefined) ?? "google";
      }
      session.apiToken = token.apiToken as string | undefined;
      return session;
    }
  }
};
