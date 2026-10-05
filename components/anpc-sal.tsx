/** Official ANPC pictogram linking to the alternative dispute resolution (SAL) platform. */
export default function AnpcSal({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://reclamatiisal.anpc.ro"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block ${className}`}
      aria-label="ANPC – Soluționarea alternativă a litigiilor (SAL)"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/anpc-sal.png"
        alt="ANPC – Soluționarea alternativă a litigiilor"
        width={250}
        height={62}
        className="h-auto w-[250px] max-w-full"
      />
    </a>
  );
}
