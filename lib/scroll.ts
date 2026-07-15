import type Lenis from "lenis";

// module-level singleton so Nav/Footer can drive Lenis without prop drilling
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}
