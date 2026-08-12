import { Fraunces } from "next/font/google";

// Loaded only where the landing page components that use it are rendered —
// not registered on the root layout, so it never ships to /login or
// /dashboard.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500"],
});
