import { NTR } from "next/font/google";

// NTR ships only weight 400 — bold styling on top of it triggers the
// browser's synthetic bold, which is what gazijarin.com's 700 heading uses
export const ntr = NTR({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
