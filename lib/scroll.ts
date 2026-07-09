import type Lenis from "lenis";

// module-level singleton so Nav/Footer can drive Lenis without prop drilling
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function scrollTo(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4 });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}
