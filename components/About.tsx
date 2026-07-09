"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AsciiPortrait from "./AsciiPortrait";
import { personal, skills } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // words brighten as you travel through the paragraph
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.3 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-bio]",
            start: "top 75%",
            end: "bottom 45%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-about-aside]").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 px-6 py-28 sm:px-10 sm:py-36"
    >
      <div className="mx-auto w-full max-w-6xl">
      <div className="mb-16 flex items-center gap-4 sm:mb-20">
        <span className="font-mono2 text-[11px] uppercase tracking-[0.3em] text-accent">
          /about me
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden />
      </div>

      <div className="grid items-center gap-16 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-24">
        {/* story */}
        <div className="max-w-2xl">
          <p
            data-bio
            className="font-display text-xl font-bold leading-[1.55] tracking-tight sm:text-2xl"
          >
            {personal.bio.split(" ").map((word, i) => (
              <span key={i} data-word className="inline-block">
                {word}&nbsp;
              </span>
            ))}
          </p>

          <div data-about-aside className="mt-12">
            <p className="mb-6 leading-relaxed text-muted">
              Here are some of the technologies I&apos;ve been working with —
            </p>
            <ul className="grid max-w-md grid-cols-2 gap-x-10 gap-y-4">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-2.5 font-mono2 text-xs uppercase tracking-[0.2em] text-ink/90"
                >
                  <span className="text-accent" aria-hidden>
                    ▸
                  </span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <p data-about-aside className="mt-12 leading-relaxed text-muted">
            Currently shipping side projects, contributing to open source when
            something catches my eye, and figuring it out as I go.
          </p>
        </div>

        {/* portrait */}
        <div data-about-aside className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <div className="relative aspect-[3/4] w-full" role="img" aria-label="ASCII portrait of Sujat Khan">
            <AsciiPortrait src="/images/pfp.png" />
            <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bg/70 px-4 py-1.5 font-mono2 text-[10px] uppercase tracking-[0.2em] text-ink/90 backdrop-blur-sm">
              To define is to limit.
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
