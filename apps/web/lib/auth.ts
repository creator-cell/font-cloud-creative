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
  pages: {
    signIn: "/signin"
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
    CredentialsProvider({
      id: "credentials",
      name: "Email Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString() ?? "";
        if (!email || !password) {
          return null;
        }

        try {
          const response = await fetch(`${apiBase}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
          });

          if (response.ok) {
            const data = await response.json();
            return {
              id: data.user.id,
              email: data.user.email,
              plan: data.user.plan,
              roles: data.user.roles,
              apiToken: data.token
            } as any;
          }
        } catch (err) {
          console.error("Password login failed", err);
        }

        return null;
      }
    }),
    CredentialsProvider({
      id: "register",
      name: "Register",
      credentials: {
        email: { label: "Email", type: "email" },
        plan: { label: "Plan", type: "text" },
        name: { label: "Name", type: "text" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const plan = (credentials?.plan?.toString().trim() as
          | "free"
          | "starter"
          | "pro"
          | "team") ?? "starter";
        if (!email || !plan) {
          return null;
        }

        try {
          const response = await fetch(`${apiBase}/auth/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: email,
              email,
              plan
            })
          });

          if (response.ok) {
            const data = await response.json();
            return {
              id: data.user.sub,
              email: data.user.email,
              plan: data.user.plan,
              roles: data.user.roles,
              apiToken: data.token
            } as any;
          }
        } catch (err) {
          console.error("Failed to finalize registration via token endpoint", err);
        }

        return {
          id: email,
          email,
          plan,
          roles: ["user"]
        } as any;
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
        if ((user as any)?.apiToken) {
          token.apiToken = (user as any).apiToken;
          token.plan = (user as any)?.plan ?? token.plan ?? "free";
          token.roles = (user as any)?.roles ?? token.roles ?? ["user"];
          if (account?.provider && account.provider !== "register") {
            token.provider = account.provider;
          } else if (!token.provider) {
            token.provider = account?.provider ?? "credentials";
          }
          if (token.plan && token.plan !== "free") {
            token.requiresPlan = false;
          }
          return token;
        }
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
            if (account?.provider && account.provider !== "register") {
              token.provider = account.provider;
            } else if (!token.provider) {
              token.provider = account?.provider ?? "credentials";
            }
            if (account?.provider === "google") {
              token.requiresPlan = data.created;
            } else {
              token.requiresPlan = false;
            }
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
      session.requiresPlan = token.requiresPlan as boolean | undefined;
      return session;
    }
  }
};
