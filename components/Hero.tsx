"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "@/lib/data";
import AsciiPortrait from "./AsciiPortrait";
import { ntr } from "@/lib/fonts";

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

      const play = () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-hero-heading]", { y: 0, opacity: 1, duration: 1.4 })
          .to("[data-hero-tagline]", { y: 0, opacity: 1, duration: 1.2 }, "-=1")
          .to(
            "[data-hero-portrait]",
            { y: 0, opacity: 1, duration: 1.8, ease: "power2.out" },
            "-=1.1"
          );
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
        .to("[data-hero-tagline]", { yPercent: -160, opacity: 0 }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 h-svh overflow-hidden"
      aria-label="Intro"
    >
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 sm:px-10 md:flex-row md:justify-between md:gap-16">
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
            className={`${ntr.className} select-none text-5xl font-normal tracking-tight will-change-transform sm:text-6xl lg:text-7xl`}
          >
            hi, <span className="font-bold text-accent">sujat</span> here.
            <span
              aria-hidden
              className="caret-blink ml-2 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-accent sm:ml-3 sm:w-1"
            />
          </h1>
          <div data-hero-tagline className="will-change-transform">
            <p
              className={`${ntr.className} mt-6 max-w-md text-lg font-medium text-muted sm:text-xl`}
            >
              {personal.title}
            </p>

            <a
              href={`mailto:${personal.email}`}
              className="group mt-8 inline-flex items-center gap-2.5 rounded-xl border-2 border-accent px-5 py-3 font-bold text-accent transition-colors duration-300 hover:bg-accent/10"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
              Say hi!
            </a>
          </div>
        </div>
      </div>

      {/* bottom fade into space */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-bg via-bg/80 to-transparent md:h-40" />
    </section>
  );
}
