import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const dotRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check if touch device
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);

    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("hoverable")
      ) {
        setIsHovering(true);
      }
    };

    const handleHoverEnd = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleHoverStart);
    document.addEventListener("mouseout", handleHoverEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleHoverStart);
      document.removeEventListener("mouseout", handleHoverEnd);
    };
  }, [isTouchDevice]);

  // Lerp animation for smooth follow
  useEffect(() => {
    if (isTouchDevice) return;

    let animationId: number;
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      dotRef.current.x = lerp(dotRef.current.x, mousePosition.x, 0.35);
      dotRef.current.y = lerp(dotRef.current.y, mousePosition.y, 0.35);
      ringRef.current.x = lerp(ringRef.current.x, mousePosition.x, 0.15);
      ringRef.current.y = lerp(ringRef.current.y, mousePosition.y, 0.15);

      const dotElement = document.getElementById("cursor-dot");
      const ringElement = document.getElementById("cursor-ring");

      if (dotElement) {
        dotElement.style.transform = `translate(${dotRef.current.x - 4}px, ${dotRef.current.y - 4}px)`;
      }
      if (ringElement) {
        ringElement.style.transform = `translate(${ringRef.current.x - (isHovering ? 24 : 16)}px, ${ringRef.current.y - (isHovering ? 24 : 16)}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [mousePosition, isHovering, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        id="cursor-dot"
        className="fixed top-0 left-0 w-2 h-2 bg-foreground rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
      <motion.div
        id="cursor-ring"
        className="fixed top-0 left-0 rounded-full border border-foreground/50 pointer-events-none z-[9998]"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease, width 0.3s ease, height 0.3s ease",
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
        }}
      />
    </>
  );
};

export default CustomCursor;
