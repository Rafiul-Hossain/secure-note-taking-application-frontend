"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const parsedInterests = form.interests
    .split(",")
    .map((i) => i.trim().toLowerCase())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api("/auth/register", {
        method: "POST",
        auth: false,
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
          interests: parsedInterests,
        },
      });

      const res = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (res?.error) {
        toast.error(res.error);
        router.push("/signin");
        return;
      }

      toast.success("Account created");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription>
          Get started with your private notes and public posts
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="signup-name"
              className="text-xs font-medium text-foreground"
            >
              Full name
            </label>
            <Input
              id="signup-name"
              name="name"
              placeholder="Alex Morgan"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="signup-email"
              className="text-xs font-medium text-foreground"
            >
              Email address
            </label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="signup-password"
                className="text-xs font-medium text-foreground"
              >
                Password
              </label>
              <span className="text-[11px] text-muted-foreground">
                Min. 6 characters
              </span>
            </div>
            <Input
              id="signup-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="signup-interests"
                className="text-xs font-medium text-foreground"
              >
                Interests
              </label>
              <span className="text-[11px] text-muted-foreground">
                Optional, comma-separated
              </span>
            </div>
            <Input
              id="signup-interests"
              name="interests"
              placeholder="e.g. design, chess, reading"
              value={form.interests}
              onChange={handleChange}
            />
            {parsedInterests.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {parsedInterests.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-1">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}