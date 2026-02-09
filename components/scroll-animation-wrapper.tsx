"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

export type ScrollAnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "rotate";

export interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animationType?: ScrollAnimationType;
  duration?: number;
  delay?: number;
  stagger?: number;
  /** When true, animations run once and do not re-run when scrolling back. */
  once?: boolean;
  className?: string;
}

/**
 * Wraps content and animates elements with [data-scroll-animate] when they enter the viewport.
 * Uses GSAP ScrollTrigger. Respects prefers-reduced-motion.
 */
export function ScrollAnimationWrapper({
  children,
  animationType = "fade-up",
  duration = 0.8,
  delay = 0,
  stagger = 0.1,
  once = true,
  className = "",
}: ScrollAnimationWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !containerRef.current) return;

    const elements = containerRef.current.querySelectorAll<HTMLElement>("[data-scroll-animate]");

    elements.forEach((element, index) => {
      const type = (element.dataset.scrollAnimate as ScrollAnimationType) || animationType;

      let fromVars: gsap.TweenVars = {};
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration,
        ease: "power3.out",
        delay: delay + index * stagger,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "top 55%",
          once,
          toggleActions: "play none none none",
        },
      };

      switch (type) {
        case "fade-up":
          fromVars = { opacity: 0, y: 50 };
          toVars.y = 0;
          break;
        case "fade-down":
          fromVars = { opacity: 0, y: -50 };
          toVars.y = 0;
          break;
        case "fade-left":
          fromVars = { opacity: 0, x: -50 };
          toVars.x = 0;
          break;
        case "fade-right":
          fromVars = { opacity: 0, x: 50 };
          toVars.x = 0;
          break;
        case "scale":
          fromVars = { opacity: 0, scale: 0.8 };
          toVars.scale = 1;
          break;
        case "rotate":
          fromVars = { opacity: 0, rotation: -10 };
          toVars.rotation = 0;
          break;
        default:
          fromVars = { opacity: 0 };
      }

      gsap.fromTo(element, fromVars, toVars);
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [animationType, duration, delay, stagger, once, reduceMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
