"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  FileText,
  FolderKanban,
  Hash,
  Lock,
  LogOut,
  MessageSquareText,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const user = session?.user;

  const mainLinks = user
    ? [
        { href: "/", label: "My Notes", icon: FileText },
        { href: `/posts/${user.id}`, label: "My Posts", icon: MessageSquareText },
      ]
    : [];

  const adminLinks =
    user?.role === "admin"
      ? [
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/notes", label: "All Notes", icon: FolderKanban },
          { href: "/admin/interests", label: "Interests", icon: Hash },
        ]
      : [];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            href={user ? "/" : "/signin"}
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Lock className="h-3.5 w-3.5" />
            </span>
            <span>Secure Notes</span>
          </Link>

          {(mainLinks.length > 0 || adminLinks.length > 0) && (
            <nav className="flex flex-wrap items-center gap-1">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 opacity-75" />
                    {link.label}
                  </Link>
                );
              })}

              {adminLinks.length > 0 && (
                <>
                  <span
                    className="mx-1.5 hidden h-4 w-px bg-border sm:inline-block"
                    aria-hidden="true"
                  />
                  {adminLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                          active
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 opacity-75" />
                        {link.label}
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>
          )}
        </div>

        {status !== "loading" &&
          (user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-secondary text-[11px] font-semibold text-foreground">
                  {initials}
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="text-xs font-medium text-foreground">
                    {user.name}
                  </span>
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                      user.role === "admin"
                        ? "bg-zinc-900 text-zinc-50"
                        : "border border-border bg-secondary text-muted-foreground"
                    )}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => signOut({ callbackUrl: "/signin" })}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          ))}
      </div>
    </header>
  );
}