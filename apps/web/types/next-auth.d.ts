import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    apiToken?: string;
    requiresPlan?: boolean;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      plan: string;
      preferredProvider?: string;
      preferredModel?: string;
      roles?: string[];
      provider?: string;
    };
  }

  interface User {
    plan?: string;
    preferredProvider?: string;
    preferredModel?: string;
    roles?: string[];
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken?: string;
    plan?: string;
    preferredProvider?: string;
    preferredModel?: string;
    roles?: string[];
    provider?: string;
    requiresPlan?: boolean;
  }
}
