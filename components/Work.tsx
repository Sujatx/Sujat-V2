"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChapterHeading from "./ChapterHeading";
import { projects } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // as the next card slides over, the previous one recedes
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        // no dimming — projects stay fully visible; depth comes from a
        // slight scale-back while the next card slides over
        gsap.to(card, {
          scale: 0.97,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1].parentElement,
            start: "top 70%",
            end: "top top+=140",
            scrub: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-10 px-6 pb-20 pt-16 sm:px-10 sm:pb-32 sm:pt-36"
    >
      <div className="mx-auto w-full max-w-5xl">
      <ChapterHeading label="/ work" />

      <div className="flex flex-col gap-8 sm:gap-10">
        {projects.map((project) => (
          <div key={project.num} className="sticky top-[90px] sm:top-[110px]">
            <article
              data-card
              className="grid origin-top overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_-12px_40px_rgba(0,0,0,0.55)] will-change-transform md:min-h-[68vh] md:grid-cols-2"
            >
              {/* info */}
              <div className="order-2 flex flex-col justify-between gap-8 p-6 sm:p-10 md:order-1">
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono2 text-xs text-accent">
                      /{project.num}
                    </span>
                    <span className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-muted">
                      {project.live ? "Live project" : "Open source"}
                    </span>
                  </div>
                  <h3 className="font-display mb-4 text-3xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-4xl lg:text-5xl">
                    <span className="block">{project.titleLine1}</span>
                    <span className="block">{project.titleLine2}</span>
                  </h3>
                  <p className="max-w-md leading-relaxed text-muted">
                    {project.description}
                  </p>
                </div>

                <div>
                  <ul className="mb-8 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-line px-3 py-1 font-mono2 text-[10px] uppercase tracking-wider text-muted sm:text-[11px]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-mono2 text-xs uppercase tracking-[0.15em] text-bg transition-colors duration-300 hover:bg-accent"
                      >
                        Visit site
                        <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 rounded-full border border-ink/30 px-5 py-2.5 font-mono2 text-xs uppercase tracking-[0.15em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                      >
                        GitHub
                        <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* image */}
              <div className="group relative order-1 min-h-[240px] overflow-hidden border-b border-line sm:min-h-[320px] md:order-2 md:border-b-0 md:border-l">
                <Image
                  src={project.image}
                  alt={`${project.titleLine1} ${project.titleLine2} screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/30 via-transparent to-transparent md:bg-gradient-to-r" />
              </div>
            </article>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
