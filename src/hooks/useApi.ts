import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000/api/v1";

let refreshPromise: Promise<boolean> | null = null;

// Single-flighted refresh using the httpOnly refresh_token cookie.
// The backend sets fresh access_token/refresh_token cookies on success.
export async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function logoutRequest(): Promise<void> {
  try {
    await fetch(`${BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
  } catch {
    /* best-effort */
  }
}

const redirectToLogin = () => {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
};

// Auth travels via httpOnly cookies, so every request just needs credentials.
// On a 401 we refresh once and retry; if that fails the session is over.
async function fetcher<T>(url: string, options?: RequestInit, retry = true): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    const ok = await refreshSession();
    if (ok) return fetcher<T>(url, options, false);
    redirectToLogin();
    throw new Error("Session expired");
  }

  if (!res.ok) {
    throw new Error((await res.text()) || "API request failed");
  }

  return res.json();
}

export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => fetcher<T>(url),
    ...options,
  });
}

export function useApiMutation<T>(
  baseUrl: string,
  method: "POST" | "PUT" | "DELETE",
  options?: UseMutationOptions<T, Error, any>
) {
  return useMutation<T, Error, any>({
    mutationFn: async (body: any) => {
      let url = baseUrl;

      if (body?.id) {
        url = `${baseUrl}/${body.id}`;
      }
      let fetchOptions: RequestInit;
      if (body instanceof FormData) {
        fetchOptions = { method, body };
      } else {
        fetchOptions = {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        };
      }
      return fetcher<T>(url, fetchOptions);
    },
    ...options,
  });
}
