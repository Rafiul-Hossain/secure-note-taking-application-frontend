"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/api";
import { useCreateUser, useUpdateUser } from "../_hooks/useUsers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null; // null = add, a user = edit
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "user" as "user" | "admin",
  interests: "",
};

export default function UserFormDialog({ open, onOpenChange, user }: Props) {
  const { data: session } = useSession();
  const [form, setForm] = useState(emptyForm);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isEdit = !!user;
  const isSelf = !!user && user._id === session?.user?.id;
  const saving = createUser.isPending || updateUser.isPending;

  // fill the form when the dialog opens
  useEffect(() => {
    if (!open) return;
    setForm(
      user
        ? {
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            interests: user.interests.join(", "),
          }
        : emptyForm
    );
  }, [open, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const parsedInterests = form.interests
    .split(",")
    .map((i) => i.trim().toLowerCase())
    .filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      name: form.name,
      email: form.email,
      role: form.role,
      interests: parsedInterests,
      // on edit, an empty password means "keep the current one"
      ...(form.password ? { password: form.password } : {}),
    };

    const callbacks = {
      onSuccess: () => {
        toast.success(isEdit ? "User updated" : "User created");
        onOpenChange(false);
      },
      onError: (err: Error) => toast.error(err.message),
    };

    if (user) {
      updateUser.mutate({ id: user._id, ...input }, callbacks);
    } else {
      createUser.mutate(input, callbacks);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Add user"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update account details. Leave password blank to keep the existing one."
              : "Create a new member or administrator account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="user-name"
              className="text-xs font-medium text-foreground"
            >
              Full name
            </label>
            <Input
              id="user-name"
              name="name"
              placeholder="Alex Morgan"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="user-email"
              className="text-xs font-medium text-foreground"
            >
              Email address
            </label>
            <Input
              id="user-email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="user-password"
                className="text-xs font-medium text-foreground"
              >
                {isEdit ? "New password" : "Password"}
              </label>
              <Input
                id="user-password"
                name="password"
                type="password"
                placeholder={isEdit ? "Optional" : "Min. 6 characters"}
                value={form.password}
                onChange={handleChange}
                minLength={form.password || !isEdit ? 6 : undefined}
                required={!isEdit}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="user-role"
                className="text-xs font-medium text-foreground"
              >
                Role
              </label>
              <select
                id="user-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={isSelf}
                className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1.5 text-sm text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors focus-visible:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="user-interests"
                className="text-xs font-medium text-foreground"
              >
                Interests
              </label>
              <span className="text-[11px] text-muted-foreground">
                Comma-separated
              </span>
            </div>
            <Input
              id="user-interests"
              name="interests"
              placeholder="e.g. chess, reading, coding"
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
              {saving ? "Saving..." : isEdit ? "Save changes" : "Add user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}