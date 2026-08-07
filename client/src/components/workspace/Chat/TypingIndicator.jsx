import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Dot = ({ delay, colorClass }) => (
  <motion.span
    animate={{
      y: [0, -5, 0],
      opacity: [0.3, 1, 0.3],
      scale: [0.85, 1.15, 0.85],
    }}
    transition={{
      repeat: Infinity,
      duration: 0.9,
      delay,
      ease: "easeInOut",
    }}
    className={`h-2 w-2 rounded-full ${colorClass}`}
  />
);

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-3 py-2 px-1">
      {/* Gemini Style Glowing Sparkle Icon */}
      <div className="relative flex items-center justify-center">
        <Sparkles size={18} className="text-blue-400 animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-sm" />
      </div>

      {/* Smooth Animated Gradient Dots */}
      <div className="flex items-center gap-1.5">
        <Dot delay={0} colorClass="bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
        <Dot delay={0.15} colorClass="bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
        <Dot delay={0.3} colorClass="bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
      </div>

      {/* Subtle Thinking Text */}
      <span className="text-xs font-medium text-slate-400 tracking-wide animate-pulse ml-1">
        Thinking...
      </span>
    </div>
  );
};

export default TypingIndicator;