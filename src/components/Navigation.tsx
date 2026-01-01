import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

interface NavigationProps {
  onNameClick?: () => void;
  nameClickCount?: number;
  onScrollPastHero?: (isPastHero: boolean) => void;
  hoveredNav: 'top' | 'side' | null;
  onHoverChange: (nav: 'top' | 'side' | null) => void;
}

const Navigation = ({ onNameClick, nameClickCount = 0, onScrollPastHero, hoveredNav, onHoverChange }: NavigationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isHoveredFromBelow, setIsHoveredFromBelow] = useState(false);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const currentScrollY = window.scrollY;

      // Check if past hero section
      const pastHero = currentScrollY > heroHeight - 100;
      setIsPastHero(pastHero);
      onScrollPastHero?.(pastHero);

      // Header visible only in hero section
      setIsVisible(!pastHero);

      // Determine active section
      const sections = navItems.map((item) => item.href.slice(1));
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

      if (currentScrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onScrollPastHero]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth"
        });
      }
    }
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isNotInHeroSection = window.scrollY > window.innerHeight - 100;
      if (!isNotInHeroSection) return;

      const isNearTopEdge = e.clientY < 100;

      if (isNearTopEdge) {
        onHoverChange('top');
      } else if (hoveredNav === 'top') {
        onHoverChange(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredNav, onHoverChange]);

  return (
    <>
      <motion.nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${hoveredNav === 'top' && !isVisible
          ? 'bg-background/30 backdrop-blur-sm'
          : 'bg-transparent'
          } ${hoveredNav === 'side' && isVisible ? 'pointer-events-none' : ''}`}
        initial={{ y: 0 }}
        animate={{
          y: ((isVisible && hoveredNav !== 'side') || hoveredNav === 'top') ? 0 : -100, opacity: hoveredNav === 'side' && isVisible ? 0 : 1
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="hidden md:flex items-center gap-8 ml-auto">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative text-md font-medium transition-colors duration-300 hoverable ${(activeSection === item.href.slice(1)) ||
                    (item.href === "#hero" && activeSection === "")
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                  aria-label={`Navigate to ${item.label} section`}
                  aria-current={(activeSection === item.href.slice(1)) || (item.href === "#hero" && activeSection === "") ? 'page' : undefined}
                >
                  <span className="link-underline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu interaktif */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 h-screen w-64 bg-background/80 backdrop-blur-xl overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col gap-1 p-6 pt-24">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-left text-xl font-display font-semibold py-3 transition-colors hoverable ${(activeSection === item.href.slice(1)) ||
                        (item.href === "#hero" && activeSection === "")
                        ? "text-foreground"
                        : "text-foreground hover:text-accent"
                      }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}      </AnimatePresence>

      {/* Always visible burger button on mobile when scrolled */}
      {!isVisible && (
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 right-6 z-50 p-2 rounded-lg hoverable"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </motion.button>
      )}
      {/* Burger button at hero section on mobile */}
      {isVisible && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 right-6 z-50 p-2 hoverable"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      )}    </>
  );
};

export default Navigation;
