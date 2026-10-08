"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowUpRight,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Pagination from "@/components/shared/Pagination";
import { User } from "@/types/api";
import { cn } from "@/lib/utils";
import { useDeleteUser, useUsers } from "../_hooks/useUsers";
import UserFormDialog from "./UserFormDialog";

const LIMIT = 8;

export default function UsersPage() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const { data, isLoading, isError, error } = useUsers(page, LIMIT);
  const deleteUser = useDeleteUser();

  const users = data?.data ?? [];
  const meta = data?.meta;

  // if the last user on a page was removed, step back one page
  useEffect(() => {
    if (meta && page > 1 && page > meta.totalPages) {
      setPage(meta.totalPages || 1);
    }
  }, [meta, page]);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (
      !window.confirm(
        `Remove ${user.name}? Their notes and posts will be deleted too.`
      )
    )
      return;

    deleteUser.mutate(user._id, {
      onSuccess: () => toast.success("User removed"),
      onError: (err) => toast.error(err.message),
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Users
            </h1>
            {meta && (
              <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {meta.total}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/80" />
            Manage workspace members, roles, and interest tags.
          </p>
        </div>

        <Button onClick={openAdd} className="self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add user
        </Button>
      </div>

      {isLoading && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border/60">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex animate-pulse items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-muted" />
                    <div className="h-3 w-40 rounded bg-muted/70" />
                  </div>
                </div>
                <div className="h-7 w-24 rounded bg-muted/70" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {isError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {error instanceof Error ? error.message : "Failed to load users"}
          </span>
        </div>
      )}

      {!isLoading && !isError && users.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary/70 text-muted-foreground">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No users found
          </h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Add your first user to get started.
          </p>
        </div>
      )}

      {users.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/80 bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Interests</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((user) => {
                  const isSelf = user._id === session?.user?.id;
                  const isDeleting =
                    deleteUser.isPending && deleteUser.variables === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-muted/25"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium text-foreground">
                                {user.name}
                              </span>
                              {isSelf && (
                                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
                            user.role === "admin"
                              ? "bg-zinc-900 text-zinc-50"
                              : "border border-border bg-secondary/70 text-muted-foreground"
                          )}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {user.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.interests.map((interest) => (
                              <span
                                key={interest}
                                className="inline-flex items-center rounded-md border border-border/80 bg-secondary/50 px-2 py-0.5 text-xs text-foreground/80"
                              >
                                #{interest}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/60">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Link href={`/posts/${user._id}`}>
                              Posts
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => openEdit(user)}
                            title="Edit user"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                            disabled={isSelf || isDeleting}
                            onClick={() => handleDelete(user)}
                            title={
                              isSelf
                                ? "You cannot delete your own account"
                                : "Delete user"
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editing}
      />
    </div>
  );
}