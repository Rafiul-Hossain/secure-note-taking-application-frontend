"use client";

import { useEffect, useState } from "react";
import { AlertCircle, FileText, Lock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/Pagination";
import { Note } from "@/types/api";
import { useDeleteNote, useNotes } from "../_hooks/useNotes";
import NoteCard from "./NoteCard";
import NoteFormDialog from "./NoteFormDialog";

const LIMIT = 6;

export default function NotesPage() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);

  const { data, isLoading, isError, error } = useNotes(page, LIMIT);
  const deleteNote = useDeleteNote();

  const notes = data?.data ?? [];
  const meta = data?.meta;

  // if the last note on a page was deleted, step back one page
  useEffect(() => {
    if (meta && page > 1 && page > meta.totalPages) {
      setPage(meta.totalPages || 1);
    }
  }, [meta, page]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditing(note);
    setDialogOpen(true);
  };

  const handleDelete = (note: Note) => {
    if (!window.confirm("Delete this note?")) return;
    deleteNote.mutate(note._id, {
      onSuccess: () => toast.success("Note deleted"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              My Notes
            </h1>
            {meta && (
              <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {meta.total}
              </span>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <Lock className="h-3.5 w-3.5 text-muted-foreground/80" />
            Private workspace — only you can edit and manage these notes.
          </p>
        </div>

        <Button onClick={openCreate} className="self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New note
        </Button>
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
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-foreground">
            No notes yet
          </h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            You haven&apos;t created any notes yet. Start by writing your first
            private note.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={openCreate}
          >
            <Plus className="h-3.5 w-3.5" />
            Create your first note
          </Button>
        </div>
      )}

      {notes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              deleting={
                deleteNote.isPending && deleteNote.variables === note._id
              }
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <NoteFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        note={editing}
      />
    </div>
  );
}