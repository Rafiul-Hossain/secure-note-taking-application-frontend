"use client";

import { Clock, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Note } from "@/types/api";

type Props = {
  note: Note;
  deleting: boolean;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export default function NoteCard({ note, deleting, onEdit, onDelete }: Props) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(note.updatedAt));

  return (
    <Card className="group flex flex-col justify-between transition-all duration-150 hover:border-zinc-300 hover:shadow-sm">
      <div>
        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-1 text-base font-semibold text-foreground">
            {note.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5 pt-0.5 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground/70" />
            <span>Updated {formattedDate}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
            {note.content}
          </p>
        </CardContent>
      </div>

      <CardFooter className="flex items-center justify-end gap-1.5 border-t border-border/50 bg-muted/20 px-5 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(note)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          disabled={deleting}
          onClick={() => onDelete(note)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </CardFooter>
    </Card>
  );
}