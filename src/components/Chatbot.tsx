import { useState, useRef, useEffect } from "react";
import { motion, useDragControls, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, GripVertical, Minimize2, Check, CheckCheck, ExternalLink, Github, Linkedin, Mail, FileText, Facebook, Instagram } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  status?: "sending" | "sent" | "delivered" | "read";
  timestamp?: Date;
  links?: LinkButton[];
}

interface LinkButton {
  label: string;
  url: string;
  icon: "github" | "linkedin" | "mail" | "resume" | "github" | "instagram" | "facebook" | "external";
}

const triggerHaptic = (style: "light" | "medium" = "light") => {
  if ("vibrate" in navigator) {
    navigator.vibrate(style === "light" ? 10 : 25);
  }
};

interface ResponseRule {
  keywords: string[];
  response: string | string[];
  followUp?: string;
  category?: string;
  links?: LinkButton[];
}

const botResponses: ResponseRule[] = [
  {
    keywords: ["hello", "hi", "hey", "halo", "yow", "sup", "yo"],
    response: [
      "Hey there! I'm Arcturus, your guide to this portfolio. How can I help you today?",
      "Hello! Welcome aboard. I'm Arcturus — ask me anything about the work showcased here.",
      "Hey! Good to see you. I'm Arcturus, ready to help you explore!",
    ],
    category: "greeting",
  },
  {
    keywords: ["good morning", "morning"],
    response: "Good morning! Hope you're having a great day. I'm Arcturus — what can I help you with?",
    category: "greeting",
  },
  {
    keywords: ["good night", "night"],
    response: "Good night! Thanks for stopping by. Come back anytime — Arcturus will be here!",
    category: "greeting",
  },

  {
    keywords: ["name", "who are you", "siapa", "what are you", "your name", "arcturus"],
    response: "I'm Arcturus — named after one of the brightest stars in the night sky. I'm your personal guide to navigating this portfolio. Think of me as your digital concierge here!",
    followUp: "Would you like to know about projects, experience, or skills?",
  },
  {
    keywords: ["how are you", "how r u", "how do you do", "wassup"],
    response: [
      "I'm doing stellar, thanks for asking! Ready to help you explore.",
      "All systems running smoothly! What would you like to know?",
    ],
  },

  {
    keywords: ["project", "work", "portfolio", "showcase", "built", "made", "create"],
    response: "You can find all projects in the Projects section — each card is clickable for full details including images, descriptions, and tech stacks used.",
    followUp: "Want me to tell you about any specific type of project?",
  },
  {
    keywords: ["mobile app", "android", "ios", "flutter", "kotlin"],
    response: "There are several mobile projects built with Flutter and Kotlin. Check the Projects section and filter by 'Mobile' category!",
  },
  {
    keywords: ["web app", "website", "frontend", "react", "next"],
    response: "The web projects showcase React and modern frontend work. Look for the 'Web' category in Projects!",
  },
  {
    keywords: ["full stack", "fullstack", "backend"],
    response: "Full-stack projects include both frontend and backend work - check those out in the Projects section!",
  },

  {
    keywords: ["contact", "reach", "hire", "message", "connect with", "get in touch"],
    response: "You can reach out directly! Here's the quickest way to connect:",
    links: [
      { label: "Send Email", url: "mailto:an.tubagusp@gmail.com", icon: "mail" },
      { label: "LinkedIn", url: "https://linkedin.com/in/panji-anugrah", icon: "linkedin" },
    ],
  },
  {
    keywords: ["email", "mail", "e-mail"],
    response: "Here's a direct link to send an email:",
    links: [
      { label: "Send Email", url: "mailto:an.tubagusp@gmail.com", icon: "mail" },
    ],
  },
  {
    keywords: ["available", "freelance", "work together", "collaborate", "job", "opportunity"],
    response: "For collaboration or job opportunities, feel free to reach out directly:",
    links: [
      { label: "Send Email", url: "mailto:an.tubagusp@gmail.com", icon: "mail" },
      { label: "LinkedIn", url: "https://linkedin.com/in/panji-anugrah", icon: "linkedin" },
    ],
  },

  {
    keywords: ["experience", "job", "work history", "career", "company", "companies"],
    response: "The Experience section showcases the professional journey with detailed role descriptions and company info. It's right after About!",
  },
  {
    keywords: ["education", "study", "school", "university", "degree"],
    response: "Educational background can be found in the About section. It covers the academic journey and qualifications.",
  },

  {
    keywords: ["skill", "tech", "stack", "language", "tool", "technology", "technologies"],
    response: "Check out the scrolling marquee in the About section — it shows all technologies, languages, and tools. From React to Python to Flutter!",
  },
  {
    keywords: ["python", "programming"],
    response: "Yes, Python is part of the skill set! It's great for backend, automation, and data projects.",
  },
  {
    keywords: ["javascript", "typescript", "js", "ts"],
    response: "JavaScript and TypeScript are core technologies here — used heavily in React and Node.js projects!",
  },

  {
    keywords: ["resume", "cv", "download"],
    response: "Here's the resume for you to check out:",
    links: [
      { label: "Resume", url: "#hero", icon: "resume" },
    ],
  },

  {
    keywords: ["github", "code", "source", "repo", "repository"],
    response: "Want to explore the code? Here's the GitHub profile:",
    links: [
      { label: "GitHub", url: "https://github.com/sslythrrr", icon: "github" },
    ],
  },

  {
    keywords: ["linkedin", "social", "professional", "network"],
    response: "Let's connect professionally! Here's the LinkedIn profile:",
    links: [
      { label: "LinkedIn", url: "https://linkedin.com/in/panji-anugrah", icon: "linkedin" },
    ],
  },
  {
    keywords: ["instagram", "insta", "photo", "pictures"],
    response: "For a glimpse behind the scenes, check out the Instagram profile:",
    links: [
      { label: "Instagram", url: "https://instagram.com/tubaguspn", icon: "instagram" },
    ],
  },
  {
    keywords: ["facebook", "fb", "social media"],
    response: "Connect on Facebook for updates and more:",
    links: [
      { label: "Facebook", url: "https://facebook.com/panji.anoegrah", icon: "facebook" },
    ],
  }
  ,
  {
    keywords: ["link", "social media", "socials", "all links", "profiles"],
    response: "Here are all the important links you might need:",
    links: [
      { label: "GitHub", url: "https://github.com/sslythrrr", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com/in/panji-anugrah", icon: "linkedin" },
      { label: "Email", url: "mailto:an.tubagusp@gmail.com", icon: "mail" },
      { label: "Resume", url: "#hero", icon: "resume" },
    ],
  },

  {
    keywords: ["about", "who", "background", "story", "introduction"],
    response: "The About section tells the story — scroll down a bit from the hero and you'll find the background, journey, and what drives the work.",
  },
  {
    keywords: ["location", "where", "based", "country", "city"],
    response: "Location info is in the About section. Feel free to check it out!",
  },

  {
    keywords: ["thanks", "thank you", "thx", "appreciate", "helpful", "great"],
    response: [
      "You're welcome! Happy to help. Anything else you'd like to know?",
      "Glad I could help! Feel free to ask more questions.",
      "Anytime! That's what Arcturus is here for.",
    ],
  },
  {
    keywords: ["awesome", "cool", "nice", "amazing", "wow", "impressive"],
    response: [
      "Thanks! Glad you're enjoying the portfolio!",
      "Appreciate the kind words! Let me know if you have questions.",
    ],
  },

  {
    keywords: ["bye", "goodbye", "see you", "later", "leaving", "gotta go"],
    response: [
      "Take care! Hope you enjoyed exploring the portfolio. — Arcturus",
      "Goodbye! Come back anytime. 👋",
      "See you around! Don't hesitate to reach out.",
    ],
  },

  {
    keywords: ["joke", "funny", "humor", "laugh"],
    response: [
      "Why do programmers prefer dark mode? Because light attracts bugs! 😄",
      "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
      "There are only 10 types of people — those who understand binary and those who don't!",
    ],
  },
  {
    keywords: ["secret", "easter egg", "hidden", "surprise"],
    response: "Psst... try typing 'matrix' somewhere on the page, or the Konami code. You might find something interesting! 🕵️",
  },
  {
    keywords: ["help", "what can you do", "commands", "options"],
    response: "I'm Arcturus, your guide here! I can help you navigate. Ask about: projects, skills, experience, contact info, resume, social links, or just chat. What interests you?",
  },

  {
    keywords: ["?"],
    response: "Good question! Could you be more specific? I can help with projects, skills, experience, or contact info.",
  },
];

const parseGroqResponse = (text: string): { text: string; links?: LinkButton[] } => {
  const linkRegex = /\[LINKS\]([\s\S]*?)\[\/LINKS\]/;
  const match = text.match(linkRegex);

  if (!match) {
    return { text: text.trim() };
  }

  const cleanText = text.replace(linkRegex, '').trim();
  const linksSection = match[1].trim();
  
  const links: LinkButton[] = [];
  const lines = linksSection.split('\n').filter(line => line.trim());

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length !== 3) continue;

    const label = parts[0].replace(/^label:\s*/i, '').trim();
    const url = parts[1].replace(/^url:\s*/i, '').trim();
    const icon = parts[2].replace(/^icon:\s*/i, '').trim() as LinkButton['icon'];

    if (label && url && icon) {
      links.push({ label, url, icon });
    }
  }

  return {
    text: cleanText,
    links: links.length > 0 ? links : undefined
  };
};

