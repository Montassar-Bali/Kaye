"use client";

import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function CampaignReveal() {
  return (
    <section id="campaign" className="relative bg-black">
      <ContainerScroll
        titleComponent={
          <div className="text-center">
            <p className="text-label text-[#666] mb-4">CAMPAIGN 2026</p>
            <h2 className="heading-large text-white">
              THE NEW
              <br />
              STANDARD
            </h2>
          </div>
        }
      >
        <div className="relative w-full aspect-[16/10]">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=90"
            alt="Fashion campaign editorial - model in dramatic lighting"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
            <p className="text-label text-white/70 mb-2">EXPLORE THE COLLECTION</p>
            <p className="text-sm md:text-base text-white/50 max-w-md">
              A study in contrast. Where raw meets refined, and shadow meets form.
            </p>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}

export default CampaignReveal;
