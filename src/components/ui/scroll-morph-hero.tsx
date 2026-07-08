"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { heroImages } from "../../data/portfolio";
import { useLanguage } from "../../i18n/useLanguage";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
  label: string;
  detail: string;
  imageAlt: string;
}

// --- Constants ---
const IMG_WIDTH  = 90;
const IMG_HEIGHT = 125;
const MAX_SCROLL   = 3000;

// Food & restaurant photography for Kenofidia
const IMAGES = heroImages;
const TOTAL_IMAGES = IMAGES.length;

const lerp = (start: number, end: number, t: number) =>
  start * (1 - t) + end * t;

// --- FlipCard ---
function FlipCard({ src, index, target, label, detail, imageAlt }: FlipCardProps) {
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
            alt={`${imageAlt} ${index + 1}`}
            decoding="async"
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
            {label}
          </p>
          <p className="text-xs font-medium" style={{ color: "#F5F0E8" }}>
            {detail}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Component ---
export default function ScrollMorphHero() {
  const { t } = useLanguage();
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

        {/* ── Intro text backdrop vignette ── */}
        <motion.div
          className="absolute pointer-events-none"
          animate={
            introPhase === "circle" && morphValue < 0.5
              ? { opacity: 1 - morphValue * 2 }
              : { opacity: 0 }
          }
          transition={{ duration: 0.8 }}
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "65vw",
            height: "35vh",
            background:
              "radial-gradient(ellipse at center, rgba(10,10,8,0.88) 30%, transparent 75%)",
            zIndex: 19,
          }}
        />

        {/* ── Intro text (fades as morph progresses) ── */}
        <div className="absolute z-20 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--white)",
              textShadow: "0 0 60px rgba(10,10,8,0.95), 0 2px 12px rgba(10,10,8,0.8)",
            }}
            className="text-3xl md:text-5xl font-light tracking-tight"
          >
            {t.hero.intro.lead}{" "}
            <em style={{ color: "var(--gold)" }}>{t.hero.intro.emphasis}</em>
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
          <span className="hero-scroll-label">{t.hero.scrollHint}</span>
          <span className="hero-scroll-line" />
        </motion.div>

        {/* ── Arc content (fades in when arc forms) ── */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute top-[22%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-8"
        >
          {/* Eyebrow label */}
          <p className="section-label justify-center" style={{ marginBottom: "1.75rem" }}>
            {t.hero.eyebrow}
          </p>

          {/* Main heading */}
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--white)",
              fontWeight: 300,
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              marginBottom: "1.5rem",
            }}
          >
            {t.hero.titleLead}
            <br />
            <em style={{ color: "var(--gold)" }}>{t.hero.titleEmphasis}</em>
          </h2>

          {/* Divider */}
          <div
            style={{
              width: "2.5rem",
              height: "1px",
              background: "var(--gold-dim)",
              marginBottom: "1.5rem",
              opacity: 0.6,
            }}
          />

          {/* Description */}
          <p
            style={{
              color: "var(--white-dim)",
              fontWeight: 300,
              fontSize: "0.9375rem",
              lineHeight: 1.85,
              maxWidth: "38ch",
              marginBottom: "2.25rem",
              letterSpacing: "0.01em",
            }}
          >
            {t.hero.body}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto w-full sm:w-auto">
            <a href="#work"    className="btn-primary" style={{ opacity: 1, textAlign: "center" }}>{t.hero.viewWork}</a>
            <a href="#contact" className="btn-ghost"   style={{ opacity: 1, textAlign: "center" }}>{t.hero.startProject}</a>
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
              const circleAngle  = ((i / TOTAL_IMAGES) * 360 + 144) % 360;
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
                label={t.hero.flipLabel}
                detail={t.hero.flipText}
                imageAlt={t.hero.imageAlt}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
