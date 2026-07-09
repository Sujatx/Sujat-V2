"use client";

import { useEffect, useRef } from "react";

type Cell = {
  ox: number; // origin
  oy: number;
  x: number; // current
  y: number;
  vx: number;
  vy: number;
  char: string;
  alpha: number;
};

const RAMP = " .:-=+*#%@";
const REPEL_RADIUS = 90;
const REPEL_FORCE = 2.6;
const SPRING = 0.045;
const DAMPING = 0.88;

/**
 * Renders an image as ASCII characters on canvas. Characters near the
 * pointer are pushed away and spring back — the portrait ripples like
 * fluid under the cursor.
 */
export default function AsciiPortrait({
  src,
  flip = false,
}: {
  src: string;
  /** mirror the image left-to-right */
  flip?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let cells: Cell[] = [];
    let width = 0;
    let height = 0;
    let cell = 9;
    let raf = 0;
    let visible = true;
    let img: HTMLImageElement | null = null;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${cell}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const c of cells) {
        ctx.fillStyle =
          c.alpha > 0.82
            ? `rgba(196, 160, 255, ${c.alpha})`
            : `rgba(232, 232, 238, ${c.alpha})`;
        ctx.fillText(c.char, c.x, c.y);
      }
    };

    const build = () => {
      if (!img) return;
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = width < 380 ? 8 : 9;

      const cols = Math.floor(width / cell);
      const rows = Math.floor(height / cell);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d");
      if (!octx) return;

      // cover-crop the source image into the sampling grid
      const ir = img.width / img.height;
      const cr = width / height;
      let sw: number, sh: number, sx: number, sy: number;
      if (ir > cr) {
        sh = img.height;
        sw = sh * cr;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = sw / cr;
        sx = 0;
        sy = (img.height - sh) / 2;
      }
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;

      cells = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + (flip ? cols - 1 - c : c)) * 4;
          // respect the alpha channel — cutout portraits keep their silhouette
          const a = data[i + 3] / 255;
          const lum =
            ((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
              255) *
            a;
          // near-black / transparent stays empty — reads as negative space
          if (lum < 0.09) continue;
          const x = c * cell + cell / 2;
          const y = r * cell + cell / 2;
          // dissolve hard crop lines where the subject meets the frame
          const fx = Math.min(x, width - x) / (width * 0.1);
          const fy = (height - y) / (height * 0.12);
          const fade = Math.min(1, fx, fy);
          const alpha = (0.25 + lum * 0.75) * fade;
          if (alpha < 0.05) continue;
          cells.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            char: RAMP[Math.min(RAMP.length - 1, Math.floor(lum * RAMP.length))],
            alpha,
          });
        }
      }
      draw();
    };

    const tick = () => {
      if (!visible) return;
      for (const c of cells) {
        const dx = c.x - mouse.x;
        const dy = c.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0.01) {
          const f = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE;
          c.vx += (dx / dist) * f;
          c.vy += (dy / dist) * f;
        }
        c.vx += (c.ox - c.x) * SPRING;
        c.vy += (c.oy - c.y) * SPRING;
        c.vx *= DAMPING;
        c.vy *= DAMPING;
        c.x += c.vx;
        c.y += c.vy;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    img = new window.Image();
    img.src = src;
    img.onload = () => {
      build();
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(build);
    ro.observe(wrap);

    // pause the physics loop offscreen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(wrap);

    if (!reduced) {
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [src, flip]);

  return (
    <div ref={wrapRef} className="absolute inset-0 cursor-crosshair">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
    </div>
  );
}
