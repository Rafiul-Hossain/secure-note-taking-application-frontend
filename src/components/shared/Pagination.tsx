"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Meta } from "@/types/api";

type Props = {
  meta?: Meta;
  onPageChange: (page: number) => void;
};

export default function Pagination({ meta, onPageChange }: Props) {
  if (!meta || meta.total === 0) return null;

  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-4">
      <p className="text-xs text-muted-foreground">
        Page <span className="font-medium text-foreground">{meta.page}</span> of{" "}
        <span className="font-medium text-foreground">{meta.totalPages}</span>
        <span className="mx-1.5 text-border">·</span>
        <span>{meta.total} total</span>
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}