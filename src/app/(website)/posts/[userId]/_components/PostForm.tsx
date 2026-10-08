"use client";

import { useState } from "react";
import { Globe, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreatePost } from "../_hooks/usePosts";

export default function PostForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createPost = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createPost.mutate(
      { title, content },
      {
        onSuccess: () => {
          toast.success("Post published");
          setTitle("");
          setContent("");
          onCreated();
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">
          Write a new post
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3 pb-4">
          <Input
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="What would you like to share?"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-5 py-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            Visible to everyone
          </span>
          <Button type="submit" size="sm" disabled={createPost.isPending}>
            {createPost.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {createPost.isPending ? "Publishing..." : "Publish"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}