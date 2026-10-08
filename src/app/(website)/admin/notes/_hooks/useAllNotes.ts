"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Note } from "@/types/api";
export function useAllNotes(page: number, limit: number) {
  return useQuery({
    queryKey: ["all-notes", page, limit],
    queryFn: () => api<Note[]>(`/notes/all?page=${page}&limit=${limit}`),
    placeholderData: keepPreviousData,
  });
}