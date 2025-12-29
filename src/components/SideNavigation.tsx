import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Briefcase, FolderOpen, Mail } from "lucide-react";

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
}

const SideNavigation = ({ isVisible, activeSection }: SideNavigationProps) => {
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className="fixed right-6 top-80 z-50 hidden md:flex flex-col gap-1"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
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
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isActive 
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
