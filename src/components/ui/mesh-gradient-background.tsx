"use client";

import { MeshGradient } from "@paper-design/shaders-react";

interface MeshGradientBackgroundProps {
  speed?: number;
  children: React.ReactNode;
}

/**
 * Full-screen animated MeshGradient background overlay.
 * Renders the shader behind `children` with subtle lighting pulse effects.
 */
export function MeshGradientBackground({
  speed = 0.8,
  children,
}: MeshGradientBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Shader layer */}
      <MeshGradient
        className="!fixed inset-0 w-full h-full"
        colors={["#000000", "#1a1a1a", "#333333", "#ffffff"]}
        speed={speed}
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Subtle glow orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/4 left-1/3 w-32 h-32 bg-gray-800/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: `${3 / speed}s` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl animate-pulse"
          style={{ animationDuration: `${2 / speed}s`, animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-20 h-20 bg-gray-900/[0.03] rounded-full blur-xl animate-pulse"
          style={{ animationDuration: `${4 / speed}s`, animationDelay: "0.5s" }}
        />
      </div>

      {/* Page content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
