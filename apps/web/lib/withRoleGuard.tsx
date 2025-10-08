"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const withRoleGuard = <P extends object>(
  Component: React.ComponentType<P>,
  allowed: string[]
) =>
  function Guarded(props: P) {
    const { data: session, status } = useSession();

    const allowedSession = useMemo(() => {
      if (!session?.user?.roles) return false;
      return session.user.roles.some((role) => allowed.includes(role));
    }, [session, allowed]);

    if (status === "loading") {
      return <div className="p-6 text-sm text-slate-500 dark:text-slate-400">Checking permissions...</div>;
    }

    if (!allowedSession) {
      return <div className="p-6 text-sm text-rose-400">You do not have access to this area.</div>;
    }

    return <Component {...props} />;
  };
