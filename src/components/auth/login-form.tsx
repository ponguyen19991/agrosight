"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

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

type Mode = "login" | "register";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const loginPanelRef = useRef<HTMLDivElement>(null);
  const registerPanelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number>();

  // Keep the sliding viewport's height in sync with whichever panel is
  // currently active, so switching forms animates height as well as
  // position instead of snapping or leaving empty space.
  useLayoutEffect(() => {
    const activePanel = mode === "login" ? loginPanelRef.current : registerPanelRef.current;
    if (!activePanel) return;
    const observer = new ResizeObserver(([entry]) => setPanelHeight(entry.contentRect.height));
    observer.observe(activePanel);
    return () => observer.disconnect();
  }, [mode]);

  // The card's overall height follows the form column's natural content
  // height (logo + active form), not a hardcoded value — the brand panel
  // on the left stretches to match via CSS, its image simply filling
  // whatever space is left.
  const formContentRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number>();

  useLayoutEffect(() => {
    const content = formContentRef.current;
    if (!content) return;
    const FORM_COLUMN_VERTICAL_PADDING = 96; // px-6 py-12 → 48px top + 48px bottom
    const observer = new ResizeObserver(([entry]) =>
      setCardHeight(entry.contentRect.height + FORM_COLUMN_VERTICAL_PADDING)
    );
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  // Prefetch the dashboard route so the post-login navigation itself is
  // instant — the delay below is just for the loading state to be visible.
  useLayoutEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Demo only — no auth backend is wired up, this just takes you to the dashboard.
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Demo only — no auth backend is wired up, this just fakes success and
    // takes you to the dashboard.
    setTimeout(() => {
      toast({
        variant: "success",
        title: "Thành công",
        description: "Tạo tài khoản thành công.",
      });
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 sm:p-6">
      <div
        className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border shadow-2xl transition-[min-height] duration-500 ease-in-out md:grid-cols-2"
        style={{ minHeight: cardHeight }}
      >
        {/* Brand panel — always dark, independent of the app theme toggle */}
        <div
          className="relative hidden flex-col gap-8 p-10 text-white md:flex"
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

          <div className="relative min-h-40 w-full flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <Image
              src="/images/banner1.png"
              alt="AgroSight dashboard preview"
              fill
              className="object-cover object-top"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
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
          <div ref={formContentRef} className="w-full max-w-md">
            <Image
              src="/images/banner-non-bg.png"
              alt="AgroSight"
              width={517}
              height={205}
              className="h-16 w-auto object-contain object-left"
              priority
            />

            {/* Sliding viewport: clips the 2x-wide track and animates to
                match the height of whichever form is currently active. */}
            <div
              className="mt-8 overflow-hidden transition-[height] duration-500 ease-in-out"
              style={{ height: panelHeight }}
            >
              <div
                className="flex w-[200%] items-start transition-transform duration-500 ease-in-out"
                style={{ transform: mode === "register" ? "translateX(-50%)" : "translateX(0%)" }}
              >
                {/* Login panel */}
                <div
                  ref={loginPanelRef}
                  className={`w-1/2 shrink-0 pl-1 pr-6 ${mode !== "login" ? "pointer-events-none" : ""}`}
                  aria-hidden={mode !== "login"}
                >
                  <h2 className="text-2xl font-semibold">Login to account</h2>
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
                      <div className="relative">
                        <Input
                          id="password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="Password"
                          className="h-11 pr-10 text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label={showLoginPassword ? "Hide password" : "Show password"}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 text-muted-foreground">
                        <Checkbox />
                        Remember me
                      </label>
                      <button
                        type="button"
                        className="font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
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
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                      onClick={() => setMode("register")}
                    >
                      Register new account
                    </button>
                  </p>
                </div>

                {/* Register panel */}
                <div
                  ref={registerPanelRef}
                  className={`w-1/2 shrink-0 pl-6 pr-1 ${mode !== "register" ? "pointer-events-none" : ""}`}
                  aria-hidden={mode !== "register"}
                >
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </button>

                  <h2 className="mt-4 text-2xl font-semibold">Create an account</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Set up your farm dashboard in a couple of minutes.
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
                      Or sign up with email
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Full name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Jane Farmer"
                        className="h-11 text-base"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="registerEmail">Email address</Label>
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="farmer@agrosight.com"
                        className="h-11 text-base"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="registerPassword">Password</Label>
                      <div className="relative">
                        <Input
                          id="registerPassword"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="h-11 pr-10 text-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword((v) => !v)}
                          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <label className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Checkbox className="mt-0.5" required />
                      I agree to the Terms of Service and Privacy Policy
                    </label>

                    <Button type="submit" className="h-11 w-full text-base" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </form>

                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                      onClick={() => setMode("login")}
                    >
                      Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
