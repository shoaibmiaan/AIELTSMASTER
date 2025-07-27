import React from 'react';

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Radial Gradient Pulse */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20 animate-pulse-slow"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(var(--color-primary), 0.1) 50%, transparent 100%)`
        }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(128, 128, 128, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;