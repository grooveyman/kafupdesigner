import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { tokenService } from "../context/tokenService";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "localhost:5000/api/v1";
console.log("Base URL:", BASE_URL);


const refreshAccessToken = async () => {
  console.log("Attempting to refresh access token");
  try {

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include", // include cookies
    });

    if (refreshRes.status === 401) {
      tokenService.clear();
      window.location.href = "/admin/login";
      return;
    }

    const data = await refreshRes.json();
    tokenService.set(data.token);

  } catch (error) {
    tokenService.clear();
    window.location.href = "/admin/login";
    console.error("Error refreshing access token:", error);

  }

};

//generic fetch function
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  console.log(`${BASE_URL}${url}`);
  const headers = {
    Authorization: tokenService.get() ? `Bearer ${tokenService.get()}` : "",
    ...(options?.headers || {}),
  }
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include", // include cookies for authentication
  });

  if (res.status === 401) {
    //call refresh token endpoint to get new access token

    await refreshAccessToken();
  }
  if (!res.ok) {
    console.log(res);
    console.log("API request failed:", res.status, await res.text());
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
          body: JSON.stringify(body)
        };
      }
      return fetcher<T>(url, fetchOptions);
    }, ...options
  });

}