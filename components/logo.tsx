export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-bold tracking-tight text-xl leading-none select-none ${className}`}
      aria-label="OCTOM One"
    >
      <span aria-hidden="true" className={light ? "text-white" : "text-ink"}>octom</span>
      <span aria-hidden="true" className={light ? "text-indigo-300" : "text-brand"}>One</span>
    </span>
  );
}
export default Logo;
