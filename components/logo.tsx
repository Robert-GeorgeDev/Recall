import { BRAND } from "@/lib/brand";

export default function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-30 12 12)" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-ink">{BRAND}</span>
    </span>
  );
}
