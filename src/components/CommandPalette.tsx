import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const commands = [
  { command: "help", description: "Show available commands" },
  { command: "about", description: "Scroll to about section" },
  { command: "experience", description: "Scroll to experience section" },
  { command: "projects", description: "Scroll to projects section" },
  { command: "contact", description: "Scroll to contact section" },
  { command: "top", description: "Scroll to top" },
  { command: "clear", description: "Close command palette" },
];

const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([
    "Welcome to the terminal. Type 'help' for available commands.",
  ]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    switch (trimmedCmd) {
      case "help":
        setOutput((prev) => [
          ...prev,
          `> ${cmd}`,
          "Available commands:",
          ...commands.map((c) => `  ${c.command} - ${c.description}`),
        ]);
        break;
      case "about":
      case "experience":
      case "projects":
      case "contact":
        document.getElementById(trimmedCmd)?.scrollIntoView({ behavior: "smooth" });
        setOutput((prev) => [...prev, `> ${cmd}`, `Navigating to ${trimmedCmd}...`]);
        setTimeout(onClose, 500);
        break;
      case "top":
        window.scrollTo({ top: 0, behavior: "smooth" });
        setOutput((prev) => [...prev, `> ${cmd}`, "Scrolling to top..."]);
        setTimeout(onClose, 500);
        break;
      case "clear":
        onClose();
        break;
      default:
        if (trimmedCmd.startsWith("theme ")) {
          const color = trimmedCmd.split(" ")[1];
          setOutput((prev) => [...prev, `> ${cmd}`, `Theme feature coming soon: ${color}`]);
        } else if (trimmedCmd) {
          setOutput((prev) => [
            ...prev,
            `> ${cmd}`,
            `Command not found: ${trimmedCmd}. Type 'help' for available commands.`,
          ]);
        }
    }
    setInput("");
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setOutput(["Welcome to the terminal. Type 'help' for available commands."]);
      setInput("");
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-2xl bg-card border border-secondary rounded-lg overflow-hidden shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-secondary">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-accent/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-sm text-muted-foreground font-mono">terminal</span>
              <button onClick={onClose} className="hoverable">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="h-80 overflow-y-auto p-4 font-mono text-sm scrollbar-hide">
              {output.map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.startsWith(">")
                      ? "text-accent"
                      : line.startsWith("  ")
                      ? "text-foreground/60"
                      : "text-foreground/80"
                  }`}
                >
                  {line}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-accent">❯</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-foreground"
                  autoFocus
                  spellCheck={false}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
