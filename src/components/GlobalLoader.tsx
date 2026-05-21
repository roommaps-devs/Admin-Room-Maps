"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function GlobalLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"hidden" | "enter" | "fill" | "exit">("hidden");
  const [fillLevel, setFillLevel] = useState(0);
  const prevPathname = useRef(pathname);
  const animFrameRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Don't show global loader on the map page — it has its own loading UI
  const isMapPage = pathname?.startsWith("/map");

  const clearAll = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // Don't animate when navigating to/from the map
    if (isMapPage || pathname?.startsWith("/map")) {
      clearAll();
      setPhase("hidden");
      setFillLevel(0);
      return;
    }

    clearAll();
    setFillLevel(0);
    setPhase("enter");

    // After enter animation (300ms), start fill
    const t1 = setTimeout(() => {
      setPhase("fill");

      const start = performance.now();
      const duration = 700;

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth ease-in-out
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        setFillLevel(eased * 100);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Hold full then exit
          const t2 = setTimeout(() => {
            setPhase("exit");
            const t3 = setTimeout(() => {
              setPhase("hidden");
              setFillLevel(0);
            }, 400);
            timersRef.current.push(t3);
          }, 200);
          timersRef.current.push(t2);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    }, 50);

    timersRef.current.push(t1);
    return clearAll;
  }, [pathname]);

  if (phase === "hidden" || isMapPage) return null;

  const isEntering = phase === "enter";
  const isExiting = phase === "exit";
  const opacity = isEntering ? 0 : isExiting ? 0 : 1;
  const scale = isEntering ? 0.92 : isExiting ? 1.04 : 1;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-all"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        opacity,
        transform: `scale(${scale})`,
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Card */}
      <div
        className="flex flex-col items-center gap-6 px-12 py-10 rounded-[32px]"
        style={{
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 30px 80px rgba(255,82,17,0.12), 0 8px 24px rgba(0,0,0,0.06)",
          border: "1px solid rgba(255,82,17,0.1)",
          transform: `scale(${isEntering ? 0.85 : isExiting ? 1.05 : 1})`,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* House SVG */}
        <div className="relative w-20 h-20">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden
          >
            <defs>
              {/* Gradient for the fill */}
              <linearGradient id="fill-gradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#FF5211" />
                <stop offset="100%" stopColor="#FF8A50" />
              </linearGradient>

              {/* Clip to house shape */}
              <clipPath id="house-clip-g">
                {/*
                  House: peaked roof + walls + door
                  Scaled inside 80x80 viewport
                */}
                <path d="
                  M40 6
                  L72 32
                  L66 32
                  L66 72
                  L48 72
                  L48 52
                  L32 52
                  L32 72
                  L14 72
                  L14 32
                  L8 32
                  Z
                " />
              </clipPath>

              {/* Glow filter */}
              <filter id="house-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Subtle background tint */}
            <path
              d="M40 6 L72 32 L66 32 L66 72 L48 72 L48 52 L32 52 L32 72 L14 72 L14 32 L8 32 Z"
              fill="rgba(255,82,17,0.06)"
              stroke="rgba(255,82,17,0.15)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Animated fill — bottom-up */}
            <rect
              x="0"
              y={80 - (fillLevel / 100) * 80}
              width="80"
              height="80"
              fill="url(#fill-gradient)"
              clipPath="url(#house-clip-g)"
            />

            {/* House outline on top */}
            <path
              d="M40 6 L72 32 L66 32 L66 72 L48 72 L48 52 L32 52 L32 72 L14 72 L14 32 L8 32 Z"
              fill="none"
              stroke={fillLevel > 60 ? "rgba(255,255,255,0.7)" : "#FF5211"}
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{ transition: "stroke 0.3s ease" }}
            />

            {/* Door outline */}
            <rect
              x="32" y="52" width="16" height="20"
              fill="none"
              stroke={fillLevel > 70 ? "rgba(255,255,255,0.5)" : "rgba(255,82,17,0.3)"}
              strokeWidth="1.5"
              style={{ transition: "stroke 0.3s ease" }}
            />

            {/* Shine overlay */}
            <path
              d="M40 6 L72 32 L66 32 L66 72 L48 72 L48 52 L32 52 L32 72 L14 72 L14 32 L8 32 Z"
              fill="url(#shine-grad)"
              clipPath="url(#house-clip-g)"
              opacity="0.08"
            />
            <defs>
              <linearGradient id="shine-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulsing ring when filling */}
          {phase === "fill" && fillLevel < 99 && (
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 0 0 rgba(255,82,17,0.4)",
                animation: "loader-pulse 1.2s ease-out infinite",
              }}
            />
          )}
        </div>

        {/* Brand label */}
        <div className="flex flex-col items-center gap-1.5">
          <span
            className="text-xl font-black tracking-tight"
            style={{ color: "#0A0A0A" }}
          >
            Room<span style={{ color: "#FF5211" }}>Maps</span>
          </span>

          {/* Progress bar */}
          <div
            className="w-28 h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,82,17,0.12)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${fillLevel}%`,
                background: "linear-gradient(to right, #FF5211, #FF8A50)",
                transition: "width 0.05s linear",
                boxShadow: "0 0 8px rgba(255,82,17,0.4)",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loader-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,82,17,0.35); }
          70%  { box-shadow: 0 0 0 22px rgba(255,82,17,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,82,17,0); }
        }
      `}</style>
    </div>
  );
}
