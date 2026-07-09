"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "@/lib/data";
import { scrollTo } from "@/lib/scroll";
import AsciiPortrait from "./AsciiPortrait";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-hero-heading]", { y: -160, opacity: 0 });
      gsap.set("[data-hero-tagline]", { y: -80, opacity: 0 });
      gsap.set("[data-hero-portrait]", { y: 420, opacity: 0 });
      gsap.set("[data-hero-meta]", { opacity: 0 });

      const play = () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-hero-heading]", { y: 0, opacity: 1, duration: 1.4 })
          .to("[data-hero-tagline]", { y: 0, opacity: 1, duration: 1.2 }, "-=1")
          .to(
            "[data-hero-portrait]",
            { y: 0, opacity: 1, duration: 1.8, ease: "power2.out" },
            "-=1.1"
          )
          .to("[data-hero-meta]", { opacity: 1, duration: 0.8 }, "-=0.8");
      };

      if (window.__introDone) play();
      else window.addEventListener("intro:start", play, { once: true });

      // scroll out: the portrait departs, the name recedes into space
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to("[data-hero-portrait]", { yPercent: -30, scale: 1.15, opacity: 0 }, 0)
        .to("[data-hero-heading]", { yPercent: -120, scale: 0.9, opacity: 0 }, 0)
        .to("[data-hero-tagline]", { yPercent: -160, opacity: 0 }, 0)
        .to("[data-hero-meta]", { opacity: 0 }, 0);

      // subtle mouse parallax, desktop only
      if (window.matchMedia("(pointer: fine)").matches) {
        const headingX = gsap.quickTo("[data-hero-heading]", "x", {
          duration: 0.6,
          ease: "power3",
        });
        const portraitX = gsap.quickTo("[data-hero-portrait]", "x", {
          duration: 0.9,
          ease: "power3",
        });
        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          headingX(nx * 30);
          portraitX(nx * -20);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 h-svh overflow-hidden"
      aria-label="Intro"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 sm:px-10 md:flex-row md:justify-between md:gap-16">
        {/* the portrait, rising */}
        <div
          data-hero-portrait
          role="img"
          aria-label={`ASCII portrait of ${personal.name}`}
          className="relative aspect-[3/4] w-[min(58vw,280px)] shrink-0 will-change-transform md:w-[360px] lg:w-[400px]"
        >
          <AsciiPortrait src="/images/pfp.png" flip />
        </div>

        {/* greeting */}
        <div className="text-center md:text-left">
          <h1
            data-hero-heading
            className="font-display select-none text-4xl font-bold tracking-tight will-change-transform sm:text-6xl lg:text-7xl"
          >
            hi, <span className="text-accent">sujat</span> here.
            <span
              aria-hidden
              className="caret-blink ml-2 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-accent sm:ml-3 sm:w-1"
            />
          </h1>
          <p
            data-hero-tagline
            className="mt-6 text-muted will-change-transform sm:text-lg"
          >
            {personal.title}
          </p>
        </div>
      </div>

      {/* bottom fade into space */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-bg via-bg/80 to-transparent md:h-40" />

      {/* quiet meta row */}
      <div
        data-hero-meta
        className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-center px-5 sm:px-10"
      >
        <button
          onClick={() => scrollTo("#work")}
          className="link-sweep font-mono2 text-[10px] uppercase tracking-[0.3em] text-muted transition-colors duration-300 hover:text-ink sm:text-xs"
        >
          View work ↓
        </button>
      </div>
    </section>
  );
}
