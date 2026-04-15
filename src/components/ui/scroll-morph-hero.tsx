"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

// --- Constants ---
const IMG_WIDTH  = 90;
const IMG_HEIGHT = 125;
const TOTAL_IMAGES = 20;
const MAX_SCROLL   = 3000;

// Food & restaurant photography for Kenofidia
const IMAGES = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&q=80",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&q=80",
  "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=300&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80",
  "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=300&q=80",
  "https://images.unsplash.com/photo-1611095210561-67f37abd9dac?w=300&q=80",
  "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&q=80",
  "https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=300&q=80",
  "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=300&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80",
];

const lerp = (start: number, end: number, t: number) =>
  start * (1 - t) + end * t;

// --- FlipCard ---
function FlipCard({ src, index, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{ type: "spring", stiffness: 40, damping: 15 }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-lg shadow-xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={src}
            alt={`dish-${index}`}
            className="h-full w-full object-cover"
          />
          {/* Gold overlay on hover */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-transparent" />
          {/* Subtle gold border */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{ boxShadow: "inset 0 0 0 1px rgba(201,169,110,0.25)" }}
          />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-lg shadow-xl flex flex-col items-center justify-center p-3"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "#111110",
            border: "1px solid rgba(201,169,110,0.3)",
          }}
        >
          <p
            className="text-[7px] font-bold uppercase tracking-widest mb-1"
            style={{ color: "#C9A96E" }}
          >
            View
          </p>
          <p className="text-xs font-medium" style={{ color: "#F5F0E8" }}>
            Details
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Component ---
export default function ScrollMorphHero() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Container size observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  // Virtual scroll
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Once the animation is done, let the page scroll naturally
      if (scrollRef.current >= MAX_SCROLL && e.deltaY > 0) return;
      e.preventDefault();
      const next = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const delta = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      // Once done, allow touch scroll to pass through too
      if (scrollRef.current >= MAX_SCROLL && delta > 0) return;
      const next = Math.min(Math.max(scrollRef.current + delta, 0), MAX_SCROLL);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  // Motion values
  const morphProgress    = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph      = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate     = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });
  const mouseX           = useMotionValue(0);
  const smoothMouseX     = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX.set((((e.clientX - rect.left) / rect.width) * 2 - 1) * 100);
    };
    container.addEventListener("mousemove", onMove);
    return () => container.removeEventListener("mousemove", onMove);
  }, [mouseX]);

  // Render state
  const [morphValue,    setMorphValue]    = useState(0);
  const [rotateValue,   setRotateValue]   = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const u1 = smoothMorph.on("change", setMorphValue);
    const u2 = smoothScrollRotate.on("change", setRotateValue);
    const u3 = smoothMouseX.on("change", setParallaxValue);
    return () => { u1(); u2(); u3(); };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  // Intro sequence
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("line"),   500);
    const t2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const scatterPositions = useMemo(
    () =>
      IMAGES.map(() => ({
        x: (Math.random() - 0.5) * 1500,
        y: (Math.random() - 0.5) * 1000,
        rotation: (Math.random() - 0.5) * 180,
        scale: 0.6,
        opacity: 0,
      })),
    []
  );

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY       = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

        {/* ── Intro text (fades as morph progresses) ── */}
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            style={{ fontFamily: "var(--font-serif)", color: "var(--white)" }}
            className="text-3xl md:text-5xl font-light tracking-tight"
          >
            We make restaurants{" "}
            <em style={{ color: "var(--gold)" }}>unforgettable.</em>
          </motion.h1>
        </div>

        {/* ── Scroll hint (visible during intro, fades with morph) ── */}
        <motion.div
          className="hero-scroll-hint"
          style={{
            opacity: introPhase === "circle" && morphValue < 0.4
              ? Math.max(0, 0.7 - morphValue * 2)
              : 0,
          }}
        >
          <span className="hero-scroll-label">Scroll to explore</span>
          <span className="hero-scroll-line" />
        </motion.div>

        {/* ── Arc content (fades in when arc forms) ── */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute top-[22%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6"
        >
          <p
            className="section-label mb-4 justify-center"
          >
            Restaurant Photography &amp; Marketing
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--white)",
              fontWeight: 300,
            }}
            className="text-4xl md:text-6xl tracking-tight mb-4 leading-none"
          >
            Visual stories that
            <br />
            <em style={{ color: "var(--gold)" }}>fill tables.</em>
          </h2>
          <p
            className="text-sm md:text-base max-w-md leading-relaxed mb-6"
            style={{ color: "var(--white-dim)", fontWeight: 300 }}
          >
            Cinematic food photography &amp; strategic marketing
            <br className="hidden md:block" />
            for restaurants that deserve to be discovered.
          </p>
          <div className="flex gap-4 pointer-events-auto">
            <a
              href="#work"
              className="btn-primary"
              style={{ opacity: 1 }}
            >
              View Our Work
            </a>
            <a
              href="#contact"
              className="btn-ghost"
              style={{ opacity: 1 }}
            >
              Start a Project
            </a>
          </div>
        </motion.div>

        {/* ── Cards ── */}
        <div className="relative flex items-center justify-center w-full h-full">
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 70;
              const lineTotal   = TOTAL_IMAGES * lineSpacing;
              target = {
                x: i * lineSpacing - lineTotal / 2,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
              };
            } else {
              const isMobile     = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);

              // Circle
              const circleRadius = Math.min(minDimension * 0.35, 350);
              const circleAngle  = (i / TOTAL_IMAGES) * 360;
              const circleRad    = (circleAngle * Math.PI) / 180;
              const circlePos    = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              // Arc
              const baseRadius  = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius   = baseRadius * (isMobile ? 1.4 : 1.1);
              const arcApexY    = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY  = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 100 : 130;
              const startAngle  = -90 - spreadAngle / 2;
              const step        = spreadAngle / (TOTAL_IMAGES - 1);

              const scrollProgress  = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation     = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;

              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad          = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8,
              };

              target = {
                x:        lerp(circlePos.x, arcPos.x, morphValue),
                y:        lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale:    lerp(1, arcPos.scale, morphValue),
                opacity:  1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
