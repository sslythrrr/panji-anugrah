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
import { useKonamiCode, useTypedText, useCommandPaletteShortcut } from "@/hooks/useEasterEggs";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [nameClickCount, setNameClickCount] = useState(0);
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredNav, setHoveredNav] = useState<'top' | 'side' | null>(null);

  // Loading screen
  useEffect(() => {
    setIsLoading(true);
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
  useCommandPaletteShortcut(toggleCommandPalette);
  // --- DATA SCHEMA JSON-LD ---
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Tubagus Panji Anugrah",
    "alternateName": ["Panji Anugrah", "Tubagus Panji"],
    "url": "https://panjianugrah.me",
    "jobTitle": "Computer Science Graduate | Software Engineer | AI/ML | QA Automation",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Universitas Pakuan"
    },
    "knowsAbout": ["Mobile Development", "QA Automation", "Data Engineering", "Machine Learning", "Natural Language Processing", "Data Science"],
    "sameAs": [
      "https://www.linkedin.com/in/panji-anugrah",
      "https://github.com/sslythrrr",
      "https://instagram.com/tubaguspn",
      "https://facebook.com/panji.anoegrah"
    ],
  };

  return (
    <>
      <Helmet>
        <title>Tubagus Panji Anugrah</title>
        <meta
          name="description"
          content="Portfolio of Tubagus Panji Anugrah,Computer Science graduate specializing in mobile development, QA automation, and data science. Building systems that solve real problems."
        />
        <meta name="keywords" content="Tubagus Panji Anugrah, Mobile Developer, QA Engineer, Data Scientist, Portfolio, Bogor, Universitas Pakuan" />
        <link rel="canonical" href="https://panjianugrah.me" />

        {/* Script JSON-LD untuk Knowledge Graph */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      {/* Custom Cursor */}
      <CustomCursor />
      {/* Loading Screen */}
      <LoadingScreen
        isLoading={isLoading}
        onFinish={() => {
          setIsLoading(false);
        }}
      />
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
  );
};

export default Index;