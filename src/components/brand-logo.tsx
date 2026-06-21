"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface BrandLogoProps {
  /** Render size variant */
  size?: "sm" | "md" | "lg";
  /** Animate in on mount */
  animate?: boolean;
  /** Extra className */
  className?: string;
}

/**
 * KAYE brand logo — symbolic luxury monogram mark.
 */
export function BrandLogo({
  size = "md",
  animate = false,
  className = "",
}: BrandLogoProps) {
  /* Heights in px — the image scales proportionally */
  const sizeMap = {
    sm: 34,
    md: 54,
    lg: 86,
  };

  const h = sizeMap[size];
  const shouldPreload = size === "md";

  const content = (
    <Image
      src="/kaye-symbol.svg"
      alt="KAYE monogram"
      width={h}
      height={h}
      className={`select-none object-contain ${className}`}
      style={{ height: `${h}px`, width: "auto" }}
      preload={shouldPreload}
      unoptimized
    />
  );

  if (animate) {
    return (
      <motion.span
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex"
      >
        {content}
      </motion.span>
    );
  }

  return content;
}

export default BrandLogo;
