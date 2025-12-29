import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { waitForFont } from "@/lib/fontLoader";

interface LoadingScreenProps {
  isLoading: boolean;
  onFinish?: () => void;
}

const words = ["yow", "hola..."];



const LoadingScreen = ({ isLoading, onFinish }: LoadingScreenProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Ganti sesuai font-family utama yang dipakai di loading screen
    waitForFont("Space Grotesk").then(() => {
      if (isMounted) setFontReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading || !fontReady) return;
    setCurrentWordIndex(0);
    setShow(true);

    let wordInterval: NodeJS.Timeout;
    let endTimeout: NodeJS.Timeout;

    wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        } else {
          clearInterval(wordInterval);
          endTimeout = setTimeout(() => {
            setShow(false);
            if (onFinish) onFinish();
          }, 1000);
        }
        return prev;
      });
    }, 700);

    return () => {
      clearInterval(wordInterval);
      clearTimeout(endTimeout);
    };
  }, [isLoading, onFinish, fontReady]);

  return (
    <AnimatePresence>
      {isLoading && show && fontReady && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentWordIndex}
              className="text-4xl md:text-5xl font-display font-semibold text-foreground tracking-tight lowercase"
              initial={{ opacity: 0, y: 40, filter: "blur(16px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(16px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {words[currentWordIndex]}
            </motion.h1>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
