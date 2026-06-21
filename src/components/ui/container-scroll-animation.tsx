"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}

export function ContainerScroll({
  titleComponent,
  children,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.4], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.4], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div
      className="relative flex flex-col items-center justify-center py-20 md:py-40"
      ref={containerRef}
    >
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-10 md:mb-20">
        <motion.div style={{ opacity, translateY: translateY }}>
          {titleComponent}
        </motion.div>
      </div>

      <motion.div
        style={{
          rotateX: rotate,
          scale,
          opacity,
        }}
        className="w-full max-w-6xl mx-auto px-4 md:px-8"
      >
        <div
          className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#333]"
          style={{
            perspective: "1000px",
            boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.8)",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default ContainerScroll;
