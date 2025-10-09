const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type FetchOptions = RequestInit & { token?: string };

export const apiFetch = async <T>(path: string, options: FetchOptions = {}): Promise<T> => {
  const { token, headers, ...rest } = options;
  const response = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const isJson = response.headers.get("content-type")?.includes("application/json");
    const body = isJson ? await response.json().catch(() => ({})) : {};

    if (response.status === 401) {
      const unauthorizedError = new Error(body.error ?? "Unauthorized");
      (unauthorizedError as Error & { status?: number; redirect?: string }).status = response.status;
      (unauthorizedError as Error & { status?: number; redirect?: string }).redirect = "/admin-login";
      throw unauthorizedError;
    }

    const error = new Error(body.error ?? "API request failed");
    (error as Error & { status?: number; details?: unknown }).status = response.status;
    (error as Error & { status?: number; details?: unknown }).details = body;
    throw error;
  }

  return (await response.json()) as T;
};
