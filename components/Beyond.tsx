"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ChapterHeading from "./ChapterHeading";
import { ntr } from "@/lib/fonts";

gsap.registerPlugin(ScrollTrigger);

type Facet = {
  key: string;
  title: string;
  subtitle: string;
  story: string;
  visual: React.ReactNode;
};

// Sicilian Defense after 1.e4 c5 2.Nf3 — squares as [file 0-7, rank row 0=8th]
const CHESS_PIECES: { col: number; row: number; glyph: string; white: boolean }[] = [
  // black back rank + pawns (c-pawn to c5)
  { col: 0, row: 0, glyph: "♜", white: false },
  { col: 1, row: 0, glyph: "♞", white: false },
  { col: 2, row: 0, glyph: "♝", white: false },
  { col: 3, row: 0, glyph: "♛", white: false },
  { col: 4, row: 0, glyph: "♚", white: false },
  { col: 5, row: 0, glyph: "♝", white: false },
  { col: 6, row: 0, glyph: "♞", white: false },
  { col: 7, row: 0, glyph: "♜", white: false },
  ...[0, 1, 3, 4, 5, 6, 7].map((col) => ({ col, row: 1, glyph: "♟", white: false })),
  { col: 2, row: 3, glyph: "♟", white: false }, // c5
  // white pawns (e-pawn to e4) + back rank, knight to f3
  { col: 4, row: 4, glyph: "♟", white: true }, // e4
  ...[0, 1, 2, 3, 5, 6, 7].map((col) => ({ col, row: 6, glyph: "♟", white: true })),
  { col: 5, row: 5, glyph: "♞", white: true }, // Nf3
  { col: 0, row: 7, glyph: "♜", white: true },
  { col: 1, row: 7, glyph: "♞", white: true },
  { col: 2, row: 7, glyph: "♝", white: true },
  { col: 3, row: 7, glyph: "♛", white: true },
  { col: 4, row: 7, glyph: "♚", white: true },
  { col: 5, row: 7, glyph: "♝", white: true },
  { col: 7, row: 7, glyph: "♜", white: true },
];

function Barbell() {
  // side-view loaded bar: plates mirrored around the center, purple 45s
  const plates = [
    { dx: 0, w: 7, h: 74, fill: "#a855f7" },
    { dx: 9, w: 6, h: 58, fill: "#3a3a4a" },
    { dx: 17, w: 5, h: 42, fill: "#3a3a4a" },
  ];
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full" aria-hidden>
      {/* bar */}
      <rect x="8" y="57.5" width="204" height="5" rx="2.5" fill="#c9c9d4" />
      {/* knurling */}
      {[86, 92, 98, 104, 110, 116, 122, 128].map((x) => (
        <rect key={x} x={x} y="57.5" width="2" height="5" fill="#8b8b98" />
      ))}
      {/* collars + plates, mirrored */}
      {[52, 168].map((cx, side) => (
        <g key={cx}>
          <rect
            x={side === 0 ? cx + 26 : cx - 30}
            y="53"
            width="4"
            height="14"
            rx="2"
            fill="#8b8b98"
          />
          {plates.map((p) => {
            const x = side === 0 ? cx - p.dx - p.w : cx + p.dx;
            return (
              <rect
                key={p.dx}
                x={x}
                y={60 - p.h / 2}
                width={p.w}
                height={p.h}
                rx="3"
                fill={p.fill}
              />
            );
          })}
        </g>
      ))}
      {/* floor shadow */}
      <ellipse cx="110" cy="106" rx="78" ry="4" fill="#000" opacity="0.4" />
    </svg>
  );
}

function BookStack() {
  // eight spines for the eight books, stacked with a slight offset
  const books = [
    { x: 46, y: 90, w: 128, fill: "#2e2e3c", band: "#8b8b98" },
    { x: 56, y: 79, w: 112, fill: "#3a3a4a", band: "#c9c9d4" },
    { x: 50, y: 68, w: 122, fill: "#a855f7", band: "#e8e8ee" },
    { x: 62, y: 57, w: 100, fill: "#23232e", band: "#a855f7" },
    { x: 52, y: 46, w: 118, fill: "#3a3a4a", band: "#8b8b98" },
    { x: 60, y: 35, w: 104, fill: "#2e2e3c", band: "#c9c9d4" },
    { x: 48, y: 24, w: 124, fill: "#23232e", band: "#a855f7" },
    { x: 64, y: 13, w: 96, fill: "#a855f7", band: "#e8e8ee" },
  ];
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full" aria-hidden>
      {books.map((book, i) => (
        <g key={i}>
          <rect
            x={book.x}
            y={book.y}
            width={book.w}
            height="10"
            rx="2.5"
            fill={book.fill}
          />
          {/* pages edge */}
          <rect
            x={book.x + 3}
            y={book.y + 2}
            width="3.5"
            height="6"
            rx="1.25"
            fill="#e8e8ee"
            opacity="0.75"
          />
          {/* title band on the spine */}
          <rect
            x={book.x + book.w * 0.42}
            y={book.y + 3.75}
            width={book.w * 0.36}
            height="2.5"
            rx="1.25"
            fill={book.band}
            opacity="0.85"
          />
        </g>
      ))}
      <ellipse cx="110" cy="107" rx="72" ry="4" fill="#000" opacity="0.4" />
    </svg>
  );
}

