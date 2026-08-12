import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

const COLUMNS = [
  {
    title: "Quick Links",
    links: ["Home", "Platform", "How It Works", "FAQ"],
  },
  {
    title: "Services",
    links: ["Soil Intelligence", "Hyperlocal Weather", "Resource Allocation", "AI Insights"],
  },
  {
    title: "Company",
    links: ["About AgroSight", "Contact Us", "Terms of Service", "Privacy Policy"],
  },
];

// lucide-react dropped brand logos, so these are hand-drawn to match its
// stroke style (currentColor, 24x24 viewBox).
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M14 9h3V6h-3c-1.66 0-3 1.34-3 3v2H9v3h2v6h3v-6h3l1-3h-4v-2c0-.55.45-1 1-1z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="3" y="9" width="4" height="12" />
      <circle cx="5" cy="5" r="2" />
      <path d="M11 21v-7a3 3 0 0 1 6 0v7M11 9v12" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
      <path d="M18.9 3H21l-6.55 7.49L22.2 21h-5.65l-4.42-5.78L6.1 21H4l7-8.01L3 3h5.75l3.99 5.28L18.9 3zm-1 16.17h1.17L7.15 4.75H5.9l11.99 14.42z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: TwitterIcon, label: "Twitter" },
];

export function LandingFooter() {
  return (
    <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10">
      <footer className="overflow-hidden rounded-3xl border border-white/10 bg-black/85 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-12 p-8 sm:p-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <Image
                  src="/images/logo-primary.png"
                  alt="AgroSight"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="text-base font-semibold tracking-wide">AgroSight</span>
            </Link>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-white/40">
              AgroSight empowers farmers with smart tools for better yields
              and sustainable growth.
            </p>

            <a
              href="mailto:hello@agrosight.com"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              hello@agrosight.com
            </a>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Social Media
            </p>
            <div className="mt-3 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <span
                  key={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <social.icon className="h-3.5 w-3.5" />
                  <span className="sr-only">{social.label}</span>
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-white/60 transition-colors hover:text-white">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 px-8 py-6 text-xs text-white/30 sm:flex-row sm:items-center sm:px-12">
          <p>© {new Date().getFullYear()} AgroSight. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="transition-colors hover:text-white/60">Terms of Service</span>
            <span className="transition-colors hover:text-white/60">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
