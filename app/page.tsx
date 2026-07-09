import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Starfield from "@/components/Starfield";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Craft from "@/components/Craft";
import Work from "@/components/Work";
import Beyond from "@/components/Beyond";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <Starfield />
      <NavBar />
      <main>
        <Hero />
        <About />
        <Craft />
        <Work />
        <Beyond />
      </main>
      <Contact />
    </SmoothScroll>
  );
}
