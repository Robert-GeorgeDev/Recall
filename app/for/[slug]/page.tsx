import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PAGES } from "@/lib/seo-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = PAGES.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: { absolute: p.title },
    description: p.desc,
    alternates: { canonical: `/for/${p.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const p = PAGES.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <Link href="/" className="text-xl font-semibold tracking-tight text-gray-900">
        oc<span className="text-brand">t</span>om
      </Link>
      <h1 className="mt-12 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
        {p.h1}
      </h1>
      <p className="mt-6 text-lg text-gray-600">{p.intro}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {p.points.map((x) => (
          <div key={x.t}>
            <h2 className="font-medium text-gray-900">{x.t}</h2>
            <p className="mt-2 text-sm text-gray-600">{x.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/signup" className="rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white">
          Start free
        </Link>
        <Link href="/" className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700">
          See how it works
        </Link>
      </div>
    </main>
  );
}
