"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal, skills } from "@/lib/data";
import { ntr } from "@/lib/fonts";

gsap.registerPlugin(ScrollTrigger);

// words that get the accent treatment in the bio
const HIGHLIGHTS = new Set(["developer", "shipping"]);

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
      className="relative z-10 flex items-center px-6 py-16 sm:px-10 sm:py-24 lg:min-h-svh"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-10 flex items-center gap-5 sm:mb-14 sm:gap-7">
          <h2 className={`${ntr.className} whitespace-nowrap text-3xl font-extrabold tracking-tight text-white [-webkit-text-stroke:0.75px_white] sm:text-4xl lg:text-[2.75rem]`}>
            / about me
          </h2>
          <span className="h-px max-w-md flex-1 bg-line" aria-hidden />
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_minmax(0,360px)]">
          {/* story */}
          <div className={`${ntr.className} max-w-2xl`}>
            <p data-bio className="text-lg leading-relaxed text-ink/80 sm:text-xl">
              {personal.bio.split(" ").map((word, i) => {
                const accented = HIGHLIGHTS.has(
                  word.toLowerCase().replace(/[^a-z]/g, "")
                );
                return (
                  <span
                    key={i}
                    data-word
                    className={`inline-block ${accented ? "font-medium text-accent" : ""}`}
                  >
                    {word}&nbsp;
                  </span>
                );
              })}
            </p>

            <div data-about-aside className="mt-7">
              <p className="mb-4 text-lg leading-relaxed text-muted sm:text-xl">
                Here are some technologies I have been working with:
              </p>
              <ul className="grid max-w-md grid-cols-2 gap-x-10 gap-y-1.5">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2.5 text-base leading-snug text-ink/80 sm:text-lg"
                  >
                    <span className="text-accent" aria-hidden>
                      ▸
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <p data-about-aside className="mt-7 text-lg leading-relaxed text-muted sm:text-xl">
              In my free time, you'll find me in a corner reading books, sketching a masterpiece or just sitting with my thoughts. 
            </p>
          </div>

          {/* photo card */}
          <div
            data-about-aside
            className="hidden w-full lg:block lg:max-w-[315px]"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8),0_18px_50px_-20px_rgba(168,85,247,0.35)] backdrop-blur-md transition-transform duration-500 will-change-transform hover:-translate-y-2">
              {/* glass sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent"
              />
              <Image
                src="/images/pfp.png"
                alt={personal.name}
                fill
                sizes="(min-width: 1024px) 315px, 260px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
