import { redirect } from "next/navigation";

export const apiBase =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4004";

type ServerApiOptions = {
  redirectOn401?: boolean;
  init?: RequestInit;
};

export const serverApiFetch = async <T>(
  path: string,
  token: string,
  options?: ServerApiOptions
): Promise<T> => {
  const { redirectOn401 = true, init } = options ?? {};

  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
    ...init
  });
  if (!response.ok) {
    if (response.status === 401 && redirectOn401) {
      redirect("/signin");
    }
    const error = new Error(`API request failed: ${response.status}`);
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }
  return (await response.json()) as T;
};
