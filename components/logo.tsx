export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-baseline gap-1.5 font-bold tracking-tight text-xl leading-none select-none ${light ? "text-white" : "text-ink"} ${className}`}
      aria-label="OCTOM One"
    >
      <span aria-hidden="true">
        oc<span className={light ? "text-indigo-300" : "text-brand"}>t</span>om
      </span>
      <span aria-hidden="true" className={`text-base font-semibold ${light ? "text-indigo-200" : "text-slate-500"}`}>One</span>
    </span>
  );
}
export default Logo;
