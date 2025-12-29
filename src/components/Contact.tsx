import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Github, Instagram, Mail, ArrowUpRight, Download } from "lucide-react";

const socials = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/panji-anugrah",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    href: "https://github.com/sslythrrr",
    icon: Github,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/tubaguspn",
    icon: Instagram,
  },
  {
    name: "Email",
    href: "mailto:an.tubagusp@gmail.com",
    icon: Mail,
  },
];

const Contact = () => {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return (
    <section id="contact" className="py-16 md:py-24 px-6" ref={containerRef}>
      <motion.div 
        className="max-w-2xl mx-auto text-center"
        ref={ref}
        style={{ y, scale }}
      >
        <motion.h2
          className="text-section font-display mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Let's Connect
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Interested in collaborating or just want to say hi? Feel free to reach
          out through any of these platforms.
        </motion.p>

        {/* Resume Download - Secondary placement 
        <motion.a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 border border-foreground/20 rounded-full text-sm font-medium text-foreground/80 hover:bg-foreground hover:text-background transition-all duration-300 hoverable"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          <span>Download Resume</span>
        </motion.a>
*/}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {socials.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target={social.name !== "Email" ? "_blank" : undefined}
              rel={social.name !== "Email" ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between p-4 md:p-5 border border-secondary rounded-lg hover:border-foreground/30 transition-all duration-300 hoverable magnetic-btn"
              initial={{ opacity: 0, x: -30, y: 10 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: 0.25 + index * 0.08,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ x: 8, scale: 1.01 }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.div>
                <span className="text-lg font-medium group-hover:text-foreground transition-colors">
                  {social.name}
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
