"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, Hash, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/shared/Pagination";
import { useInterestGroups } from "../_hooks/useInterestGroups";

const LIMIT = 6;

export default function InterestsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useInterestGroups(page, LIMIT);

  const groups = data?.data ?? [];
  const meta = data?.meta;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-border/70 pb-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Users by Interest
          </h1>
          {meta && (
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {meta.total} {meta.total === 1 ? "group" : "groups"}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/80" />
          Members aggregated by shared interest tags.
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl border border-border/70 bg-card p-6"
            >
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-5 space-y-2.5">
                <div className="h-8 w-full rounded bg-muted/70" />
                <div className="h-8 w-full rounded bg-muted/70" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {error instanceof Error
              ? error.message
              : "Failed to load interests"}
          </span>
        </div>
      )}

      {!isLoading && !isError && groups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary/70 text-muted-foreground">
            <Hash className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No interest groups yet
          </h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Assign interests to users to see them grouped here automatically.
          </p>
        </div>
      )}

      {groups.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card
              key={group.interest}
              className="overflow-hidden transition-all duration-150 hover:border-zinc-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/50 bg-muted/20 px-5 py-3.5">
                <CardTitle className="flex items-center gap-1.5 text-sm font-semibold capitalize text-foreground">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  {group.interest}
                </CardTitle>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {group.count} {group.count === 1 ? "user" : "users"}
                </span>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border/50">
                  {group.users.map((user) => (
                    <li key={user._id}>
                      <Link
                        href={`/posts/${user._id}`}
                        className="group flex items-center justify-between px-5 py-3 text-xs transition-colors hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-[10px] font-semibold text-foreground">
                            {getInitials(user.name)}
                          </div>
                          <span className="truncate font-medium text-foreground group-hover:underline">
                            {user.name}
                          </span>
                          <span className="truncate text-muted-foreground">
                            · {user.email}
                          </span>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}