const defaultResponses = [
  "Hmm, I'm not sure about that. Try asking about projects, experience, skills, or contact info!",
  "I didn't quite catch that. Would you like to know about the portfolio, or how to get in touch?",
  "Not sure I understand, but I can help with navigation, projects, or skills. What interests you?",
];

const findResponse = (input: string): { text: string; links?: LinkButton[] } => {
  const lowerInput = input.toLowerCase().trim();

  for (const item of botResponses) {
    if (item.keywords.some((keyword) => lowerInput.includes(keyword))) {
      const response = Array.isArray(item.response)
        ? item.response[Math.floor(Math.random() * item.response.length)]
        : item.response;

      let finalText = response;
      if (item.followUp && Math.random() > 0.5) {
        finalText = `${response}\n\n${item.followUp}`;
      }
      return { text: finalText, links: item.links };
    }
  }

  return { text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)] };
};

const LinkIcon = ({ type }: { type: LinkButton["icon"] }) => {
  switch (type) {
    case "github":
      return <Github className="w-3.5 h-3.5" />;
    case "linkedin":
      return <Linkedin className="w-3.5 h-3.5" />;
    case "facebook":
      return <Facebook className="w-3.5 h-3.5" />;
    case "instagram":
      return <Instagram className="w-3.5 h-3.5" />;
    case "mail":
      return <Mail className="w-3.5 h-3.5" />;
    case "resume":
      return <FileText className="w-3.5 h-3.5" />;
    default:
      return <ExternalLink className="w-3.5 h-3.5" />;
  }
};

