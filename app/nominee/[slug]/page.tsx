import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NomineeProfileClient from "@/components/voting/NomineeProfileClient";
import { getNomineeBySlug, nominees } from "@/lib/mockData";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return nominees.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nominee = getNomineeBySlug(slug);
  if (!nominee) return { title: "Nominee Not Found" };
  return {
    title: `Vote for ${nominee.name}`,
    description: nominee.quote,
  };
}

export default async function NomineePage({ params }: Props) {
  const { slug } = await params;
  const nominee = getNomineeBySlug(slug);
  if (!nominee) notFound();
  return <NomineeProfileClient slug={slug} />;
}
