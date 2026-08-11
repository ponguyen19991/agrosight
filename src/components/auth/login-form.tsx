"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.37-2.27V6.62H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l4-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefetch the dashboard route so the post-login navigation itself is
  // instant — the 1s delay below is just for the loading state to be visible.
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Demo only — no auth backend is wired up, this just takes you to the dashboard.
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-2">
      {/* Brand panel — always dark, independent of the app theme toggle */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-10 text-white md:flex"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 120% 80% at 20% -10%, oklch(0.32 0.07 145 / 55%), transparent 60%), radial-gradient(ellipse 100% 70% at 100% 110%, oklch(0.24 0.06 160 / 60%), transparent 60%), linear-gradient(160deg, oklch(0.19 0.03 150) 0%, oklch(0.13 0.02 155) 55%, oklch(0.1 0.015 155) 100%)",
        }}
      >
        <div>
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur">
            Smart Farm Platform
          </span>
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
            Manage Your Farm Better with AI-Powered Insights
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Track fields, monitor weather and resources, and get AI guidance —
            all in one dashboard.
          </p>
        </div>

        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/25 bg-white/5 text-sm text-white/50">
          Hình ảnh
        </div>
      </div>

      {/* Form panel */}
      <div
        className="flex items-center justify-center px-6 py-12"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, oklch(var(--secondary) / 60%), transparent 60%), oklch(var(--background))",
        }}
      >
        <div className="w-full max-w-md">
          <Image
            src="/images/banner-non-bg.png"
            alt="AgroSight"
            width={517}
            height={205}
            className="h-16 w-auto object-contain object-left"
            priority
          />

          <h2 className="mt-8 text-2xl font-semibold">Login to account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Access your farm dashboard from anywhere.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6 h-11 w-full gap-2 text-base"
            onClick={() => router.push("/dashboard")}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Or sign in with email
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="farmer@agrosight.com"
                className="h-11 text-base"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-11 text-base"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <Checkbox />
                Remember me
              </label>
              <Link href="/login" className="font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="h-11 w-full text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Register new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
