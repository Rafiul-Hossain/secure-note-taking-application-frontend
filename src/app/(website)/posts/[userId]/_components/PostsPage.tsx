"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, Globe, MessageSquareText } from "lucide-react";
import Pagination from "@/components/shared/Pagination";
import { useUserPosts } from "../_hooks/usePosts";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

const LIMIT = 5;

export default function PostsPage({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);
  const { data: session } = useSession();

  const { data, isLoading, isError, error } = useUserPosts(userId, page, LIMIT);

  const isOwner = session?.user?.id === userId;
  const posts = data?.data.posts ?? [];
  const author = data?.data.user;
  const meta = data?.meta;

  const initials = author?.name
    ? author.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between border-b border-border/70 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground">
            {initials}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {isOwner
                  ? "My Posts"
                  : author
                  ? `${author.name}'s Posts`
                  : "Posts"}
              </h1>
              {meta && (
                <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {meta.total}
                </span>
              )}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5 text-muted-foreground/80" />
              Public feed — visible to everyone
            </p>
          </div>
        </div>
      </div>

      {isOwner && <PostForm onCreated={() => setPage(1)} />}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl border border-border/70 bg-card p-6"
            >
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/5 rounded bg-muted/70" />
              <div className="mt-5 space-y-2">
                <div className="h-3 w-full rounded bg-muted/80" />
                <div className="h-3 w-3/4 rounded bg-muted/80" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {error instanceof Error ? error.message : "Failed to load posts"}
          </span>
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary/70 text-muted-foreground">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No posts published yet
          </h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {isOwner
              ? "Share your first public post using the composer above."
              : "This user hasn't published any public posts yet."}
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} authorName={author?.name} />
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  );
}