import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login — AgroSight",
  description: "Sign in to your AgroSight smart farm dashboard.",
};

export default function LoginPage() {
  return <LoginForm />;
}
