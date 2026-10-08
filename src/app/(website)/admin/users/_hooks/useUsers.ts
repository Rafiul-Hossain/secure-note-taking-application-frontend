"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User } from "@/types/api";

export type UserInput = {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  interests: string[];
};

// GET /users?page=&limit=  (admin, paginated)
export function useUsers(page: number, limit: number) {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => api<User[]>(`/users?page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  });
}

// Changing users also changes the interests grouping and the all-notes view
const useRefreshAdminData = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["interests"] });
    queryClient.invalidateQueries({ queryKey: ["all-notes"] });
  };
};

// POST /users
export function useCreateUser() {
  const refresh = useRefreshAdminData();
  return useMutation({
    mutationFn: (input: UserInput) =>
      api<User>("/users", { method: "POST", body: input }),
    onSuccess: refresh,
  });
}

// PUT /users/:id
export function useUpdateUser() {
  const refresh = useRefreshAdminData();
  return useMutation({
    mutationFn: ({ id, ...input }: UserInput & { id: string }) =>
      api<User>(`/users/${id}`, { method: "PUT", body: input }),
    onSuccess: refresh,
  });
}

// DELETE /users/:id
export function useDeleteUser() {
  const refresh = useRefreshAdminData();
  return useMutation({
    mutationFn: (id: string) => api(`/users/${id}`, { method: "DELETE" }),
    onSuccess: refresh,
  });
}