"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => (
  <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
    Sign out
  </Button>
);
