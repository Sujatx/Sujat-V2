"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "@/lib/data";
import { scrollTo } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // heading arrives from deep space
      gsap.from("[data-contact-title]", {
        scale: 0.5,
        opacity: 0,
        yPercent: 30,
        transformPerspective: 900,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        },
      });
      gsap.from("[data-contact-fade]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 55%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className="relative z-10 flex min-h-svh flex-col justify-between px-6 pt-28 sm:px-10 sm:pt-36"
    >
      <div className="mx-auto w-full max-w-6xl" style={{ perspective: "900px" }}>
        <p
          data-contact-fade
          className="mb-8 font-mono2 text-xs uppercase tracking-[0.3em] text-accent"
        >
          /contact
        </p>

        <h2
          data-contact-title
          className="font-dune origin-left text-[clamp(2.6rem,10vw,8.5rem)] uppercase leading-[1.05] tracking-wide will-change-transform"
        >
          Say{" "}
          <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)]">
            Hello
          </span>
        </h2>

        <p
          data-contact-fade
          className="mt-8 max-w-md leading-relaxed text-muted"
        >
          Got an idea worth building, or just want to talk shop? The signal
          always gets through.
        </p>

        <a
          data-contact-fade
          href={`mailto:${personal.email}`}
          className="group mt-10 inline-flex items-center gap-4"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ink/30 transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent sm:h-16 sm:w-16">
            ↗
          </span>
          <span className="link-sweep text-xl text-ink sm:text-3xl">
            {personal.email}
          </span>
        </a>
      </div>

      <div className="mx-auto mt-24 w-full max-w-6xl border-t border-line py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-muted">
            © 2026 {personal.name} — Local time {time}
          </span>
          <div className="flex items-center gap-6">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="link-sweep font-mono2 text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              Resume
            </a>
            <a
              href={personal.social.github}
              target="_blank"
              rel="noreferrer"
              className="link-sweep font-mono2 text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              GitHub
            </a>
            <a
              href={personal.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="link-sweep font-mono2 text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              LinkedIn
            </a>
            <button
              onClick={() => scrollTo(0)}
              className="link-sweep font-mono2 text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
