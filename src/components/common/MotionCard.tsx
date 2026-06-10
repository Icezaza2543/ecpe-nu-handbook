import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export function MotionCard({ children, className = '', style, ...props }: MotionCardProps) {
  return (
    <motion.div
      className={`motion-card ${className}`}
      style={style}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
