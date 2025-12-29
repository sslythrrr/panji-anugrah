import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface Project {
  id: number;
  title: string;
  period: string;
  categories: string[];
  description: string;
  highlights: string[];
  tags: string[];
  github: string;
  liveDemo?: string;
  images?: string[];
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  const images = project.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-16 z-[70] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-5xl max-h-full bg-card border border-secondary rounded-xl overflow-hidden pointer-events-auto flex flex-col md:flex-row"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left - Image Gallery */}
              <div className="w-full md:w-1/2 bg-secondary/30 relative aspect-video md:aspect-auto md:h-auto">
                {images.length > 0 ? (
                  <>
                    <img 
                      src={images[currentImageIndex]} 
                      alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/50 backdrop-blur-sm rounded-full text-foreground/70 hover:text-foreground transition-colors hoverable"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/50 backdrop-blur-sm rounded-full text-foreground/70 hover:text-foreground transition-colors hoverable"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                currentImageIndex === index 
                                  ? "bg-foreground w-4" 
                                  : "bg-foreground/40"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full min-h-[200px] md:min-h-0 flex items-center justify-center bg-gradient-to-br from-secondary to-background">
                    <span className="text-2xl font-display font-semibold text-foreground/20">
                      {project.title.split(" ")[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Right - Content */}
              <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[60vh] md:max-h-[80vh]">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors hoverable"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-display font-semibold mb-2 pr-8">
                  {project.title}
                </h2>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {project.period}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.categories.map((cat) => (
                    <span 
                      key={cat} 
                      className="px-2.5 py-1 text-xs font-medium bg-foreground/10 text-foreground/70 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Highlights */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {project.highlights.map((highlight, index) => (
                      <li 
                        key={index} 
                        className="text-sm text-foreground/70 pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-foreground/30 before:rounded-full"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-tag text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3 flex-wrap">
                  {(project.categories.includes("Mobile") || 
                    (project.categories.includes("Web") && !project.categories.includes("Full-Stack"))) ? (
                    <>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors hoverable"
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </a>
                      {project.liveDemo && (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 text-foreground text-sm font-medium rounded-lg hover:border-foreground/40 transition-colors hoverable"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                    </>
                  ) : (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors hoverable"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
