import { getSession, signOut } from "next-auth/react";
import { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

type Options = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function api<T>(
  path: string,
  { method = "GET", body, auth = true }: Options = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const session = await getSession();
    if (session?.user?.accessToken) {
      headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && auth) signOut({ callbackUrl: "/signin" });
    throw new Error(json?.message || "Something went wrong");
  }

  return json;
}