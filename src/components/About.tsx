import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { Variants } from "framer-motion";
import SkillMarquee from "./SkillMarquee";

const About = () => {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

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


  return (
    <div className="snap-section">
      <section id="about" className="py-16 md:py-24 px-6" ref={containerRef}>
        <motion.div
          className="max-w-4xl mx-auto"
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

            {/* Bio */}
            <motion.div
              className="space-y-6 text-lg text-foreground/80 leading-relaxed mb-16"
              variants={itemVariants}
            >
              <motion.p variants={itemVariants}>
                I work on systems meant to be used, from NLP-based mobile applications to data pipelines that handle large-scale records. I care about correctness, maintainability, and whether the solution actually holds up in real conditions.
              </motion.p>
              <motion.p variants={itemVariants}>
                I’m a CS graduate (GPA 3.89) with experience in mobile development, QA automation, and data-driven engineering. My work includes AI-powered Android apps, data analysis, and improving reliability through structured testing.
              </motion.p>
              <motion.p className="text-foreground/60" variants={itemVariants}>
                I value clear code, practical tools, and steady improvement. I learn continuously because the work demands it, not because it sounds good.
              </motion.p>
            </motion.div>

            {/* Weapon of Choice */}
            <motion.div variants={itemVariants} className="mt-16">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6 text-center">
                Weapon of Choice
              </h3>
              <SkillMarquee />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
