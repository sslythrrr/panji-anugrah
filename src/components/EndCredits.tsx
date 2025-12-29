import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const EndCredits = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-10 px-6 border-t border-secondary/50">
      <motion.div
        className="max-w-xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors hoverable"
        >
          <ArrowUp className="w-4 h-4" />
          To the summit
          <ArrowUp className="w-4 h-4" />
        </button>
      </motion.div>
    </section>
  );
};

export default EndCredits;
