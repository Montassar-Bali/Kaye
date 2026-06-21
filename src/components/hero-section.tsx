"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* WebGL Background — @paper-design/shaders-react MeshGradient */}
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#000000", "#111111", "#1a1a1a", "#0a0a0a"]}
        speed={0.6}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-label text-[#888] mb-6 md:mb-8"
        >
          FALL / WINTER 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="heading-massive text-white"
        >
          NEW
          <br />
          COLLECTION
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-label text-[#666] mt-6 md:mt-10"
        >
          REDEFINING MODERN ELEGANCE
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-label text-[#555] text-[10px]">
          SCROLL TO DISCOVER
        </span>
        <ChevronDown
          size={16}
          className="text-[#555] animate-bounce-subtle"
          strokeWidth={1}
        />
      </motion.div>
    </section>
  );
}

export default HeroSection;
