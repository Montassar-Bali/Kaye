"use client";

import { motion } from "framer-motion";

export function CategoryHero({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: string;
  description: string;
}) {
  return (
    <section className="pt-36 pb-16 md:pt-44 md:pb-20 px-6 md:px-10 border-b border-[#111]">
      <div className="max-w-[1400px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-label text-[#666] mb-4"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="heading-large text-white"
        >
          {heading}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm md:text-base text-[#888] mt-6 max-w-xl leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
