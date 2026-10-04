export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-baseline font-bold tracking-tight text-xl leading-none select-none ${light ? "text-white" : "text-ink"} ${className}`}
      aria-label="Octom"
    >
      oc<span className={light ? "text-indigo-300" : "text-brand"}>t</span>om
    </span>
  );
}
export default Logo;
