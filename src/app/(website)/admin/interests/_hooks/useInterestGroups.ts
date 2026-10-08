"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { InterestGroup } from "@/types/api";
export function useInterestGroups(page: number, limit: number) {
  return useQuery({
    queryKey: ["interests", page, limit],
    queryFn: () =>
      api<InterestGroup[]>(
        `/users/grouped-by-interests?page=${page}&limit=${limit}`
      ),
    placeholderData: keepPreviousData,
  });
}