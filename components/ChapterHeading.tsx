"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  label: string; // e.g. "/what i do"
  title?: string; // DuneRise, keep it short & punctuation-free
};

/**
 * Minimal section header: a small slash-label over a rule line, with an
 * optional display title that scales in as it enters (scrubbed to scroll).
 */
export default function ChapterHeading({ label, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const titleEl = el.querySelector("[data-ch-title]");
      if (titleEl) {
        gsap.fromTo(
          titleEl,
          { scale: 0.8, opacity: 0.25, yPercent: 24, transformPerspective: 900 },
          {
            scale: 1,
            opacity: 1,
            yPercent: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 55%",
              scrub: true,
            },
          }
        );
      }
      gsap.fromTo(
        el.querySelectorAll("[data-ch-meta]"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 50%",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="mb-14 sm:mb-20" style={{ perspective: "900px" }}>
      <div className="mb-6 flex items-center gap-4">
        <span
          data-ch-meta
          className="font-mono2 text-[11px] uppercase tracking-[0.3em] text-accent"
        >
          {label}
        </span>
        <span data-ch-meta className="h-px flex-1 bg-line" aria-hidden />
      </div>
      {title && (
        <h2
          data-ch-title
          className="font-dune origin-left text-[clamp(1.8rem,6vw,4.8rem)] uppercase leading-tight tracking-wide text-ink will-change-transform"
        >
          {title}
        </h2>
      )}
    </div>
  );
}
