import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronDown, Download } from "lucide-react";
import { SiGithub, SiLinkedin, SiInstagram } from "react-icons/si";

import { useRef, useEffect, useState } from "react";



const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { margin: "-100px" });
  const [autoWave, setAutoWave] = useState(false);

  useEffect(() => {
    if (isInView) {
      setAutoWave(true);
      const timeout = setTimeout(() => setAutoWave(false), 1200); // durasi animasi
      return () => clearTimeout(timeout);
    }
  }, [isInView]);

  const handleScrollDown = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResumeDownload = () => {
    window.open("/resume.pdf", "_blank");
  };

  return (
    <div className="snap-section" ref={heroRef}>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle animated gradient background */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="absolute inset-0 animate-gradient-x"
            style={{
              background: "linear-gradient(135deg, hsl(270, 50%, 25%) 0%, hsl(210, 50%, 25%) 50%, hsl(0, 0%, 15%) 100%)",
              backgroundSize: "200% 200%",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 text-center px-6"
          style={{ y, opacity }}
        >
          {/* Main Name */}
          <motion.h1
            className="text-hero font-display font-extrabold mb-6 cursor-default inline-flex justify-center w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="gradient-text relative group inline-block overflow-hidden">
              <span
                className={`absolute right-0 top-1 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent pointer-events-none
                  ${(autoWave ? 'animate-wave-line2' : '')} group-hover:animate-wave-line2`}
                style={{ opacity: 0, transform: 'translateX(100%)' }}
              />
              Panji Anugrah
              <span
                className={`absolute left-0 bottom-1 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent pointer-events-none
                  ${(autoWave ? 'animate-wave-line' : '')} group-hover:animate-wave-line`}
                style={{ opacity: 0, transform: 'translateX(-100%)' }}
              />
            </span>
          </motion.h1>

          {/* Title */}
          <motion.p
            className="text-xl md:text-2xl text-foreground/90 font-medium mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            Software Engineer
          </motion.p>

          {/* Specialties */}
          <motion.p
            className="text-md md:text-lg text-accent font-light tracking-widest mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            Mobile • QA • Web • Data Science
          </motion.p>

          {/* Resume Download Button */}
          <motion.button
            onClick={handleResumeDownload}
            className="group relative inline-flex items-center gap-2 px-6 py-3 border border-foreground/30 rounded-full text-sm font-medium text-foreground/90 hover:bg-foreground hover:text-background transition-all duration-300 hoverable magnetic-btn overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Resume</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
          </motion.button>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <a
              href="https://github.com/sslythrrr"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground/50 hover:text-foreground transition-colors hoverable"
              aria-label="GitHub"
            >
              <SiGithub className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/panji-anugrah"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground/50 hover:text-foreground transition-colors hoverable"
              aria-label="LinkedIn"
            >
              <SiLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/tubaguspn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-foreground/50 hover:text-foreground transition-colors hoverable"
              aria-label="Instagram"
            >
              <SiInstagram className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors hoverable"
          onClick={handleScrollDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ opacity }}
        >
          <span className="text-xs tracking-widest uppercase">dive in</span>
          <ChevronDown className="w-5 h-5 scroll-indicator" />
        </motion.button>
      </section>
    </div>
  );
};

export default Hero;
