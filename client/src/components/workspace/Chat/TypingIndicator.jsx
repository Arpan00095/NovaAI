import { motion } from "framer-motion";

const Dot = ({ delay }) => (
  <motion.span
    animate={{
      y: [0, -6, 0],
      opacity: [0.3, 1, 0.3],
    }}
    transition={{
      repeat: Infinity,
      duration: 0.8,
      delay,
    }}
    className="
      h-2
      w-2
      rounded-full
      bg-blue-400
    "
  />
);

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div
        className="
          rounded-2xl
          border
          border-slate-700
          bg-[#2a2a2a]
          px-5
          py-4
        "
      >
        <div className="flex items-center gap-2">
          <Dot delay={0} />
          <Dot delay={0.15} />
          <Dot delay={0.3} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;