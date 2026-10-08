"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FeedPost } from "@/types/api";

// GET /posts?page=&limit=  (public, so no token is sent)
export function useAllPosts(page: number, limit: number) {
  return useQuery({
    queryKey: ["feed", page, limit],
    queryFn: () =>
      api<FeedPost[]>(`/posts?page=${page}&limit=${limit}`, { auth: false }),
    placeholderData: keepPreviousData,
  });
}