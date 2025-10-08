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
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.error ?? "API request failed");
    (error as Error & { status?: number; details?: unknown }).status = response.status;
    (error as Error & { status?: number; details?: unknown }).details = body;
    throw error;
  }

  return (await response.json()) as T;
};
