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
export function useUsers(page: number, limit: number) {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => api<User[]>(`/users?page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  });
}
const useRefreshAdminData = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["interests"] });
    queryClient.invalidateQueries({ queryKey: ["all-notes"] });
  };
};
export function useCreateUser() {
  const refresh = useRefreshAdminData();
  return useMutation({
    mutationFn: (input: UserInput) =>
      api<User>("/users", { method: "POST", body: input }),
    onSuccess: refresh,
  });
}
export function useUpdateUser() {
  const refresh = useRefreshAdminData();
  return useMutation({
    mutationFn: ({ id, ...input }: UserInput & { id: string }) =>
      api<User>(`/users/${id}`, { method: "PUT", body: input }),
    onSuccess: refresh,
  });
}
export function useDeleteUser() {
  const refresh = useRefreshAdminData();
  return useMutation({
    mutationFn: (id: string) => api(`/users/${id}`, { method: "DELETE" }),
    onSuccess: refresh,
  });
}