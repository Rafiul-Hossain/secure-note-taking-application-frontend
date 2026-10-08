"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Post } from "@/types/api";

type UserPosts = {
  user: { _id: string; name: string };
  posts: Post[];
};
export function useUserPosts(userId: string, page: number, limit: number) {
  return useQuery({
    queryKey: ["posts", userId, page, limit],
    queryFn: () =>
      api<UserPosts>(`/posts/user/${userId}?page=${page}&limit=${limit}`, {
        auth: false,
      }),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; content: string }) =>
      api<Post>("/posts", { method: "POST", body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}