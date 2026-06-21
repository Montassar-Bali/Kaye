"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AtSign, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer
      ref={ref}
      className="relative bg-black border-t border-[#1a1a1a] px-6 md:px-10"
    >
      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-[1400px] mx-auto py-20 md:py-32 border-b border-[#1a1a1a]"
      >
        <div className="max-w-xl">
          <p className="text-label text-[#666] mb-4">NEWSLETTER</p>
          <h3 className="heading-medium text-white mb-6">
            STAY IN THE KNOW
          </h3>
          <p className="text-sm text-[#666] mb-8 leading-relaxed">
            Sign up to receive updates on new collections, exclusive events,
            and editorial content.
          </p>

          <div className="flex border-b border-[#333] pb-3 group">
            <input
              id="newsletter-email"
              type="email"
              placeholder="EMAIL ADDRESS"
              className="flex-1 bg-transparent text-white text-xs tracking-[0.15em] placeholder:text-[#444] outline-none"
            />
            <button
              id="newsletter-submit"
              className="text-[#666] hover:text-white transition-colors"
              aria-label="Subscribe"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bottom */}
      <div className="max-w-[1400px] mx-auto py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          <BrandLogo size="sm" />
          <div className="flex gap-6">
            {["ABOUT", "STORES", "CAREERS", "CONTACT"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[10px] tracking-[0.15em] text-[#555] hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-[#555] hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <AtSign size={16} strokeWidth={1.5} />
          </a>
          <p className="text-[10px] tracking-[0.1em] text-[#444]">
            © 2026 KAYE
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