function Pencil() {
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full" aria-hidden>
      {/* the sketched line */}
      <path
        d="M28 96 q 22 -16 44 0 t 44 0 t 44 0 t 32 -6"
        fill="none"
        stroke="#c9c9d4"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* pencil, angled as if mid-stroke */}
      <g transform="rotate(-32 60 78)">
        {/* lead + wood tip */}
        <polygon points="42,74 58,66 58,82" fill="#c9c9d4" />
        <polygon points="42,74 48,71 48,77" fill="#12121a" />
        {/* body */}
        <rect x="58" y="66" width="96" height="16" rx="2" fill="#a855f7" />
        <rect x="58" y="71.5" width="96" height="5" fill="#8b45d4" opacity="0.6" />
        {/* ferrule + eraser */}
        <rect x="154" y="66" width="8" height="16" fill="#8b8b98" />
        <rect x="162" y="66" width="12" height="16" rx="4" fill="#c9c9d4" />
      </g>
    </svg>
  );
}

function SketchShow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const slides = el.querySelectorAll<HTMLElement>("[data-slide]");
    const drift = el.querySelector("[data-pencil-drift]");
    const HOLD = 2.4;

    gsap.set(slides[0], { xPercent: 0 });
    gsap.set([slides[1], slides[2]], { xPercent: 100 });

    // pencil drifts across, then the reel slides: sketch 1 -> sketch 2 -> loop
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power3.inOut", duration: 0.9 },
    });
    tl.fromTo(drift, { x: -26 }, { x: 26, duration: HOLD, ease: "none" })
      .to(slides[0], { xPercent: -100 })
      .to(slides[1], { xPercent: 0 }, "<")
      .to({}, { duration: HOLD })
      .set(slides[0], { xPercent: 100 })
      .to(slides[1], { xPercent: -100 })
      .to(slides[2], { xPercent: 0 }, "<")
      .to({}, { duration: HOLD })
      .set(slides[1], { xPercent: 100 })
      .to(slides[2], { xPercent: -100 })
      .to(slides[0], { xPercent: 0 }, "<")
      .set(slides[2], { xPercent: 100 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div data-slide className="absolute inset-0 will-change-transform">
        <div data-pencil-drift className="h-full w-full">
          <Pencil />
        </div>
      </div>
      <div data-slide className="absolute inset-0 will-change-transform">
        <Image
          src="/sketches/sketch-01.png"
          alt="Charcoal sketch of an armored knight"
          fill
          sizes="(max-width: 640px) 90vw, 25vw"
          className="object-cover object-top"
        />
      </div>
      <div data-slide className="absolute inset-0 will-change-transform">
        <Image
          src="/sketches/sketch-02.png"
          alt="Charcoal sketch of veiled eyes"
          fill
          sizes="(max-width: 640px) 90vw, 25vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

function ChessBoard() {
  const SQ = 14;
  const PAD = 8;
  return (
    <svg viewBox="0 0 128 128" className="h-full w-full" aria-hidden>
      <rect x="2" y="2" width="124" height="124" fill="#1c1c26" rx="8" />
      {[...Array(8)].map((_, row) =>
        [...Array(8)].map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * SQ + PAD}
            y={row * SQ + PAD}
            width={SQ}
            height={SQ}
            fill={(row + col) % 2 === 0 ? "#343444" : "#12121a"}
          />
        ))
      )}
      {CHESS_PIECES.map((piece, i) => (
        <text
          key={i}
          x={piece.col * SQ + PAD + SQ / 2}
          y={piece.row * SQ + PAD + SQ / 2 + 0.5}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="12.5"
          fill={piece.white ? "#e8e8ee" : "#a855f7"}
        >
          {piece.glyph}
        </text>
      ))}
    </svg>
  );
}

