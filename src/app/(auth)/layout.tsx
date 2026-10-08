import { Lock } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Lock className="h-4 w-4" />
        </span>
        <span className="text-base font-semibold tracking-tight text-foreground">
          Secure Notes
        </span>
      </div>
      {children}
    </div>
  );
}