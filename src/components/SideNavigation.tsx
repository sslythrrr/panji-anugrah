import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, FolderOpen, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Projects", href: "#projects", icon: FolderOpen },
  { label: "Contact", href: "#contact", icon: Mail },
];

interface SideNavigationProps {
  isVisible: boolean;
  activeSection: string;
  hoveredNav: 'top' | 'side' | null;
  onHoverChange: (nav: 'top' | 'side' | null) => void;
}

const SideNavigation = ({ isVisible, activeSection, hoveredNav, onHoverChange }: SideNavigationProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleNavClick = (href: string) => {
    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isInHeroSection = window.scrollY < window.innerHeight - 100;
      if (!isInHeroSection) return;

      const isNearRightEdge = e.clientX > window.innerWidth - 150;

      if (isNearRightEdge) {
        onHoverChange('side');
      } else if (hoveredNav === 'side') {
        onHoverChange(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hoveredNav, onHoverChange]);

  // Update kondisi visibility di return AnimatePresence
  return (
    <AnimatePresence>
      {((isVisible && hoveredNav !== 'top') || hoveredNav === 'side') && (
        <motion.nav
          className={`fixed right-6 top-80 z-50 hidden md:flex flex-col gap-1 transition-opacity duration-300 ${isHovered && !isVisible ? 'opacity-60' : 'opacity-100'
            }`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.slice(1) ||
              (item.href === "#hero" && activeSection === "");

            return (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="relative p-2 group hoverable"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: -4 }}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${isActive
                    ? "text-foreground"
                    : "text-foreground/30 group-hover:text-foreground/70"
                    }`}
                />

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-1 h-1 rounded-full bg-foreground"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-2 py-1 text-xs text-foreground/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default SideNavigation;