const facets: Facet[] = [
  {
    key: "chess",
    title: "The Board",
    subtitle: "Pattern recognition, but slower",
    story:
      "I've been playing the Sicilian long enough to blame it for most of my losses. Hovering around 1835 blitz on Lichess — chess scratches the same itch as debugging: find the pattern, calculate the line, accept the consequences.",
    visual: <ChessBoard />,
  },
  {
    key: "training",
    title: "The Training",
    subtitle: "Iron, gloves, and the occasional takedown",
    story:
      "A 160 kg deadlift at 78 kg bodyweight, some strictly-amateur boxing, and wrestling purely for the fun of it. The gym is the one place where the overthinking stops and the reps are the only thing that counts.",
    visual: <Barbell />,
  },
  {
    key: "lines",
    title: "The Lines",
    subtitle: "Sketching — graphite over pixels",
    story:
      "Charcoal and graphite over pixels. I sketch whatever sits still long enough — armored knights, veiled eyes, strangers on trains. Happily amateur, and planning to stay that way; it's the one craft I refuse to optimize.",
    visual: <SketchShow />,
  },
  {
    key: "pages",
    title: "The Pages",
    subtitle: "The reading list keeps growing",
    story:
      "The list grows faster than I can finish it — Norwegian Wood, White Nights, The Molecule of More, and whatever Dorian Gray says about staring at side projects too long. Fiction for the feelings, non-fiction for the systems.",
    visual: <BookStack />,
  },
];

function FacetCard({
  facet,
  dataFacet,
  className = "",
}: {
  facet: Facet;
  dataFacet?: boolean;
  className?: string;
}) {
  return (
    <article
      {...(dataFacet ? { "data-facet": "" } : {})}
      className={`group rounded-2xl border border-line bg-surface/80 p-6 backdrop-blur-sm transition-colors duration-500 will-change-transform hover:border-accent/40 sm:p-8 ${className}`}
    >
      <div className="relative mb-8 h-44 overflow-hidden rounded-xl bg-bg/60 sm:h-52">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          {facet.visual}
        </div>
      </div>

      <h3 className={`${ntr.className} mb-1 text-lg uppercase tracking-wider text-ink sm:text-xl`}>
        {facet.title}
      </h3>
      <p className={`${ntr.className} mb-6 text-sm text-muted`}>{facet.subtitle}</p>

      <p className={`${ntr.className} border-t border-line pt-5 text-sm leading-relaxed text-ink/70`}>
        {facet.story}
      </p>
    </article>
  );
}

export default function Beyond() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // mobile loop: two copies of the card set; wrap scroll position by one
  // set-width so the row scrolls endlessly in either direction
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      const first = inner.children[0] as HTMLElement | undefined;
      const mid = inner.children[facets.length] as HTMLElement | undefined;
      if (!first || !mid) return;
      const setWidth = mid.offsetLeft - first.offsetLeft;
      if (setWidth <= 0) return;
      if (el.scrollLeft >= setWidth) el.scrollLeft -= setWidth;
      else if (el.scrollLeft <= 0) el.scrollLeft += setWidth;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-facet]");

      // 3D flip-up entrance
      gsap.from(cards, {
        rotateX: 40,
        y: 110,
        opacity: 0,
        transformPerspective: 900,
        transformOrigin: "center bottom",
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-facet-grid]", start: "top 80%" },
      });

      gsap.from("[data-beyond-quote]", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-beyond-quote]", start: "top 85%" },
      });

      // pointer tilt, desktop only
      if (window.matchMedia("(pointer: fine)").matches) {
        cards.forEach((card) => {
          const rx = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3" });
          const ry = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3" });
          gsap.set(card, { transformPerspective: 900 });

          card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            rx(ny * -10);
            ry(nx * 12);
          });
          card.addEventListener("mouseleave", () => {
            rx(0);
            ry(0);
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="beyond"
      ref={sectionRef}
      className="relative z-10 px-6 py-16 sm:px-10 sm:py-36"
    >
      <div className="mx-auto w-full max-w-5xl">
      <ChapterHeading label="/ off screen" />

      <p
        data-beyond-quote
        className={`${ntr.className} mb-16 max-w-2xl text-2xl font-bold leading-snug tracking-tight text-muted sm:mb-24 sm:text-3xl`}
      >
        When no one&apos;s watching —{" "}
        <span className="text-ink">who are you?</span>
      </p>

      {/* mobile: endless horizontal reel */}
      <div
        ref={trackRef}
        className="-mx-6 snap-x overflow-x-auto px-6 pb-2 sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Facets, swipe to browse"
      >
        <div className="flex gap-4">
          {[...facets, ...facets].map((facet, i) => (
            <FacetCard
              key={`${facet.key}-${i}`}
              facet={facet}
              className="w-[80vw] shrink-0 snap-center"
            />
          ))}
        </div>
      </div>

      {/* desktop grid */}
      <div
        data-facet-grid
        className="hidden gap-6 sm:grid sm:grid-cols-2 xl:grid-cols-4"
        style={{ perspective: "1200px" }}
      >
        {facets.map((facet) => (
          <FacetCard key={facet.key} facet={facet} dataFacet />
        ))}
      </div>
      </div>
    </section>
  );
}
