import { useEffect, useRef, useState } from "react";

export const useKonamiCode = (callback: () => void) => {
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];
  const currentIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === konamiCode[currentIndex.current]) {
        currentIndex.current++;
        if (currentIndex.current === konamiCode.length) {
          callback();
          currentIndex.current = 0;
        }
      } else {
        currentIndex.current = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};

export const useTypedText = (targetText: string, callback: () => void) => {
  const currentInput = useRef("");

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      currentInput.current += e.key.toLowerCase();
      
      if (currentInput.current.includes(targetText.toLowerCase())) {
        callback();
        currentInput.current = "";
      }
      
      // Reset if too long
      if (currentInput.current.length > 20) {
        currentInput.current = currentInput.current.slice(-10);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [targetText, callback]);
};

export const useIdleDetection = (idleTime: number, onIdle: () => void, onActive: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (isIdle) {
        setIsIdle(false);
        onActive();
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        onIdle();
      }, idleTime);
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    
    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [idleTime, onIdle, onActive, isIdle]);

  return isIdle;
};

export const useCommandPaletteShortcut = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};
