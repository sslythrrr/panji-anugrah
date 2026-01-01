import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { waitForFont } from "@/lib/fontLoader";

interface LoadingScreenProps {
  isLoading: boolean;
  onFinish?: () => void;
}

const words = ["yooo", "welcome"];
const wordTimings = [1000, 1000]; // yooo, sup, legoww
const END_DELAY = 1000;
const TOTAL_DURATION = wordTimings.reduce((sum, time) => sum + time, 0) + END_DELAY;

const LoadingScreen = ({ isLoading, onFinish }: LoadingScreenProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [fontReady, setFontReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Prevent multiple animation runs
  const isAnimatingRef = useRef(false);
  const hasFinishedRef = useRef(false);

  // Block scroll when loading screen is active
  useEffect(() => {
    if (isLoading && show && fontReady) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const scrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLoading, show, fontReady]);

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
    // Guard: prevent multiple runs
    if (!isLoading || !fontReady || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    hasFinishedRef.current = false;
    setCurrentWordIndex(0);
    setShow(true);
    setProgress(0);

    let wordTimeouts: NodeJS.Timeout[] = [];
    let progressInterval: NodeJS.Timeout;

    // Progress animation (smooth 0 to 100%)
    const progressStep = 100 / (TOTAL_DURATION / 50);
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressStep;
        return next >= 100 ? 100 : next;
      });
    }, 50);

    // Dynamic word timing with cumulative delays
    let cumulativeDelay = 0;
    words.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setCurrentWordIndex(index);
      }, cumulativeDelay);

      wordTimeouts.push(timeout);
      cumulativeDelay += wordTimings[index];
    });

    // Final timeout to trigger end
    const endTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          setShow(false);
          if (onFinish) onFinish();
        }
      }, END_DELAY);
    }, cumulativeDelay);

    return () => {
      wordTimeouts.forEach(clearTimeout);
      clearTimeout(endTimeout);
      clearInterval(progressInterval);
      isAnimatingRef.current = false;
    };
  }, [isLoading, fontReady, onFinish]);

  return (
    <AnimatePresence>
      {isLoading && show && fontReady && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentWordIndex}
                className="text-4xl md:text-5xl font-display font-semibold text-foreground tracking-tight lowercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
   
              >
                {words[currentWordIndex]}
              </motion.h1>
            </AnimatePresence>

            {/* Progress percentage */}
            <motion.p
              className="text-sm text-muted-foreground font-mono tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.2 }}
            >
              {Math.round(progress)}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
