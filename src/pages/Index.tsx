import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import SideNavigation from "@/components/SideNavigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import EndCredits from "@/components/EndCredits";
import CommandPalette from "@/components/CommandPalette";
import MatrixRain from "@/components/MatrixRain";
import Chatbot from "@/components/Chatbot";
import StructuredData from "@/components/StructuredData";
import { useKonamiCode, useTypedText, useCommandPaletteShortcut } from "@/hooks/useEasterEggs";

const Index = () => {
  const [isLoading, setIsLoading] = useState(() => {
    // Check sessionStorage - only show loading on first visit per session
    try {
      const hasVisited = sessionStorage.getItem('hasVisitedThisSession');
      return !hasVisited; // Show loading only if not visited yet
    } catch {
      // Fallback if sessionStorage is unavailable (private mode, etc)
      return true;
    }
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [nameClickCount, setNameClickCount] = useState(0);
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredNav, setHoveredNav] = useState<'top' | 'side' | null>(null);

  // Mark session as visited when loading finishes
  const handleLoadingFinish = useCallback(() => {
    try {
      sessionStorage.setItem('hasVisitedThisSession', 'true');
    } catch {
      // Ignore if sessionStorage is unavailable
    }
    setIsLoading(false);
  }, []);

  // Track active section for side nav
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "experience", "projects", "contact"];
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setActiveSection("");
        return;
      }

      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Easter eggs
  const triggerKonami = useCallback(() => {
    setIsMatrixActive(true);
    setTimeout(() => setIsMatrixActive(false), 3000);
  }, []);

  const triggerMatrix = useCallback(() => {
    setIsMatrixActive(true);
    setTimeout(() => setIsMatrixActive(false), 3000);
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen((prev) => !prev);
  }, []);

  const handleNameClick = useCallback(() => {
    setNameClickCount((prev) => (prev + 1) % 4);
  }, []);

  const handleScrollPastHero = useCallback((pastHero: boolean) => {
    setIsPastHero(pastHero);
  }, []);

  useKonamiCode(triggerKonami);
  useTypedText("matrix", triggerMatrix);
  useTypedText("tubagus", triggerMatrix);
  useTypedText("TUBAGUS", triggerMatrix);
  useTypedText("help", toggleCommandPalette);
  useCommandPaletteShortcut(toggleCommandPalette);

  return (
    <>
      <Helmet>
        <title>Tubagus Panji Anugrah | Personal Portfolio</title>
        <meta
          name="description"
          content="CS Graduate specializing in Software Dev (Mobile/Web), QA Automation, & Data Science. Building scalable systems that solve real problems. See my work!"
        />
        <meta name="keywords" content="Tubagus Panji Anugrah, Mobile Developer, QA Engineer, Data Scientist, Portfolio, Bogor, Universitas Pakuan" />
        <link rel="canonical" href="https://panjianugrah.me" />
      </Helmet>

      {/* Portfolio Structured Data */}
      <StructuredData type="portfolio" />

      {/* Loading Screen - Always render first */}
      <LoadingScreen
        isLoading={isLoading}
        onFinish={handleLoadingFinish}
      />
      
      {/* Main Content - Only render after loading */}
      {!isLoading && (
        <>
          {/* Custom Cursor */}
          <CustomCursor />
          {/* Matrix Rain Easter Egg */}
          <MatrixRain isActive={isMatrixActive} />
          {/* Command Palette */}
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={() => setIsCommandPaletteOpen(false)}
          />
          {/* Header Navigation */}
          <Navigation
            onNameClick={handleNameClick}
            nameClickCount={nameClickCount}
            onScrollPastHero={handleScrollPastHero}
            hoveredNav={hoveredNav}
            onHoverChange={setHoveredNav}
          />
          {/* Side Navigation */}
          <SideNavigation
            isVisible={isPastHero}
            activeSection={activeSection}
            hoveredNav={hoveredNav}
            onHoverChange={setHoveredNav}
          />
          {/* Main Content */}
          <main>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Contact />
          </main>
          {/* End Credits */}
          <EndCredits />
          {/* Footer */}
          <Footer />
          {/* Chatbot */}
          <Chatbot />
        </>
      )}
    </>
  );
};

export default Index;