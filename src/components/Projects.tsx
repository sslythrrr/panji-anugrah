import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProjectModal from "./ProjectModal";

const projects = [
  {
    id: 1,
    title: "Smart Gallery",
    period: "Mar 2025 - Jul 2025",
    categories: ["Mobile", "Machine Learning"],
    description:
      "Android gallery app with advanced NLP search and computer vision capabilities for intelligent photo management.",
    highlights: [
      "Fine-tuned three separate IndoBERT models for Intent Classification, NER, and Semantic Similarity",
      "Integrated MobileNetV3 for multi-label classification and ML Kit for OCR-based retrieval",
      "Architected system to run quantized models locally using TensorFlow Lite",
    ],
    tags: ["Kotlin", "Android", "NLP", "IndoBERT", "MobileNetV3", "Computer Vision", "TFLite", "Jetpack Compose"],
    github: "https://github.com/sslythrrr/smart-gallery",
    images: [
      "/project/smart-gallery/1.webp",
      "/project/smart-gallery/2.webp",
      "/project/smart-gallery/3.webp",
      "/project/smart-gallery/4.webp",
    ],
  },
  {
    id: 2,
    title: "Time-Series Forecasting",
    period: "Dec 2024 - Jan 2025",
    categories: ["Data Science", "Machine Learning"],
    description:
      "Comprehensive analysis of 14,213 Steam games to forecast market trends and player retention patterns.",
    highlights: [
      "Implemented Facebook Prophet and STL Decomposition for Q1-Q4 2025 forecasting",
      "Identified 1,846% YoY growth potential in 'Early Access' genre",
      "Applied Pearson Correlation Matrices for cross-genre synergy analysis",
    ],
    tags: ["Python", "Prophet", "STL", "Pandas", "NumPy", "Matplotlib"],
    github: "https://github.com/sslythrrr/",
    images: [
      "/project/time-series/1.webp",
      "/project/time-series/2.webp",
    ],
  },
  {
    id: 3,
    title: "Monfori Lens",
    period: "Aug 2024 - Sep 2024",
    categories: ["Mobile"],
    description:
      "Production-ready batch image processing application for field reporting efficiency.",
    highlights: [
      "Handles 200-800 images per distribution cycle",
      "Quick Sort algorithm for timestamp-based sorting",
      "100% User Acceptance during internship deployment",
    ],
    tags: ["Flutter", "Dart", "Android", "Algorithms"],
    github: "https://github.com/sslythrrr/monfori-lens",
    images: [
      "/project/monfori-lens/1.webp",
      "/project/monfori-lens/2.webp",
      "/project/monfori-lens/3.webp",
      "/project/monfori-lens/4.webp",
    ],
  },
  {
    id: 4,
    title: "Village Information System",
    period: "Apr 2024 - Jul 2024",
    categories: ["Web"],
    description:
      "Centralized village information system for administrative workflow digitalization.",
    highlights: [
      "Built monolithic full-stack application with Node.js and Express.js",
      "Integrated MySQL for population data management",
      "Delivered platform for Desa Tegal, Kecamatan Kemang",
    ],
    tags: ["Node.js", "Express.js", "MySQL"],
    github: "https://github.com/sslythrrr/village-information-system",
    images: [
      "/project/village-system/1.webp",
    ],
  },
  {
    id: 5,
    title: "Smartphone Recommendation",
    period: "May 2024 - Jun 2024",
    categories: ["Web", "Machine Learning"],
    description:
      "Web-based recommendation engine combining unsupervised learning with multi-criteria decision making.",
    highlights: [
      "K-Means clustering for objective hardware specs",
      "AHP for subjective preference ranking",
      "Interactive Flask web interface",
    ],
    tags: ["Python", "Flask", "K-Means", "AHP", "Machine Learning"],
    github: "https://github.com/sslythrrr/AHP-clustering-smartphone",
    images: [
      "/project/smartphone-recommendation/1.webp",
    ],
  },
  {
    id: 6,
    title: "System Dynamics Modeling",
    period: "Nov 2023 - Jan 2024",
    categories: ["Data Science", "Dynamic Simulation"],
    description:
      "Complex system dynamics model projecting Indonesia's fuel availability through 2028.",
    highlights: [
      "Constructed Causal Loop Diagrams and Stock-Flow maps using iThink",
      "Validated with Python against 7 years historical data",
      "Projected supply deficit with low Mean Absolute Deviation",
    ],
    tags: ["Python", "iThink", "System Dynamics", "NumPy", "Matplotlib"],
    github: "https://github.com/sslythrrr/",
    images: [
      "/project/system-dynamic/1.webp",
      "/project/system-dynamic/2.webp",
    ],
  },
  {
    id: 7,
    title: "ETL Pipeline - Steam",
    period: "Apr 2023 - May 2023",
    categories: ["Data Engineering", "Data Science"],
    description:
      "High-concurrency scraping engine harvesting real-time metrics from 100,000+ Steam applications.",
    highlights: [
      "Asynchronous crawler with 60 concurrent requests",
      "Pareto-based filtering for Top 5000 games (99% coverage)",
      "Reduced processing overhead by 90%",
    ],
    tags: ["Python", "Aiohttp", "AsyncIO", "ETL", "Pandas", "Web Scraping"],
    github: "https://github.com/sslythrrr/steam-games-analysis",
    images: [
      "/project/etl-pipeline/1.webp",
    ],
  },
];

