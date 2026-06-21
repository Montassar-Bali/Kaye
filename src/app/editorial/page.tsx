import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CategoryHero } from "@/components/category-hero";
import { categoryMeta } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial | KAYE",
  description: "Campaigns, stories and notes from the KAYE studio.",
};

const stories = [
  {
    slug: "the-new-standard",
    title: "THE NEW STANDARD",
    excerpt:
      "A study in contrast. Where raw meets refined, and shadow meets form.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=85",
    date: "OCTOBER 2026",
  },
  {
    slug: "shadows-and-light",
    title: "SHADOWS & LIGHT",
    excerpt:
      "Photographed over three nights in Berlin — a conversation between materials.",
    image:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600&q=85",
    date: "SEPTEMBER 2026",
  },
  {
    slug: "inside-the-atelier",
    title: "INSIDE THE ATELIER",
    excerpt:
      "A look at the hands behind the stitches — tailoring, cutting, craft.",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=85",
    date: "AUGUST 2026",
  },
];

export default function EditorialPage() {
  const meta = categoryMeta.editorial;
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <CategoryHero
        eyebrow={meta.eyebrow}
        heading={meta.heading}
        description={meta.description}
      />

      <section className="px-4 md:px-8 py-14 md:py-20 max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24">
        {stories.map((story, i) => (
          <article
            key={story.slug}
            className={`flex flex-col ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } gap-8 md:gap-16 items-start`}
          >
            <div className="relative w-full md:w-2/3 aspect-[16/10] overflow-hidden bg-[#111]">
              <Image
                src={story.image}
                alt={story.title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover"
              />
            </div>
            <div className="md:w-1/3 md:pt-10">
              <p className="text-label text-[#666] mb-3">{story.date}</p>
              <h2 className="heading-medium text-white mb-4">{story.title}</h2>
              <p className="text-sm text-[#888] leading-relaxed mb-6">
                {story.excerpt}
              </p>
              <Link
                href="/new-in"
                className="text-xs tracking-[0.2em] text-white border-b border-white/50 pb-1 hover:border-white transition-colors"
              >
                READ THE STORY
              </Link>
            </div>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
