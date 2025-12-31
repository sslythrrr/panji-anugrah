import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { MapPin, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Mobile Developer",
    company: "Monfori Nusantara",
    period: "Aug 2024 - Sep 2024",
    duration: "2 months",
    location: "Bogor Regency, West Java, Indonesia · Hybrid",
    description: [
      "Built a production-ready Flutter application to streamline field documentation workflows for lab operations.",
      "Developed batch image processing system handling 200-800 images per distribution cycle",
      "Implemented EXIF-based sorting with Quick Sort algorithm for timestamp organization",
      "Integrated automated renaming rules and ZIP compression for operational data distribution",
      "Delivered tool with 100% User Acceptance during internship tenure",
    ],
    tags: ["Flutter", "Dart", "Android", "Mobile Development"],
  },
  {
    title: "Web Developer",
    company: "Universitas Pakuan",
    period: "Apr 2024 - Jul 2024",
    duration: "4 months",
    location: "Bogor Regency, West Java, Indonesia · Hybrid",
    description: [
      "Participated in Student Community Service (KKN Tematik) program at Desa Tegal, Kecamatan Kemang.",
      "Conducted field observations and stakeholder interviews with Village Secretary",
      "Designed and developed Village Information System to digitalize public services",
      "Built monolithic full-stack application using Node.js, Express.js, and MySQL",
      "Mapped business processes and determined functional requirements through direct audits",
    ],
    tags: ["Node.js", "Express.js", "MySQL", "Web Development"],
  },
];

const Experience = () => {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
      <section id="experience" className="pt-8 pb-16 md:pt-12 md:pb-24 px-6" ref={containerRef}>
        <div className="max-w-5xl mx-auto" ref={ref}>
          <motion.h2
            className="text-section font-display mb-16 md:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Experience
          </motion.h2>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line - Hidden on mobile */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-secondary -translate-x-1/2 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-accent via-foreground/50 to-transparent"
                style={{ height: lineHeight }}
              />
            </div>

            <div className="space-y-12 md:space-y-0">
              {experiences.map((exp, index) => (
                <Dialog key={exp.title + exp.company} open={openIndex === index} onOpenChange={(open) => setOpenIndex(open ? index : null)}>
                  <motion.div
                    className={`relative md:flex ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      } md:gap-8`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80, y: 30 }}
                    animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {/* Timeline Dot 
                  <motion.div 
                    className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary border-2 border-foreground/20 z-10"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.2 + 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                  />*/}

                    {/* Content */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <DialogTrigger asChild>
                        <motion.div
                          className="bg-card border border-secondary rounded-lg p-3 md:p-4 card-hover cursor-pointer"
                          whileHover={{
                            y: -8,
                            transition: { duration: 0.3, ease: "easeOut" }
                          }}
                        >
                          <div className={`flex flex-col ${index === 0 ? 'md:items-end' : ''}`}>
                            <h3 className="text-lg md:text-xl font-display font-semibold mb-0 flex items-center gap-1">
                              {exp.title}
                              {(index === 1 || index === 0) && (
                                <span className="ml-2 font-mono px-2 py-0.5 rounded align-middle" style={{ fontSize: '0.75em', fontWeight: 500, color: '#888' }}>
                                  {index === 0 ? '- Intern' : '- Volunteer'}
                                </span>
                              )}
                            </h3>
                          </div>
                          <p className="text-accent font-medium mb-2">{exp.company}</p>

                          <div className={`flex flex-wrap gap-2 text-xs text-muted-foreground mb-2 ${index % 2 === 0 ? "md:justify-end" : ""
                            }`}>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {exp.period}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {exp.location.split(" · ")[0]}
                            </span>
                          </div>

                          <ul className={`space-y-1 text-foreground/70 text-xs mb-3 ${index % 2 === 0 ? "md:text-right" : ""
                            }`}>
                            {exp.description.slice(0, 1).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                            <li className="text-foreground/50 italic">
                              more...
                            </li>
                          </ul>

                          <div className={`flex flex-wrap gap-1 ${index % 2 === 0 ? "md:justify-end" : ""
                            }`}>
                            {exp.tags.map((tag, tagIndex) => (
                              <motion.span
                                key={tag}
                                className="tech-tag text-xs"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{
                                  duration: 0.4,
                                  delay: index * 0.2 + tagIndex * 0.05 + 0.4
                                }}
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      </DialogTrigger>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </motion.div>

                  {/* Modal Popup for full description */}
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>
                        {exp.title} <span className="text-accent font-medium">- {exp.company}</span>
                      </DialogTitle>
                      <DialogDescription>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 mt-2">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {exp.period}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80 text-base mb-6 mt-2">
                      {exp.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="tech-tag text-xs bg-secondary px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
};

export default Experience;
