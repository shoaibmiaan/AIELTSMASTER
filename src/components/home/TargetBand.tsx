'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface UserProgress {
  overall: number;
  targetBand: number;
}

interface TargetBandProps {
  userProgress: UserProgress;
  updateTargetBand: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  darkMode: boolean;
}

export default function TargetBand({
  userProgress,
  updateTargetBand,
  darkMode,
}: TargetBandProps) {
  useEffect(() => {
    const animateProgressRing = (id: string, percent: number) => {
      const circle = document.querySelector(`#${id}`) as SVGCircleElement | null;
      if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference.toString();
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset.toString();
      }
    };

    animateProgressRing('overall-progress', (userProgress.overall / 9) * 100);
    animateProgressRing('target-progress', (userProgress.targetBand / 9) * 100);
  }, [userProgress]);

  const progressPercentage = Math.round(
    (userProgress.overall / userProgress.targetBand) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--color-lavender_blush)] dark:bg-[var(--color-slate_gray)] rounded-2xl shadow-lg p-6 border border-[var(--color-slate_gray)/0.2] dark:border-[var(--color-peach)/0.2] backdrop-blur-sm"
    >
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-slate_gray)] dark:text-[var(--color-lavender_blush)]">
        Target Band Score
      </h2>
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="var(--color-slate_gray)/0.2"
              strokeWidth="2"
            />
            <motion.circle
              id="overall-progress"
              className="progress-ring__circle"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="var(--color-peach)"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 100 - ((userProgress.overall / 9) * 100) }}
              transition={{ duration: 1 }}
            />
            <motion.circle
              id="target-progress"
              className="progress-ring__circle"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="var(--color-persian_red)"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 100 - ((userProgress.targetBand / 9) * 100) }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <text
              x="18"
              y="18"
              textAnchor="middle"
              fontSize="12"
              fill="var(--color-slate_gray)"
              className="dark:fill-[var(--color-lavender_blush)] font-bold"
              dy=".3em"
            >
              {userProgress.overall.toFixed(1)}
            </text>
            <text
              x="18"
              y="24"
              textAnchor="middle"
              fontSize="8"
              fill="var(--color-slate_gray)/0.7"
              className="dark:fill-[var(--color-peach)/0.7]"
              dy=".3em"
            >
              Current
            </text>
          </svg>
          <div className="absolute -bottom-4 left-0 right-0 text-center">
            <span className="inline-block bg-[var(--color-persian_red)/0.1] dark:bg-[var(--color-persian_red)/0.2] text-[var(--color-persian_red)] dark:text-[var(--color-persian_red)] text-xs px-3 py-1 rounded-full font-medium">
              Target: {userProgress.targetBand}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="targetBand"
            className="block text-sm font-medium text-[var(--color-slate_gray)] dark:text-[var(--color-lavender_blush)] mb-2"
          >
            Your Target Band
          </label>
          <select
            id="targetBand"
            className="w-full px-4 py-2 border border-[var(--color-slate_gray)/0.2] dark:border-[var(--color-peach)/0.2] rounded-lg bg-[var(--color-lavender_blush)] dark:bg-[var(--color-slate_gray)] text-[var(--color-slate_gray)] dark:text-[var(--color-lavender_blush)] focus:ring-2 focus:ring-[var(--color-indigo_dye)] dark:focus:ring-[var(--color-peach)] focus:outline-none transition-all"
            value={userProgress.targetBand}
            onChange={updateTargetBand}
          >
            {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((band) => (
              <option key={band} value={band}>
                Band {band}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-[var(--color-slate_gray)/0.7] dark:text-[var(--color-peach)/0.7] mb-6">
          {userProgress.overall >= userProgress.targetBand ? (
            <span className="text-[var(--color-persian_red)] dark:text-[var(--color-persian_red)] font-medium">
              Congratulations! You've reached your target band!
            </span>
          ) : (
            <span>You're {progressPercentage}% to your target band</span>
          )}
        </div>
        <button
          className="w-full bg-[var(--color-indigo_dye)] hover:bg-[var(--color-indigo_dye)/0.8] text-[var(--color-lavender_blush)] py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo_dye)] dark:focus:ring-[var(--color-peach)]"
          onClick={() => updateTargetBand({ target: { value: userProgress.targetBand.toString() } } as any)}
        >
          Update Goal
        </button>
      </div>
    </motion.div>
  );
}