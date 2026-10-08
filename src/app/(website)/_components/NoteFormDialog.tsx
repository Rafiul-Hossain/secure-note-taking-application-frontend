"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Note } from "@/types/api";
import { useCreateNote, useUpdateNote } from "../_hooks/useNotes";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note | null; // null = create, a note = edit
};

export default function NoteFormDialog({ open, onOpenChange, note }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  const isEdit = !!note;
  const saving = createNote.isPending || updateNote.isPending;

  // fill the form when the dialog opens
  useEffect(() => {
    if (open) {
      setTitle(note?.title ?? "");
      setContent(note?.content ?? "");
    }
  }, [open, note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const callbacks = {
      onSuccess: () => {
        toast.success(isEdit ? "Note updated" : "Note created");
        onOpenChange(false);
      },
      onError: (err: Error) => toast.error(err.message),
    };

    if (note) {
      updateNote.mutate({ id: note._id, title, content }, callbacks);
    } else {
      createNote.mutate({ title, content }, callbacks);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit note" : "New note"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to your private note below."
              : "Write a new private note for your workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="note-title"
              className="text-xs font-medium text-foreground"
            >
              Title
            </label>
            <Input
              id="note-title"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="note-content"
              className="text-xs font-medium text-foreground"
            >
              Content
            </label>
            <Textarea
              id="note-content"
              placeholder="Write your thoughts..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}