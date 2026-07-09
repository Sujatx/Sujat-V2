"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

export default function Preloader() {
  const [gone, setGone] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      window.__introDone = true;
      try {
        sessionStorage.setItem("introSeen", "1");
      } catch {}
      window.dispatchEvent(new Event("intro:start"));
      setGone(true);
    };

    let introSeen = false;
    try {
      introSeen = sessionStorage.getItem("introSeen") === "1";
    } catch {}

    if (reduced || window.__introDone || introSeen) {
      finish();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        finish();
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (numRef.current)
          numRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
      },
    })
      .to(numRef.current, { yPercent: -110, duration: 0.5, ease: "power3.in" }, "+=0.15")
      .to(
        wrapRef.current,
        { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
        "-=0.1"
      );

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[95] flex items-end justify-between bg-bg p-6 sm:p-10"
    >
      <span className="font-dune text-xs uppercase tracking-[0.3em] text-muted">
        Sujat Khan
      </span>
      <span className="block overflow-hidden">
        <span
          ref={numRef}
          className="font-display block text-7xl font-extrabold leading-none text-ink sm:text-9xl"
        >
          000
        </span>
      </span>
    </div>
  );
}