const Chatbot = () => {
  //const [isAIMode, setIsAIMode] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey! Let me know if you have any questions.", isBot: true, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    triggerHaptic("medium");
  };

  const handleSend = () => {
    if (!input.trim()) return;

    triggerHaptic("light");

    const userMessage: Message = {
      id: Date.now(),
      text: input.trim(),
      isBot: false,
      status: "sending",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMessage.id ? { ...m, status: "sent" as const } : m))
      );
    }, 200);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMessage.id ? { ...m, status: "delivered" as const } : m))
      );
      setIsTyping(true);
    }, 500);

    const typingDelay = 1200 + Math.random() * 800;
    setTimeout(async () => {
      // Mark as read
      setMessages((prev) =>
        prev.map((m) => (m.id === userMessage.id ? { ...m, status: "read" as const } : m))
      );

      let botResponse: { text: string; links?: LinkButton[] } | null = null;
      let usedAI = false;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userInput,
            history: messages
              .slice(-6)
              .map(m => ({
                role: m.isBot ? 'assistant' : 'user',
                content: m.text
              }))
          }),
        });
        if (response.ok) {
          const data = await response.json();

          if (!data.fallback && data.response) {
            // Parse links dari respons Groq
            const parsedResponse = parseGroqResponse(data.response);
            botResponse = parsedResponse;
            usedAI = true;
            setApiError(false);
          }
        }
      } catch (error) {
        console.log('Groq API error, falling back to rule-based:', error);
      }

      if (!botResponse) {
        console.log('Using rule-based fallback');
        setApiError(true);
        botResponse = findResponse(userInput);
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse.text,
        isBot: true,
        timestamp: new Date(),
        links: botResponse.links,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      triggerHaptic("light");
    }, typingDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Drag constraints container */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />

      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-secondary/80 backdrop-blur-sm border border-border/30 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-border/50 transition-all duration-300 hoverable"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            }}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragControls={dragControls}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            dragElastic={0.1}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "auto" : 420,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 right-6 z-50 w-80 bg-background/95 backdrop-blur-md border border-border/30 rounded-2xl overflow-hidden flex flex-col"
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)",
            }}
          >
            {/* Header */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex items-center justify-between px-4 py-3 border-b border-border/20 cursor-grab active:cursor-grabbing bg-secondary/30"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-foreground/30" />
                <div className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                <span className="text-sm font-medium tracking-wide text-foreground/90">Arcturus</span>
                {apiError && (
                  <span className="text-[10px] text-foreground/40">(offline)</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-foreground/40 hover:text-foreground/70 transition-colors hoverable"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-foreground/40 hover:text-foreground/70 transition-colors hoverable"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
                  style={{ maxHeight: 280 }}
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`flex flex-col ${message.isBot ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-line ${message.isBot
                          ? "bg-secondary/50 text-foreground/80 rounded-tl-sm"
                          : "bg-primary/20 text-foreground/90 rounded-tr-sm border border-primary/20"
                          }`}
                      >
                        {message.text}
                      </div>

                      {/* Interactive Link Buttons */}
                      {message.isBot && message.links && message.links.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="flex flex-wrap gap-2 mt-2"
                        >
                          {message.links.map((link, index) => (
                            <motion.a
                              key={index}
                              href={link.url}
                              target={link.url.startsWith("mailto:") || link.url.startsWith("#") ? "_self" : "_blank"}
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.15 + index * 0.05 }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => triggerHaptic("light")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/20 text-foreground/80 border border-primary/30 hover:bg-primary/30 hover:text-foreground transition-all duration-200 hoverable"
                            >
                              <LinkIcon type={link.icon} />
                              {link.label}
                            </motion.a>
                          ))}
                        </motion.div>
                      )}

                      {/* Read receipts for user messages */}
                      {!message.isBot && message.status && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-1 mt-1 pr-1"
                        >
                          <span className="text-[10px] text-foreground/30">
                            {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="flex items-center"
                          >
                            {message.status === "sending" && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-3 h-3 border border-foreground/30 border-t-transparent rounded-full"
                              />
                            )}
                            {message.status === "sent" && (
                              <Check className="w-3 h-3 text-foreground/40" />
                            )}
                            {message.status === "delivered" && (
                              <CheckCheck className="w-3 h-3 text-foreground/40" />
                            )}
                            {message.status === "read" && (
                              <CheckCheck className="w-3 h-3 text-primary/80" />
                            )}
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="bg-secondary/50 px-4 py-3 rounded-xl rounded-tl-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="w-2 h-2 bg-foreground/50 rounded-full"
                                animate={{
                                  y: [0, -4, 0],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.15,
                                  ease: "easeInOut"
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-foreground/40 ml-1">typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-3 border-t border-border/20 bg-secondary/20"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything..."
                      className="flex-1 bg-background/50 border border-border/20 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-border/40 transition-colors"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-2 rounded-lg bg-primary/20 text-foreground/70 hover:text-foreground hover:bg-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed hoverable"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
