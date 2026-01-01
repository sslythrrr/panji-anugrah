import { motion, useScroll, useTransform } from "framer-motion"; // experimental
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import type { Variants } from "framer-motion";
import SkillMarquee from "./SkillMarquee";

const About = () => {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const profileRef = useRef(null);
  const profileInView = useInView(profileRef, { margin: "-100px" });
  const [triggerGradient, setTriggerGradient] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.3, 1, 1, 1, 0.3]);

  useEffect(() => {
    if (profileInView) {
      setTriggerGradient(true);
      const timer = setTimeout(() => setTriggerGradient(false), 900);
      return () => clearTimeout(timer);
    }
  }, [profileInView]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    },
  };

  const profileInfo = {
    age: 22,
    location: "West Java, Indonesia",
    imageUrl: "/profile.png"
  };

  return (
    <section id="about" className="pt-16 pb-20 md:pt-20 md:pb-28 px-6 md: mt-16" ref={containerRef}>
      <motion.div
        className="max-w-5xl mx-auto"
        ref={ref}
        style={{ y, opacity }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Title */}
          <motion.h2
            className="text-section font-display mb-12 md:mb-16"
            variants={itemVariants}
          >
            About
          </motion.h2>

          {/* Bio with Profile */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-16">
            {/* Profile Photo */}
            <motion.div
              className="flex-shrink-0"
              ref={profileRef}
            >
              <motion.div
                className="relative w-48 md:w-56 mx-auto md:mx-0"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={profileInfo.imageUrl}
                    alt="Panji Anugrah"
                    className="w-full h-auto object-cover"
                  />
                  {/* Subtle glow overlay*/}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent"
                    style={{ top: '50%', bottom: '18%' }}
                    animate={{
                      opacity: triggerGradient ? 1 : 0
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {/* Info Badge */}
                <motion.div
                  className="mt-4 text-center space-y-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={profileInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {/* Mobile: inline with dot separator */}
                  <p className="text-sm font-medium text-foreground/60 tracking-wide md:hidden">
                    {profileInfo.age} · {profileInfo.location}
                  </p>
                  {/* Desktop: stacked */}
                  <div className="hidden md:block space-y-0.5">
                    <p className="text-sm font-medium text-foreground/60 tracking-wide">
                      {profileInfo.age}
                    </p>
                    <p className="text-sm font-medium text-foreground/60 tracking-wide">
                      {profileInfo.location}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            {/* Bio Text */}
            <div className="flex-1 space-y-6 text-base md:text-[17px] text-foreground/80 leading-relaxed">
              <p>
                {/* Ubah fokus ke PROSES */}
                Building systems meant to be used is my priority, from NLP based mobile applications to data pipelines that handle large scale records. The focus is always on correctness, maintainability, and whether the solution holds up in real conditions.
              </p>
              <p>
                {/* Ubah fokus ke KUALIFIKASI */}
                As a CS graduate with a 3.89 GPA, I bring a strong foundation in mobile and web development, QA automation, and data-driven engineering. My portfolio includes AI-powered Android apps, information systems, and reliability testing.
              </p>
              <p>
                {/* Ubah fokus ke VALUES */}
                Beyond just writing code, I value practicality and steady improvement. Continuous learning isn't just a buzzword for me; it's a necessity demanded by the work itself.
              </p>
            </div>
          </div>

          {/* Weapon of Choice */}
          <motion.div variants={itemVariants} className="mt-16">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6 text-center">
              Tech Stack & Tools
            </h3>
            <SkillMarquee />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
