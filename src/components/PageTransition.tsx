import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  location: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: "100%",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "-100%",
  },
};

const pageTransition = {
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const PageTransition = ({ children, location }: PageTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};