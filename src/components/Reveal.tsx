"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Adds the `in` class once the block scrolls into view. Children marked `.stg` animate in with it. */
export default function Reveal({ children, className = "", delay = 0, stagger = false }: { children: ReactNode; className?: string; delay?: number; stagger?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`${stagger ? "rvc" : "rv"} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</div>;
}
