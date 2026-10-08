"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Clock,
  FolderKanban,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/shared/Pagination";
import { useAllNotes } from "../_hooks/useAllNotes";

const LIMIT = 6;

export default function AllNotesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useAllNotes(page, LIMIT);

  const notes = data?.data ?? [];
  const meta = data?.meta;

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateStr));

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
            All Notes
          </h1>
          {meta && (
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {meta.total}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/80" />
          Admin overview — read-only inspection of notes across all users.
        </p>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl border border-border/70 bg-card p-6"
            >
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/4 rounded bg-muted/70" />
              <div className="mt-6 space-y-2">
                <div className="h-3 w-full rounded bg-muted/80" />
                <div className="h-3 w-4/5 rounded bg-muted/80" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {error instanceof Error ? error.message : "Failed to load notes"}
          </span>
        </div>
      )}

      {!isLoading && !isError && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary/70 text-muted-foreground">
            <FolderKanban className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No notes found
          </h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            No users have created any notes in the workspace yet.
          </p>
        </div>
      )}

      {notes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => {
            const owner = typeof note.owner === "object" ? note.owner : null;

            return (
              <Card
                key={note._id}
                className="flex flex-col justify-between transition-all duration-150 hover:border-zinc-300"
              >
                <div>
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-1 text-base font-semibold text-foreground">
                      {note.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 pt-0.5 text-xs">
                      <Clock className="h-3 w-3 text-muted-foreground/70" />
                      <span>Updated {formatDate(note.updatedAt)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                      {note.content}
                    </p>
                  </CardContent>
                </div>

                <CardFooter className="border-t border-border/50 bg-muted/20 px-5 py-3">
                  {owner ? (
                    <Link
                      href={`/posts/${owner._id}`}
                      className="group flex w-full items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[10px] font-semibold text-foreground">
                          {getInitials(owner.name)}
                        </div>
                        <span className="truncate font-medium text-foreground group-hover:underline">
                          {owner.name}
                        </span>
                        <span className="truncate text-muted-foreground">
                          · {owner.email}
                        </span>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Unknown owner
                    </span>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}