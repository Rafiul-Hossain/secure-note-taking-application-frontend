"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import { Note } from "@/types/api";

type NoteInput = { title: string; content: string };
export function useNotes(page: number, limit: number) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["notes", userId, page, limit],
    queryFn: () => api<Note[]>(`/notes?page=${page}&limit=${limit}`),
    enabled: !!userId,
    placeholderData: keepPreviousData,
  });
}
export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NoteInput) =>
      api<Note>("/notes", { method: "POST", body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}
export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: NoteInput & { id: string }) =>
      api<Note>(`/notes/${id}`, { method: "PUT", body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}
export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/notes/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
}