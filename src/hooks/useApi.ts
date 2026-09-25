import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { tokenService } from "../context/tokenService";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000/api/v1";
console.log("Base URL:", BASE_URL);


const refreshAccessToken = async (): Promise<boolean> => {
  console.log("Attempting to refresh access token");
  try {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // include cookies
    });

    if (!refreshRes.ok) {
      return false;
    }

    const responseText = await refreshRes.text();
    if (!responseText) {
      return false;
    }

    const data: { access_token?: string } = JSON.parse(responseText);
    if (!data.access_token) {
      return false;
    }

    tokenService.set(data.access_token);
    return true;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return false;
  }
};

//generic fetch function
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  console.log(`${BASE_URL}${url}`);
  const request = () => fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      Authorization: tokenService.get() ? `Bearer ${tokenService.get()}` : "",
      ...(options?.headers || {}),
    },
    credentials: "include",
  });

  let res = await request();

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    console.log(localStorage.getItem("token"));
    if (!refreshed) {
      tokenService.clear();
      // window.location.href = "/admin/login";
    } else {
      res = await request();
    }
  }
  if (!res.ok) {
    const errorText = await res.text();
    console.log("API request failed:", res.status, errorText);
    throw new Error(errorText || "API request failed");
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