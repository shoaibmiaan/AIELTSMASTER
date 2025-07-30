// components/BackgroundAnimation.tsx
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  // Floating orb component using theme colors
  const FloatingOrb = ({ size, initialX, initialY, delay }) => {
    return (
      <motion.div
        className="absolute rounded-full blur-xl"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, rgba(var(--color-primary), 0.1) 0%, transparent 70%)`,
          left: initialX,
          top: initialY,
          opacity: 0.15,
        }}
        animate={{
          x: [0, -20, 10, -15, 5, 0],
          y: [0, 15, -10, 20, -5, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        }}
      />
    );
  };

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Floating Orbs using theme colors */}
      <FloatingOrb size="300px" initialX="10%" initialY="20%" delay={0} />
      <FloatingOrb size="400px" initialX="80%" initialY="60%" delay={10} />
      <FloatingOrb size="250px" initialX="40%" initialY="70%" delay={5} />

      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.03 }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(var(--color-border), 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(var(--color-border), 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Central Radial Pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.02, 0.04, 0.02],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(var(--color-primary), 0.1) 0%, transparent 70%)",
          filter: "blur(30px)",
          opacity: 0.1,
        }}
      />

      {/* IELTS Master Brand Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.01, 0.02, 0.01],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(var(--color-accent), 0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Subtle Wave Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L100 0 L100 100 L0 100 Z' fill='none' stroke='rgb(var(--color-primary))' stroke-width='1' stroke-dasharray='5,5'/%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;