"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent, motion, useTransform } from "framer-motion";

const TOTAL_FRAMES = 36;
const FRAME_PATH = (n: number) =>
  `/car_animation/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

interface TextSection {
  startProgress: number;
  endProgress: number;
  headline: string;
  sub?: string;
  align: "center" | "left" | "right";
}

const TEXT_SECTIONS: TextSection[] = [
  {
    startProgress: 0,
    endProgress: 0.18,
    headline: "Your Journey,\nElevated",
    sub: "Introducing Techtaxi — premium car rentals\nprecision-engineered for every road.",
    align: "center",
  },
  {
    startProgress: 0.22,
    endProgress: 0.48,
    headline: "Zero Compromise\nPerformance",
    sub: "Handpicked fleet. Rigorous inspection.\nAlways showroom-ready for you.",
    align: "left",
  },
  {
    startProgress: 0.52,
    endProgress: 0.78,
    headline: "Every Detail\nPerfected",
    sub: "From booking to drop-off — seamless,\ntransparent, and utterly effortless.",
    align: "right",
  },
  {
    startProgress: 0.82,
    endProgress: 1.0,
    headline: "Book Now.\nDrive Today.",
    sub: "Instant confirmation. No hidden fees.",
    align: "center",
  },
];

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

export default function CarScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const { width, height } = useWindowSize();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) setLoaded(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  // Draw a frame to canvas with depth vignette
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIndex];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { naturalWidth: iw, naturalHeight: ih } = img;
    const cw = canvas.width;
    const ch = canvas.height;

    // Contain-fit with dark background
    const scale = Math.min(cw / iw, ch / ih) * 1.02; // slight zoom for premium feel
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = (cw - sw) / 2;
    const dy = (ch - sh) / 2;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, sw, sh);

    // Radial vignette for depth
    const vignette = ctx.createRadialGradient(
      cw / 2, ch / 2, ch * 0.2,
      cw / 2, ch / 2, ch * 0.85
    );
    vignette.addColorStop(0, "rgba(5,5,5,0)");
    vignette.addColorStop(1, "rgba(5,5,5,0.72)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cw, ch);

    // Bottom gradient fade into page
    const bottomGrad = ctx.createLinearGradient(0, ch * 0.7, 0, ch);
    bottomGrad.addColorStop(0, "rgba(5,5,5,0)");
    bottomGrad.addColorStop(1, "rgba(5,5,5,1)");
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, 0, cw, ch);

    // Top gradient fade
    const topGrad = ctx.createLinearGradient(0, 0, 0, ch * 0.18);
    topGrad.addColorStop(0, "rgba(5,5,5,0.7)");
    topGrad.addColorStop(1, "rgba(5,5,5,0)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, cw, ch);
  }, []);

  // Resize canvas and redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    if (loaded) drawFrame(currentFrameRef.current);
  }, [width, height, loaded, drawFrame]);

  // Draw first frame once loaded
  useEffect(() => {
    if (loaded) drawFrame(0);
  }, [loaded, drawFrame]);

  // Scroll-linked animation
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!loaded) return;
    const raw = progress * (TOTAL_FRAMES - 1);
    const frame = Math.min(Math.max(Math.round(raw), 0), TOTAL_FRAMES - 1);
    if (frame === currentFrameRef.current) return;
    currentFrameRef.current = frame;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawFrame(frame));
  });

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* Sticky Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            background: "#050505",
          }}
        />

        {/* Premium Loading Overlay */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]">
            {/* Spinning outer ring */}
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border border-white/5" />
              <div
                className="absolute inset-0 rounded-full border-t-2 animate-spin"
                style={{ borderColor: "#c9a84c transparent transparent transparent" }}
              />
              {/* Inner pulse dot */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{
                  background: "#c9a84c",
                  boxShadow: "0 0 12px rgba(201,168,76,0.8)",
                  animation: "pulse-glow 1.5s ease-in-out infinite",
                }}
              />
            </div>

            {/* Brand name */}
            <p className="text-2xl font-semibold tracking-tight mb-4">
              <span className="gold-text">Tech</span>
              <span className="text-white/30">taxi</span>
            </p>
            <p className="text-white/25 text-xs tracking-[0.35em] uppercase font-light">
              Loading Experience
            </p>

            {/* Progress dots */}
            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "rgba(201,168,76,0.6)",
                    animation: `pulse-glow 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Text Overlays */}
        {loaded &&
          TEXT_SECTIONS.map((section, i) => (
            <TextOverlay
              key={i}
              section={section}
              scrollProgress={scrollYProgress}
            />
          ))}

        {/* Scroll indicator */}
        <ScrollIndicator scrollProgress={scrollYProgress} />

        {/* Gold accent line at bottom */}
        {loaded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
            }}
          />
        )}
      </div>
    </div>
  );
}

function TextOverlay({
  section,
  scrollProgress,
}: {
  section: TextSection;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const { startProgress, endProgress, headline, sub, align } = section;
  const midPoint = (startProgress + endProgress) / 2;
  const fadeWindow = (endProgress - startProgress) * 0.25;

  const opacity = useTransform(
    scrollProgress,
    [startProgress, startProgress + fadeWindow, midPoint, endProgress - fadeWindow, endProgress],
    [0, 1, 1, 1, 0]
  );

  const y = useTransform(
    scrollProgress,
    [startProgress, startProgress + fadeWindow, endProgress - fadeWindow, endProgress],
    [40, 0, 0, -30]
  );

  const alignClass =
    align === "left"
      ? "items-start text-left pl-8 md:pl-20"
      : align === "right"
        ? "items-end text-right pr-8 md:pr-20"
        : "items-center text-center";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center pointer-events-none px-4 ${alignClass}`}
    >
      <div className={`max-w-xl ${align === "center" ? "mx-auto" : ""}`}>
        {/* Gold accent bar */}
        <div
          className={`h-px w-12 mb-5 ${align === "right" ? "ml-auto" : align === "center" ? "mx-auto" : ""}`}
          style={{ background: "linear-gradient(90deg, #c9a84c, rgba(201,168,76,0.2))" }}
        />
        <motion.h2
          className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white/95 leading-[1.05] whitespace-pre-line mb-5"
          style={{ textShadow: "0 0 80px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)" }}
        >
          {headline}
        </motion.h2>
        {sub && (
          <motion.p
            className="text-base md:text-xl text-[#E5E5E5] font-light leading-relaxed tracking-wide whitespace-pre-line"
            style={{ textShadow: "0 0 40px rgba(0,0,0,0.95)" }}
          >
            {sub}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function ScrollIndicator({
  scrollProgress,
}: {
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(scrollProgress, [0, 0.08], [1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
    >
      <span className="text-white/30 text-[10px] tracking-[0.35em] uppercase font-light">
        Scroll
      </span>
      {/* Animated chevron */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-1"
      >
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        <svg
          viewBox="0 0 12 8"
          className="w-3 h-2"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
        >
          <path d="M1 1l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