const allCategories = ["All", "Mobile", "Data Science", "Data Engineering", "Web", "Dynamic Simulation", "Machine Learning"];

const Projects = () => {
  // Preload image utility
  const preloadImage = (src: string) => {
    if (!src) return;
    const img = new window.Image();
    img.src = src;
  };
  const [activeFilters, setActiveFilters] = useState<string[]>(["All"]);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleFilter = (filter: string) => {
    if (filter === "All") {
      setActiveFilters(["All"]);
    } else {
      let newFilters = activeFilters.filter((f) => f !== "All");
      if (newFilters.includes(filter)) {
        newFilters = newFilters.filter((f) => f !== filter);
      } else {
        newFilters.push(filter);
      }
      setActiveFilters(newFilters.length === 0 ? ["All"] : newFilters);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (activeFilters.includes("All")) return true;
    return project.categories.some((cat) => activeFilters.includes(cat));
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setCurrentIndex(emblaApi.selectedScrollSnap());
    // Preload next and previous images in carousel
    const idx = emblaApi.selectedScrollSnap();
    const nextIdx = idx + 1;
    const prevIdx = idx - 1;
    if (filteredProjects[nextIdx]?.images?.[0]) {
      preloadImage(filteredProjects[nextIdx].images[0]);
    }
    if (filteredProjects[prevIdx]?.images?.[0]) {
      preloadImage(filteredProjects[prevIdx].images[0]);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.scrollTo(0);
      emblaApi.reInit();
    }
  }, [activeFilters, emblaApi]);

  const openProjectModal = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <>
        <section id="projects" className="py-16 md:py-24 px-6 overflow-hidden" ref={ref}>
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-section font-display mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Projects
            </motion.h2>

            {/* Filter Buttons */}
            <motion.div
              className="flex flex-wrap gap-2 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleFilter(category)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 hoverable ${activeFilters.includes(category)
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground/40"
                    }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>

            {/* Desktop Navigation Header */}
            <motion.div
              className="hidden md:flex items-center justify-between mb-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-xs text-muted-foreground">
                <span className="text-foreground">{currentIndex + 1}</span>
                <span className="mx-1.5">/</span>
                <span>{filteredProjects.length}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className="p-2 text-foreground/50 hover:text-foreground transition-colors hoverable disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className="p-2 text-foreground/50 hover:text-foreground transition-colors hoverable disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Projects Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] pr-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        layout
                      >
                        <button
                          onClick={() => openProjectModal(project)}
                          className="w-full text-left group"
                        >
                          <article className="bg-card border border-secondary/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-foreground/20 hover:translate-y-[-2px]">
                            {/* Thumbnail - reduced height */}
                            <div className="aspect-[4/2.5] bg-gradient-to-br from-secondary/50 to-background relative overflow-hidden">
                              {project.images && project.images.length > 0 ? (
                                <>
                                  <img
                                    src={project.images[0]}
                                    alt={project.title + " thumbnail"}
                                    className="w-full h-full object-cover transition-all duration-300 blur-[0px] brightness-80"
                                    loading="lazy"
                                    decoding="async"
                                    width={400}
                                    height={200}
                                  />
                                  {/* Stronger dark overlay for intentional style 
                                <div className="absolute inset-0 bg-black/20 pointer-events-none" />*/}
                                </>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-lg font-display font-semibold text-foreground/10 group-hover:text-foreground/20 transition-colors duration-300">
                                    {project.title.split(" ")[0]}
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Compact Content */}
                            <div className="p-4">
                              <h3 className="text-sm font-display font-semibold leading-tight mb-1 group-hover:text-foreground transition-colors">
                                {project.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {project.period}
                              </p>
                              {/* Description */}
                              <p className="text-xs text-foreground/70 mb-2 line-clamp-2 min-h-[2.5em]">
                                {project.description}
                              </p>
                              {/* Skill Tags */}
                              <div className="flex flex-wrap gap-1">
                                {project.tags.slice(0, 3).map((tag) => (
                                  <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-foreground/5 text-foreground/50 rounded">
                                    {tag}
                                  </span>
                                ))}
                                {project.tags.length > 3 && (
                                  <span className="px-1.5 py-0.5 text-[10px] text-foreground/30">
                                    +{project.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </article>
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Mobile Navigation */}
            <motion.div
              className="flex md:hidden justify-center items-center gap-4 mt-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="p-2 text-foreground/50 active:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1.5">
                {filteredProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentIndex === index
                      ? "bg-foreground w-4"
                      : "bg-foreground/20"
                      }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="p-2 text-foreground/50 active:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </section>
      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Projects;
