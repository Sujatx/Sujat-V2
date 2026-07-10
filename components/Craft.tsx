"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChapterHeading from "./ChapterHeading";

gsap.registerPlugin(ScrollTrigger);

const crafts = [
  {
    num: "01",
    title: "Full-Stack Development",
    detail:
      "End-to-end products — React and TypeScript up front, Python and Node behind, Docker to ship it.",
  },
  {
    num: "02",
    title: "Design & Motion",
    detail:
      "Interfaces with intent: animation, typography, and the small details that make a site feel alive.",
  },
  {
    num: "03",
    title: "AI & Automation",
    detail:
      "Autonomous agents that browse, reason, and act — from pentesting to a voice-driven Windows copilot.",
  },
];

export default function Craft() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-craft-row]").forEach((row) => {
        gsap.from(row, {
          y: 70,
          opacity: 0,
          rotateX: 25,
          transformPerspective: 800,
          transformOrigin: "center top",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 85%" },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-16 sm:py-36"
      aria-label="What I do"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <ChapterHeading label="/what i do" title="The Craft" />

        <div>
          {crafts.map((craft) => (
            <div
              key={craft.num}
              data-craft-row
              className="group grid gap-4 border-t border-line py-10 transition-colors duration-500 hover:bg-surface/50 sm:grid-cols-[80px_1fr_1.2fr] sm:gap-10 sm:py-14 last:border-b"
            >
              <span className="font-mono2 text-sm text-accent">
                /{craft.num}
              </span>
              <h3 className="font-display text-2xl font-bold tracking-tight transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl">
                {craft.title}
              </h3>
              <p className="max-w-md leading-relaxed text-muted">
                {craft.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
