export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-baseline font-extrabold tracking-tight text-xl leading-none select-none ${light ? "text-white" : "text-ink"} ${className}`}
      aria-label="Neximo"
    >
      ne<span className={light ? "text-indigo-300" : "text-brand"}>x</span>imo
    </span>
  );
}
export default Logo;
