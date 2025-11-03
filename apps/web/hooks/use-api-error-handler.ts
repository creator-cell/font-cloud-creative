"use client";

import { useRouter } from "next/navigation";

export const useApiErrorHandler = () => {
  const router = useRouter();

  const handleApiError = (error: any) => {
    // Check if error has status property (from our API client)
    if (error?.status === 401) {
      // Redirect to login page with callback URL
      router.push(`/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    // Re-throw other errors to be handled by the component
    throw error;
  };

  return { handleApiError };
};