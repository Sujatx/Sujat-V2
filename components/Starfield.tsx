"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  speed: number;
  px: number | null; // previous projected position, for warp streaks
  py: number | null;
};

/**
 * Full-page 3D starfield. Stars drift toward the camera at cruise speed;
 * scroll velocity throws the field into hyperspace — streaks instead of
 * points — so moving between chapters feels like traveling.
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let running = true;
    let lastScrollY = window.scrollY;
    let warp = 0; // smoothed scroll-velocity boost
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 768 ? 350 : 700;
      stars = Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * width * 4,
        y: (Math.random() - 0.5) * height * 4,
        z: Math.random() * width,
        speed: 0.2 + Math.random() * 0.6,
        px: null,
        py: null,
      }));
    };

    const tick = () => {
      if (!running) return;

      // scroll velocity -> warp factor (smoothed in, eased out)
      const dy = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      warp += (Math.min(dy * 0.06, 14) - warp) * 0.12;

      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.z -= star.speed * (1 + warp);

        if (star.z <= 1) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 4;
          star.y = (Math.random() - 0.5) * height * 4;
          star.speed = 0.2 + Math.random() * 0.6;
          star.px = null;
          star.py = null;
        }

        const k = 128.0 / star.z;
        const sx = star.x * k + width / 2;
        const sy = star.y * k + height / 2;

        if (sx < 0 || sx >= width || sy < 0 || sy >= height) {
          star.px = null;
          star.py = null;
          continue;
        }

        const depth = 1 - star.z / width; // 0 far .. 1 near
        if (warp > 0.6 && star.px !== null && star.py !== null) {
          // hyperspace streak from previous position
          ctx.strokeStyle = `rgba(196, 160, 255, ${0.15 + depth * 0.5})`;
          ctx.lineWidth = depth * 1.6 + 0.2;
          ctx.beginPath();
          ctx.moveTo(star.px, star.py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(232, 232, 238, ${0.25 + depth * 0.75})`;
          const size = depth > 0.7 ? 1.6 : 1;
          ctx.fillRect(sx, sy, size, size);
        }

        star.px = sx;
        star.py = sy;
      }

      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        lastScrollY = window.scrollY;
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    build();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", build);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
