import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Post } from "@/types/api";

export default function PostCard({
  post,
  authorName,
}: {
  post: Post;
  authorName?: string;
}) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(post.createdAt));

  return (
    <Card className="transition-all duration-150 hover:border-zinc-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">
          {post.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5 pt-0.5 text-xs">
          <Clock className="h-3 w-3 text-muted-foreground/70" />
          <span>{formattedDate}</span>
          {authorName && (
            <>
              <span className="text-border">·</span>
              <span>{authorName}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}