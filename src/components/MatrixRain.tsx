import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface MatrixRainProps {
  isActive: boolean;
  duration?: number;
}

const MatrixRain = ({ isActive, duration = 3000 }: MatrixRainProps) => {
  const [columns, setColumns] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columnCount = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columnCount; i++) {
      drops[i] = Math.random() * -100;
    }

    const chars = "Like the scarlet night veiling the dark You can hide your fear Can lie, my dear このまま 夢を見て 血だらけの翼 広げて Like a fallen angel 時の風に 流されて 落ちてゆく Into the starry night 女神のように 抱きしめて 永遠を Fly into heaven";

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#80d9ce";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.canvas
          ref={canvasRef}
          className="fixed inset-0 z-[70] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </AnimatePresence>
  );
};

export default MatrixRain;
