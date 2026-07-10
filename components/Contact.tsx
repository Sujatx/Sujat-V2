"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "@/lib/data";
import { ntr } from "@/lib/fonts";

gsap.registerPlugin(ScrollTrigger);

const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
};

// blinks a message in morse timing: dot = 1 unit, dash = 3 units,
// 1 unit gap within a letter, 3 between letters, 7 between words
function useMorseBlink(message: string, unit = 140) {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const timeline: { on: boolean; duration: number }[] = [];
    message
      .toUpperCase()
      .split(" ")
      .forEach((word) => {
        [...word].forEach((letter, li, letters) => {
          const code = MORSE[letter] ?? "";
          [...code].forEach((symbol, si) => {
            timeline.push({ on: true, duration: symbol === "-" ? unit * 3 : unit });
            if (si < code.length - 1) timeline.push({ on: false, duration: unit });
          });
          if (li < letters.length - 1) timeline.push({ on: false, duration: unit * 3 });
        });
        timeline.push({ on: false, duration: unit * 7 });
      });

    let cancelled = false;
    let timeoutId: number;
    let i = 0;
    const step = () => {
      if (cancelled || timeline.length === 0) return;
      const frame = timeline[i % timeline.length];
      setLit(frame.on);
      i += 1;
      timeoutId = window.setTimeout(step, frame.duration);
    };
    step();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [message, unit]);

  return lit;
}

export default function Contact() {
  const isLit = useMorseBlink("We are not alone");

  const sectionRef = useRef<HTMLElement>(null);

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
      className="relative z-10 flex flex-col justify-between px-6 pt-16 sm:px-10 sm:pt-36 lg:min-h-svh"
    >
      <div className="mx-auto w-full max-w-5xl" style={{ perspective: "900px" }}>
        <div data-contact-fade className="mb-8 flex items-center gap-5 sm:gap-7">
          <span
            className={`${ntr.className} whitespace-nowrap text-3xl font-extrabold tracking-tight text-white [-webkit-text-stroke:0.75px_white] sm:text-4xl lg:text-[2.75rem]`}
          >
            / contact
          </span>
          <span className="h-px max-w-md flex-1 bg-line" aria-hidden />
        </div>

        <h2
          data-contact-title
          className={`${ntr.className} origin-center text-center text-[clamp(1.5rem,4vw,3rem)] font-extrabold uppercase leading-[1.15] tracking-wide will-change-transform`}
        >
          The odds were astronomical.
          <br />
          Yet here <span className="text-accent">you</span> are.
        </h2>

        <a
          data-contact-fade
          href={`mailto:${personal.email}`}
          data-morse=".-- . / .- .-. . / -. --- - / .- .-.. --- -. ."
          className="group relative mx-auto mt-10 flex w-fit flex-col items-center gap-3"
        >
          <span className="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-3 py-1.5 font-mono2 text-[11px] text-ink/80 opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-opacity duration-200 group-hover:opacity-100">
            Morse code?
          </span>

          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent text-accent transition-colors duration-300 group-hover:bg-accent/10">
            <span
              className="absolute inset-0 rounded-full border border-accent transition-all duration-100"
              style={{
                opacity: isLit ? 0.6 : 0,
                transform: isLit ? "scale(1.35)" : "scale(1)",
              }}
              aria-hidden
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative h-6 w-6"
              aria-hidden
            >
              <path d="M4 10a7.31 7.31 0 0 0 10 10Z" />
              <path d="m9 15 3-3" />
              <path d="M17 13a6 6 0 0 0-6-6" />
              <path d="M21 13A10 10 0 0 0 11 3" />
            </svg>
          </span>
          <span className={`${ntr.className} text-base font-bold text-accent`}>
            Leave a signal
          </span>
        </a>
      </div>

      <div className="mx-auto mt-16 w-full max-w-5xl py-6 sm:mt-24">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className={`${ntr.className} text-[11px] uppercase tracking-[0.2em] text-muted`}>
            Built and designed by {personal.name}.
          </span>
          <span className={`${ntr.className} text-[11px] uppercase tracking-[0.2em] text-muted`}>
            All rights reserved. ©
          </span>
        </div>
      </div>
    </footer>
  );
}
