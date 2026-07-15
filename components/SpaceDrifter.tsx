"use client";

import { useEffect, useRef } from "react";

const LETTERS = ["N", "ε", "Ω", "Λ", "Q", "D"];
const SPACING = 20; // px of path between bones — constant, so the chain never stretches
const TAIL = SPACING * (LETTERS.length - 1);
const APPROACH = 3.2; // seconds spent flying in from / receding into deep space

type Pt = { x: number; y: number };

function angleDiff(from: number, to: number) {
  return ((to - from + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
}

// walk backwards along the recorded path and find the point `dist` px behind the head
function sample(hist: Pt[], dist: number) {
  let acc = 0;
  for (let j = hist.length - 1; j > 0; j--) {
    const a = hist[j]; // newer
    const b = hist[j - 1]; // older
    const segLen = Math.hypot(a.x - b.x, a.y - b.y);
    if (acc + segLen >= dist) {
      const k = segLen === 0 ? 0 : (dist - acc) / segLen;
      return {
        x: a.x + (b.x - a.x) * k,
        y: a.y + (b.y - a.y) * k,
        ang: Math.atan2(a.y - b.y, a.x - b.x),
      };
    }
    acc += segLen;
  }
  const o = hist[0];
  return { x: o.x - (dist - acc), y: o.y, ang: 0 };
}

export default function SpaceDrifter() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrap = wrapRef.current;
    if (!wrap) return;
    const bones = Array.from(wrap.children) as HTMLElement[];

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const s = {
      t: 0,
      x: 0,
      y: 0,
      heading: 0,
      hist: [] as Pt[],
      mode: "fly" as "fly" | "loop",
      loopDir: 1,
      loopRemaining: 0,
      nextLoopAt: 0,
      phases: [0, 0, 0],
      // visitation cycle: hidden most of the time, drops by like a passing craft
      active: false,
      visitStart: 0,
      activeUntil: 0,
      nextVisitAt: 0,
      awoken: false, // first visit waits for the user to scroll
      lastScrollY: window.scrollY,
    };

    // materialize somewhere new and seed a straight tail behind the head
    const beginVisit = () => {
      s.active = true;
      s.visitStart = s.t;
      s.activeUntil = s.t + 14 + Math.random() * 8;
      s.x = vw * (0.2 + Math.random() * 0.6);
      s.y = vh * (0.2 + Math.random() * 0.6);
      s.heading = Math.random() * Math.PI * 2;
      s.mode = "fly";
      s.nextLoopAt = s.t + 3 + Math.random() * 4;
      s.phases = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ];
      s.hist = [];
      for (let d = TAIL + 40; d >= 0; d -= 4) {
        s.hist.push({
          x: s.x - Math.cos(s.heading) * d,
          y: s.y - Math.sin(s.heading) * d,
        });
      }
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      s.t += dt;

      const sy = window.scrollY;

      if (!s.active) {
        // asleep until the user starts exploring, then visits on its own schedule
        if (!s.awoken) {
          if (sy > 10) {
            s.awoken = true;
            s.nextVisitAt = s.t + 2 + Math.random() * 3;
          }
        } else if (s.t >= s.nextVisitAt) {
          beginVisit();
        }
        s.lastScrollY = sy;
        return;
      }

      // --- steering: free roaming, no preferred direction ---
      let turn = 0;

      if (s.mode === "loop") {
        // a quick full circle, then carry on
        turn = s.loopDir * 2.6;
        s.loopRemaining -= Math.abs(turn) * dt;
        if (s.loopRemaining <= 0) {
          s.mode = "fly";
          s.nextLoopAt = s.t + 6 + Math.random() * 8;
        }
      } else {
        // layered serpentine waving
        turn =
          1.15 * Math.sin((s.t * Math.PI * 2) / 2.7 + s.phases[0]) +
          0.75 * Math.sin((s.t * Math.PI * 2) / 4.6 + s.phases[1]) +
          0.5 * Math.sin((s.t * Math.PI * 2) / 8.9 + s.phases[2]);

        // bank away from every edge, back toward open space
        const edge = 130;
        let ex = 0;
        let ey = 0;
        if (s.x < edge) ex = 1 - s.x / edge;
        else if (s.x > vw - edge) ex = -(1 - (vw - s.x) / edge);
        if (s.y < edge) ey = 1 - s.y / edge;
        else if (s.y > vh - edge) ey = -(1 - (vh - s.y) / edge);
        if (ex !== 0 || ey !== 0) {
          const inward = Math.atan2(ey, ex);
          const strength = Math.min(Math.hypot(ex, ey), 1);
          turn += angleDiff(s.heading, inward) * 2.5 * strength;
        }

        turn = Math.max(-2.2, Math.min(2.2, turn));

        if (
          s.t >= s.nextLoopAt &&
          s.x > 90 &&
          s.x < vw - 90 &&
          s.y > 90 &&
          s.y < vh - 90
        ) {
          s.mode = "loop";
          s.loopDir = Math.random() < 0.5 ? 1 : -1;
          s.loopRemaining = Math.PI * 2;
        }
      }

      s.heading += turn * dt;

      const speed = 115 + 35 * Math.sin((s.t * Math.PI * 2) / 6.3);
      s.x += Math.cos(s.heading) * speed * dt;
      s.y += Math.sin(s.heading) * speed * dt;

      // swept along by the page scroll, then swims back on its own
      s.y -= (sy - s.lastScrollY) * 0.45;
      s.lastScrollY = sy;

      s.x = Math.max(24, Math.min(vw - 24, s.x));
      s.y = Math.max(24, Math.min(vh - 24, s.y));

      s.hist.push({ x: s.x, y: s.y });
      if (s.hist.length > 400) s.hist.shift();

      // depth: arrives from deep space like the stars do — a tiny point near the
      // center of view that grows as it approaches, then recedes away again
      const tIn = Math.min((s.t - s.visitStart) / APPROACH, 1);
      const tOut = Math.min((s.activeUntil - s.t) / APPROACH, 1);
      const prog = Math.max(0, Math.min(tIn, tOut));
      const eased = prog * prog * (3 - 2 * prog); // smoothstep
      const depth = 0.05 + 0.95 * eased; // 0 far … 1 near
      wrap.style.opacity = String(0.15 + 0.85 * eased);

      if (s.t >= s.activeUntil) {
        s.active = false;
        s.nextVisitAt = s.t + 10 + Math.random() * 14;
        wrap.style.opacity = "0";
        return;
      }

      // head is the last letter; the rest trail behind along the exact same path,
      // each bone twisting to the local curve. Positions are projected toward the
      // viewport center by depth, same as the starfield's perspective.
      const cx = vw / 2;
      const cy = vh / 2;
      for (let i = 0; i < bones.length; i++) {
        const dist = (bones.length - 1 - i) * SPACING;
        const p = sample(s.hist, dist);
        const px = cx + (p.x - cx) * depth;
        const py = cy + (p.y - cy) * depth;
        bones[i].style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) rotate(${(p.ang * 180) / Math.PI}deg) scale(${depth})`;
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] select-none opacity-0"
    >
      {LETTERS.map((letter, i) => (
        <span
          key={i}
          className="absolute left-0 top-0 text-[12px] text-white/35 will-change-transform"
          style={{ textShadow: "0 0 8px rgba(168,85,247,0.3)" }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
