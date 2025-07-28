import { useState, useEffect, useRef } from 'react'; // Added useRef import
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

// Common interfaces
interface UserProgress {
  writing: number;
  listening: number;
  speaking: number;
  reading: number;
  overall: number;
  targetBand: number;
  streak: number;
}

interface Lesson {
  id: number;
  title: string;
  module: string;
  duration: string;
  progress: number;
  locked: boolean;
}

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Now useRef is defined

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    const particles: any[] = [];
    const particleCount = window.innerWidth / 10;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Reset particles that go off screen
        if (particle.x < 0 || particle.x > canvas.width)
          particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height)
          particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none opacity-20"
    />
  );
};

// Progress Ring Component
function ProgressRing({
  id,
  percent,
  color,
  label,
  band,
  darkMode,
}: {
  id: string;
  percent: number;
  color: string;
  label: string;
  band: number;
  darkMode: boolean;
}) {
  useEffect(() => {
    const animateProgressRing = (id: string, percent: number) => {
      const circle = document.querySelector(`#${id}`) as SVGCircleElement;
      if (circle) {
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference.toString();

        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset.toString();
      }
    };

    animateProgressRing(id, percent);
  }, [id, percent]);

  return (
    <motion.div
      className="text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-20 h-20 mx-auto mb-4">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke={darkMode ? 'rgba(107, 129, 140, 0.2)' : 'rgba(238, 229, 233, 0.3)'}
            strokeWidth="2"
          ></circle>
          <circle
            id={id}
            className="progress-ring__circle transition-all duration-1000 ease-out"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke={color}
            strokeWidth="2"
          ></circle>
          <text
            x="18"
            y="20"
            textAnchor="middle"
            fontSize="10"
            fill={darkMode ? '#EEE5E9' : '#08415C'}
            className="font-medium"
          >
            {percent}%
          </text>
        </svg>
      </div>
      <h3
        className={`font-semibold text-sm ${
          darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
        }`}
      >
        {label}
      </h3>
      <p
        className={`text-xs ${
          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
        }`}
      >
        Band {band}
      </p>
    </motion.div>
  );
}

// Study Plan Item Component
function StudyPlanItem({
  lesson,
  continueLesson,
  darkMode,
}: {
  lesson: Lesson;
  continueLesson: (id: number) => void;
  darkMode: boolean;
}) {
  return (
    <motion.div
      className={`p-4 rounded-xl border border-border bg-card/70 backdrop-blur-lg transition-all duration-300 hover:shadow-lg ${
        lesson.locked
          ? 'opacity-75'
          : darkMode
            ? 'hover:bg-slate-gray-800/50'
            : 'hover:bg-peach-50/50'
      }`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`font-semibold text-sm ${
              lesson.locked
                ? darkMode
                  ? 'text-slate-gray-400'
                  : 'text-slate-gray-500'
                : darkMode
                  ? 'text-lavender-blush-100'
                  : 'text-indigo-dye-900'
            }`}
          >
            {lesson.title}
            {lesson.locked && (
              <span
                className={`ml-2 text-xs px-2 py-1 rounded ${
                  darkMode
                    ? 'bg-slate-gray-700 text-slate-gray-300'
                    : 'bg-lavender-blush-200 text-slate-gray-600'
                }`}
              >
                Locked
              </span>
            )}
          </h3>
          <p
            className={`text-xs mt-1 ${
              darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
            }`}
          >
            {lesson.module} • {lesson.duration}
          </p>
        </div>
        {!lesson.locked && (
          <button
            className={`text-sm font-medium px-3 py-1 rounded-lg hover:bg-persian-red-100 focus:ring-2 focus:ring-persian-red-500 transition-colors ${
              darkMode ? 'text-peach-400' : 'text-persian-red-600'
            }`}
            onClick={() => continueLesson(lesson.id)}
          >
            {lesson.progress > 0 ? 'Continue' : 'Start'}
          </button>
        )}
      </div>
      {lesson.progress > 0 && (
        <div className="mt-3">
          <div
            className={`w-full rounded-full h-2 ${
              darkMode ? 'bg-slate-gray-700' : 'bg-lavender-blush-200'
            }`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                lesson.module === 'Writing'
                  ? 'bg-persian-red-500'
                  : lesson.module === 'Listening'
                    ? 'bg-indigo-dye-500'
                    : lesson.module === 'Speaking'
                      ? 'bg-peach-500'
                      : 'bg-slate-gray-500'
              }`}
              style={{ width: `${lesson.progress}%` }}
            ></div>
          </div>
          <div
            className={`text-right text-xs mt-1 ${
              darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
            }`}
          >
            {lesson.progress}% complete
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Quick Action Button
function QuickActionButton({
  icon,
  color,
  label,
  onClick,
  darkMode,
}: {
  icon: string;
  color: string;
  label: string;
  onClick: () => void;
  darkMode: boolean;
}) {
  return (
    <motion.button
      className={`w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card/70 backdrop-blur-lg hover:bg-peach-50/50 dark:hover:bg-slate-gray-800/50 transition-all duration-200 focus:ring-2 focus:ring-persian-red-500`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: `${color}${darkMode ? '20' : '10'}` }}
        >
          <i className={`${icon} text-lg`} style={{ color }}></i>
        </div>
        <span
          className={`font-semibold text-sm ${
            darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
          }`}
        >
          {label}
        </span>
      </div>
      <i
        className={`fas fa-chevron-right ${
          darkMode ? 'text-slate-gray-500' : 'text-slate-gray-400'
        }`}
      ></i>
    </motion.button>
  );
}

// Flashcard Component
function Flashcard({
  icon,
  color,
  label,
  onClick,
  darkMode,
}: {
  icon: string;
  color: string;
  label: string;
  onClick: () => void;
  darkMode: boolean;
}) {
  return (
    <motion.button
      className={`w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card/70 backdrop-blur-lg hover:bg-peach-50/50 dark:hover:bg-slate-gray-800/50 transition-all duration-200 focus:ring-2 focus:ring-persian-red-500`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: `${color}${darkMode ? '20' : '10'}` }}
        >
          <i className={`${icon} text-lg`} style={{ color }}></i>
        </div>
        <span
          className={`font-semibold text-sm ${
            darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
          }`}
        >
          {label}
        </span>
      </div>
      <i
        className={`fas fa-chevron-right ${
          darkMode ? 'text-slate-gray-500' : 'text-slate-gray-400'
        }`}
      ></i>
    </motion.button>
  );
}

// Activity Item
function ActivityItem({
  activity,
  darkMode,
}: {
  activity: any;
  darkMode: boolean;
}) {
  const bgColor = darkMode
    ? activity.type === 'writing'
      ? 'bg-persian-red-900/50'
      : activity.type === 'speaking'
        ? 'bg-peach-900/50'
        : 'bg-indigo-dye-900/50'
    : activity.type === 'writing'
      ? 'bg-persian-red-100/50'
      : activity.type === 'speaking'
        ? 'bg-peach-100/50'
        : 'bg-indigo-dye-100/50';

  const textColor = darkMode
    ? activity.type === 'writing'
      ? 'text-persian-red-400'
      : activity.type === 'speaking'
        ? 'text-peach-400'
        : 'text-indigo-dye-400'
    : activity.type === 'writing'
      ? 'text-persian-red-600'
      : activity.type === 'speaking'
        ? 'text-peach-600'
        : 'text-indigo-dye-600';

  return (
    <motion.div
      className="flex items-start"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${bgColor} ${textColor}`}
      >
        {activity.type === 'writing' ? (
          <i className="fas fa-edit"></i>
        ) : activity.type === 'speaking' ? (
          <i className="fas fa-microphone-alt"></i>
        ) : (
          <i className="fas fa-clipboard-list"></i>
        )}
      </div>
      <div className="flex-1">
        <h3
          className={`font-semibold text-sm ${
            darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
          }`}
        >
          {activity.title}
        </h3>
        <div className="flex items-center mt-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              activity.score >= 6.5
                ? darkMode
                  ? 'bg-peach-900/30 text-peach-200'
                  : 'bg-peach-100 text-peach-800'
                : activity.score >= 5.5
                  ? darkMode
                    ? 'bg-persian-red-900/30 text-persian-red-200'
                    : 'bg-persian-red-100 text-persian-red-800'
                  : darkMode
                    ? 'bg-indigo-dye-900/30 text-indigo-dye-200'
                    : 'bg-indigo-dye-100 text-indigo-dye-800'
            }`}
          >
            Band {activity.score}
          </span>
          <span
            className={`mx-2 ${
              darkMode ? 'text-slate-gray-600' : 'text-slate-gray-400'
            }`}
          >
            •
          </span>
          <span
            className={`text-xs ${
              darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
            }`}
          >
            {activity.date}
          </span>
        </div>
        <p
          className={`text-xs mt-1 ${
            darkMode ? 'text-peach-400' : 'text-peach-600'
          }`}
        >
          {activity.improvement}
        </p>
      </div>
    </motion.div>
  );
}

// Writing Sample Item
function WritingSampleItem({
  sample,
  viewWritingFeedback,
  darkMode,
}: {
  sample: any;
  viewWritingFeedback: (id: number) => void;
  darkMode: boolean;
}) {
  return (
    <motion.tr
      className={`cursor-pointer transition-all duration-200 ${
        darkMode ? 'hover:bg-slate-gray-700/50' : 'hover:bg-peach-50/50'
      } focus-within:ring-2 focus-within:ring-persian-red-500`}
      onClick={() => viewWritingFeedback(sample.id)}
      whileHover={{ backgroundColor: darkMode ? 'rgba(107, 129, 140, 0.2)' : 'rgba(241, 191, 152, 0.1)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <td
        className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${
          darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
        }`}
      >
        {sample.task}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            sample.band >= 6.5
              ? darkMode
                ? 'bg-peach-900/30 text-peach-200'
                : 'bg-peach-100 text-peach-800'
              : sample.band >= 5.5
                ? darkMode
                  ? 'bg-persian-red-900/30 text-persian-red-200'
                  : 'bg-persian-red-100 text-persian-red-800'
                : darkMode
                  ? 'bg-indigo-dye-900/30 text-indigo-dye-200'
                  : 'bg-indigo-dye-100 text-indigo-dye-800'
          }`}
        >
          {sample.band}
        </span>
      </td>
      <td
        className={`px-4 py-3 whitespace-nowrap text-sm ${
          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
        }`}
      >
        {sample.date}
      </td>
      <td
        className={`px-4 py-3 whitespace-nowrap text-sm ${
          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
        }`}
      >
        {sample.wordCount}
      </td>
      <td
        className={`px-4 py-3 whitespace-nowrap text-sm ${
          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
        }`}
      >
        {sample.feedback ? (
          <i className="fas fa-check-circle text-peach-500"></i>
        ) : (
          <i className="fas fa-clock text-persian-red-500"></i>
        )}
      </td>
    </motion.tr>
  );
}

// Community Post Item
function CommunityPostItem({
  post,
  navigateTo,
  darkMode,
}: {
  post: any;
  navigateTo: (route: string) => void;
  darkMode: boolean;
}) {
  return (
    <motion.div
      className={`p-3 rounded-xl cursor-pointer border border-border bg-card/70 backdrop-blur-lg transition-all duration-200 ${
        darkMode ? 'hover:bg-slate-gray-700/50' : 'hover:bg-peach-50/50'
      } focus:ring-2 focus:ring-persian-red-500`}
      onClick={() => navigateTo('/community')}
      whileHover={{ y: -3 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3
        className={`font-semibold text-sm ${
          darkMode ? 'text-peach-400' : 'text-persian-red-600'
        }`}
      >
        {post.title}
      </h3>
      <div
        className={`flex items-center mt-1 text-xs ${
          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
        }`}
      >
        <span>{post.author}</span>
        <span
          className={`mx-2 ${
            darkMode ? 'text-slate-gray-600' : 'text-slate-gray-400'
          }`}
        >
          •
        </span>
        <span>{post.time}</span>
        <span className="ml-auto flex items-center">
          <i className="far fa-comment mr-1"></i> {post.comments}
        </span>
      </div>
    </motion.div>
  );
}

// Mock Test Item
function MockTestItem({ test, darkMode }: { test: any; darkMode: boolean }) {
  return (
    <motion.div
      className={`flex justify-between items-center p-3 rounded-xl border border-border bg-card/70 backdrop-blur-lg transition-all duration-200 ${
        darkMode ? 'hover:bg-slate-gray-700/50' : 'hover:bg-peach-50/50'
      }`}
      whileHover={{ y: -3 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h3
          className={`font-semibold text-sm ${
            darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
          }`}
        >
          {test.type}
        </h3>
        <p
          className={`text-xs ${
            darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
          }`}
        >
          {test.date}
        </p>
      </div>
      <div className="text-right">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            test.score >= 6.5
              ? darkMode
                ? 'bg-peach-900/30 text-peach-200'
                : 'bg-peach-100 text-peach-800'
              : darkMode
                ? 'bg-persian-red-900/30 text-persian-red-200'
                : 'bg-persian-red-100 text-persian-red-800'
          }`}
        >
          Band {test.score}
        </span>
        <p
          className={`text-xs mt-1 ${
            darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
          }`}
        >
          {test.timeSpent}
        </p>
      </div>
    </motion.div>
  );
}

// AI Tools Section
function AIToolsSection({
  analyzeWriting,
  startSpeakingPractice,
  darkMode,
}: {
  analyzeWriting: () => void;
  startSpeakingPractice: () => void;
  darkMode: boolean;
}) {
  return (
    <motion.div
      className="rounded-xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2
        className={`text-xl font-bold mb-6 ${
          darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
        }`}
      >
        Experience Our AI Tools
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Writing Checker */}
        <motion.div
          className="md:w-1/2 p-6 rounded-xl bg-card/80 backdrop-blur-lg border border-border"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <h3
            className={`font-semibold text-lg mb-4 flex items-center ${
              darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
            }`}
          >
            <i className="fas fa-edit text-persian-red-600 dark:text-persian-red-400 mr-2"></i>{' '}
            Writing Checker
          </h3>
          <textarea
            className={`w-full h-40 p-3 border rounded-xl mb-4 touch-manipulation ${
              darkMode
                ? 'bg-slate-gray-600 border-slate-gray-500 text-lavender-blush-100'
                : 'bg-lavender-blush-100 border-lavender-blush-300 text-indigo-dye-900'
            } focus:ring-2 focus:ring-persian-red-500`}
            placeholder="Paste your IELTS essay here..."
          >
            The internet has revolutionized how we communicate. Some argue it
            has made relationships stronger, while others believe it causes
            isolation. In my opinion, the internet brings people together
            despite physical distances.
          </textarea>
          <motion.button
            className="w-full bg-gradient-to-r from-persian-red-600 to-persian-red-700 text-lavender-blush-100 py-2 rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-persian-red-500 touch-manipulation"
            onClick={analyzeWriting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Analyze My Writing
          </motion.button>
        </motion.div>

        {/* Speaking Analyzer */}
        <motion.div
          className="md:w-1/2 p-6 rounded-xl bg-card/80 backdrop-blur-lg border border-border"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <h3
            className={`font-semibold text-lg mb-4 flex items-center ${
              darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
            }`}
          >
            <i className="fas fa-microphone-alt text-indigo-dye-600 dark:text-indigo-dye-400 mr-2"></i>{' '}
            Speaking Analyzer
          </h3>
          <div
            className={`rounded-xl p-4 mb-4 text-center ${
              darkMode ? 'bg-slate-gray-600' : 'bg-lavender-blush-100'
            } border border-border`}
          >
            <p
              className={`mb-3 ${
                darkMode ? 'text-slate-gray-300' : 'text-slate-gray-600'
              }`}
            >
              Describe a time you helped someone
            </p>
            <motion.button
              className="bg-gradient-to-r from-indigo-dye-600 to-indigo-dye-700 text-lavender-blush-100 px-6 py-2 rounded-xl font-semibold mb-2 transition-colors focus:ring-2 focus:ring-persian-red-500 touch-manipulation"
              onClick={startSpeakingPractice}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-microphone mr-2"></i> Record Response
            </motion.button>
            <p
              className={`text-xs ${
                darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
              }`}
            >
              (Sample: 45 seconds)
            </p>
          </div>
          <motion.button
            className="w-full bg-gradient-to-r from-indigo-dye-600 to-indigo-dye-700 text-lavender-blush-100 py-2 rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-persian-red-500 touch-manipulation"
            onClick={startSpeakingPractice}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Analyze My Speaking
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Target Band Component
function TargetBand({
  userProgress,
  updateTargetBand,
  darkMode,
}: {
  userProgress: UserProgress;
  updateTargetBand: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  darkMode: boolean;
}) {
  return (
    <motion.div
      className="rounded-xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2
        className={`text-xl font-bold mb-6 ${
          darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
        }`}
      >
        Target Band Score
      </h2>
      <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke={darkMode ? 'rgba(107, 129, 140, 0.2)' : 'rgba(238, 229, 233, 0.3)'}
              strokeWidth="2"
            ></circle>
            <circle
              id="overall-progress"
              className="progress-ring__circle transition-all duration-1000 ease-out"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#cc2936"
              strokeWidth="2"
            ></circle>
            <circle
              id="target-progress"
              className="progress-ring__circle transition-all duration-1000 ease-out"
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#f1bf98"
              strokeWidth="2"
            ></circle>
            <text
              x="18"
              y="18"
              textAnchor="middle"
              fontSize="12"
              fill={darkMode ? '#EEE5E9' : '#08415C'}
              dy=".3em"
              fontWeight="bold"
            >
              {userProgress.overall}
            </text>
          </svg>
        </div>
        <div className="mb-4">
          <label
            htmlFor="targetBand"
            className={`block text-sm font-semibold mb-1 ${
              darkMode ? 'text-slate-gray-300' : 'text-slate-gray-700'
            }`}
          >
            Your Target Band
          </label>
          <select
            id="targetBand"
            className={`w-full px-3 py-2 border rounded-xl touch-manipulation ${
              darkMode
                ? 'bg-slate-gray-700 border-slate-gray-600 text-lavender-blush-100'
                : 'bg-lavender-blush-100 border-lavender-blush-300 text-indigo-dye-900'
            } focus:ring-2 focus:ring-persian-red-500`}
            value={userProgress.targetBand}
            onChange={updateTargetBand}
          >
            <option value="6.0">6.0</option>
            <option value="6.5">6.5</option>
            <option value="7.0">7.0</option>
            <option value="7.5">7.5</option>
            <option value="8.0">8.0</option>
            <option value="8.5">8.5</option>
            <option value="9.0">9.0</option>
          </select>
        </div>
        <div
          className={`text-sm mb-4 ${
            darkMode ? 'text-slate-gray-300' : 'text-slate-gray-600'
          }`}
        >
          You're{' '}
          {(
            (userProgress.overall / userProgress.targetBand) *
            100
          ).toFixed(0)}
          % to your target
        </div>
        <motion.button
          className="w-full bg-gradient-to-r from-persian-red-600 to-persian-red-700 text-lavender-blush-100 py-2 rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-persian-red-500 touch-manipulation"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Update Goal
        </motion.button>
      </div>
    </motion.div>
  );
}

// Main Home Content Component
export default function HomeContent({
  user,
  darkMode,
  navigateTo,
  startMockTest,
  analyzeWriting,
  startSpeakingPractice,
  viewWritingFeedback,
  continueLesson,
}: {
  user: any;
  darkMode: boolean;
  navigateTo: (route: string) => void;
  startMockTest: () => void;
  analyzeWriting: () => void;
  startSpeakingPractice: () => void;
  viewWritingFeedback: (id: number) => void;
  continueLesson: (id: number) => void;
}) {
  const router = useRouter();

  const [userProgress, setUserProgress] = useState<UserProgress>({
    writing: user ? 65 : 30,
    listening: user ? 45 : 0,
    speaking: user ? 30 : 0,
    reading: user ? 70 : 45,
    overall: user ? 6.5 : 5.0,
    targetBand: user ? 7.5 : 6.0,
    streak: user ? 7 : 3,
  });

  const [studyPlan, setStudyPlan] = useState<Lesson[]>([
    {
      id: 1,
      title: 'Complex Sentences',
      module: 'Writing',
      duration: '25 min',
      progress: user ? 65 : 30,
      locked: false,
    },
    {
      id: 2,
      title: 'Map Labelling',
      module: 'Listening',
      duration: '35 min',
      progress: user ? 45 : 0,
      locked: !user,
    },
    {
      id: 3,
      title: 'Part 3 Strategies',
      module: 'Speaking',
      duration: '45 min',
      progress: user ? 30 : 0,
      locked: false,
    },
    {
      id: 4,
      title: 'True/False/Not Given',
      module: 'Reading',
      duration: '40 min',
      progress: 0,
      locked: true,
    },
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'writing',
      title: 'Writing Task 2 Evaluation',
      score: 6.0,
      date: '2 hours ago',
      improvement: '+0.5 from last',
    },
    {
      id: 2,
      type: 'mock',
      title: 'Full Mock Test',
      score: 6.5,
      date: '1 day ago',
      improvement: '+1.0 from last',
    },
    {
      id: 3,
      type: 'speaking',
      title: 'Speaking Part 2 Practice',
      score: 5.5,
      date: '3 days ago',
      improvement: '+0.5 from last',
    },
  ]);

  const [writingSamples] = useState([
    {
      id: 1,
      task: 'Task 2 - Opinion Essay',
      band: 6.0,
      date: 'Jul 15',
      wordCount: 265,
      feedback: true,
    },
    {
      id: 2,
      task: 'Task 1 - Line Graph',
      band: 6.5,
      date: 'Jul 10',
      wordCount: 187,
      feedback: true,
    },
    {
      id: 3,
      task: 'Task 2 - Discussion Essay',
      band: 5.5,
      date: 'Jul 5',
      wordCount: 243,
      feedback: false,
    },
  ]);

  const [communityPosts] = useState([
    {
      id: 1,
      title: 'How to improve speaking fluency quickly?',
      comments: 42,
      author: 'Rajesh',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Writing Task 2 sample answer review',
      comments: 18,
      author: 'Maria',
      time: '5 hours ago',
    },
    {
      id: 3,
      title: 'Listening section 3 strategies',
      comments: 7,
      author: 'Ahmed',
      time: '1 day ago',
    },
  ]);

  const [mockTests] = useState([
    {
      id: 1,
      type: 'Full Test',
      date: 'Jul 16',
      score: 6.5,
      timeSpent: '2h 45m',
    },
    {
      id: 2,
      type: 'Reading Only',
      date: 'Jul 12',
      score: 7.0,
      timeSpent: '1h 05m',
    },
    {
      id: 3,
      type: 'Listening Only',
      date: 'Jul 8',
      score: 6.5,
      timeSpent: '40m',
    },
  ]);

  // Update target band
  const updateTargetBand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserProgress({
      ...userProgress,
      targetBand: parseFloat(e.target.value),
    });
    toast.success('Target band updated!');
  };

  return (
    <>
      {/* Animated Background */}
      <ParticleBackground />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl relative z-10">
        {/* Welcome Banner */}
        <motion.div
          className="relative rounded-2xl p-6 md:p-8 mb-8 text-lavender-blush-100 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-dye-600 to-persian-red-600 z-0"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <motion.h1
                  className="text-2xl md:text-3xl font-bold mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome back, {user?.name || user?.email?.split('@')[0]}!
                </motion.h1>
                <motion.p
                  className="mb-4 opacity-90 text-sm max-w-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {userProgress.streak >= 7
                    ? `Great job! Keep up your ${userProgress.streak}-day streak! Practice today to maintain it.`
                    : `Keep up your ${userProgress.streak}-day streak! Practice today to maintain it.`}
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    className="bg-lavender-blush-100 text-persian-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-lavender-blush-200 transition-colors focus:ring-2 focus:ring-persian-red-500 touch-manipulation"
                    onClick={startMockTest}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Take Mock Test
                  </motion.button>
                  <motion.button
                    className="bg-persian-red-700/80 hover:bg-persian-red-800 text-lavender-blush-100 px-4 py-2 rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-persian-red-500 touch-manipulation"
                    onClick={() => navigateTo('/courses')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue Learning
                  </motion.button>
                  <motion.button
                    className="bg-persian-red-700/80 hover:bg-persian-red-800 text-lavender-blush-100 px-4 py-2 rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-persian-red-500 touch-manipulation"
                    onClick={analyzeWriting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Analyze Writing
                  </motion.button>
                  <motion.button
                    className="bg-persian-red-700/80 hover:bg-persian-red-800 text-lavender-blush-100 px-4 py-2 rounded-xl font-semibold transition-colors focus:ring-2 focus:ring-persian-red-500 touch-manipulation"
                    onClick={startSpeakingPractice}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Speaking Practice
                  </motion.button>
                </motion.div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-6">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-3xl font-bold">{userProgress.streak}</div>
                  <div className="text-sm opacity-80">Your Current Streak</div>
                </motion.div>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-3xl font-bold">{userProgress.overall}</div>
                  <div className="text-sm opacity-80">Current Band</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Your Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <motion.div
              className="rounded-2xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
                  }`}
                >
                  Your Progress Overview
                </h2>
                <button
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-peach-400' : 'text-persian-red-600'
                  } hover:underline focus:ring-2 focus:ring-persian-red-500 rounded`}
                  onClick={() => navigateTo('/progress')}
                >
                  View Details →
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ProgressRing
                  id="writing-progress"
                  percent={userProgress.writing}
                  color="#cc2936"
                  label="Writing"
                  band={userProgress.overall - 0.5}
                  darkMode={darkMode}
                />
                <ProgressRing
                  id="listening-progress"
                  percent={userProgress.listening}
                  color="#08415c"
                  label="Listening"
                  band={userProgress.overall + 0.5}
                  darkMode={darkMode}
                />
                <ProgressRing
                  id="speaking-progress"
                  percent={userProgress.speaking}
                  color="#f1bf98"
                  label="Speaking"
                  band={userProgress.overall}
                  darkMode={darkMode}
                />
                <ProgressRing
                  id="reading-progress"
                  percent={userProgress.reading}
                  color="#6b818c"
                  label="Reading"
                  band={userProgress.overall + 0.5}
                  darkMode={darkMode}
                />
              </div>
            </motion.div>

            {/* Study Plan */}
            <motion.div
              className="rounded-2xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
                  }`}
                >
                  Your Study Plan
                </h2>
                <button
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-peach-400' : 'text-persian-red-600'
                  } hover:underline focus:ring-2 focus:ring-persian-red-500 rounded`}
                  onClick={() => navigateTo('/courses')}
                >
                  View All →
                </button>
              </div>
              <div className="space-y-4">
                {studyPlan.map((lesson) => (
                  <StudyPlanItem
                    key={lesson.id}
                    lesson={lesson}
                    continueLesson={continueLesson}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </motion.div>

            {/* Recent Writing Samples */}
            <motion.div
              className="rounded-2xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
                  }`}
                >
                  Recent Writing Samples
                </h2>
                <button
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-peach-400' : 'text-persian-red-600'
                  } hover:underline focus:ring-2 focus:ring-persian-red-500 rounded`}
                  onClick={analyzeWriting}
                >
                  + New Sample →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
                        }`}
                      >
                        Task
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
                        }`}
                      >
                        Band
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
                        }`}
                      >
                        Date
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
                        }`}
                      >
                        Words
                      </th>
                      <th
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          darkMode ? 'text-slate-gray-400' : 'text-slate-gray-500'
                        }`}
                      >
                        Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {writingSamples.map((sample) => (
                      <WritingSampleItem
                        key={sample.id}
                        sample={sample}
                        viewWritingFeedback={viewWritingFeedback}
                        darkMode={darkMode}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* AI Tools Section */}
            <AIToolsSection
              analyzeWriting={analyzeWriting}
              startSpeakingPractice={startSpeakingPractice}
              darkMode={darkMode}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              className="rounded-2xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
                }`}
              >
                Quick Actions
              </h2>
              <div className="space-y-3">
                <QuickActionButton
                  icon="fas fa-clock text-persian-red-600"
                  color="#cc2936"
                  label="Take Mock Test"
                  onClick={startMockTest}
                  darkMode={darkMode}
                />
                <QuickActionButton
                  icon="fas fa-microphone-alt text-indigo-dye-600"
                  color="#08415c"
                  label="Speaking Practice"
                  onClick={startSpeakingPractice}
                  darkMode={darkMode}
                />
                <QuickActionButton
                  icon="fas fa-edit text-peach-600"
                  color="#f1bf98"
                  label="Analyze Writing"
                  onClick={analyzeWriting}
                  darkMode={darkMode}
                />
                <QuickActionButton
                  icon="fas fa-book text-slate-gray-600"
                  color="#6b818c"
                  label="Vocabulary Builder"
                  onClick={() => navigateTo('/vocabulary')}
                  darkMode={darkMode}
                />
              </div>
            </motion.div>

            {/* Flashcards */}
            <motion.div
              className="rounded-2xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
                }`}
              >
                Flashcards
              </h2>
              <div className="space-y-3">
                <Flashcard
                  icon="fas fa-book-open text-persian-red-600"
                  color="#cc2936"
                  label="Vocabulary Review"
                  onClick={() => navigateTo('/flashcards/vocabulary')}
                  darkMode={darkMode}
                />
                <Flashcard
                  icon="fas fa-pen-fancy text-indigo-dye-600"
                  color="#08415c"
                  label="Writing Phrases"
                  onClick={() => navigateTo('/flashcards/writing')}
                  darkMode={darkMode}
                />
                <Flashcard
                  icon="fas fa-headphones text-peach-600"
                  color="#f1bf98"
                  label="Listening Practice"
                  onClick={() => navigateTo('/flashcards/listening')}
                  darkMode={darkMode}
                />
                <Flashcard
                  icon="fas fa-comment-alt text-slate-gray-600"
                  color="#6b818c"
                  label="Speaking Prompts"
                  onClick={() => navigateTo('/flashcards/speaking')}
                  darkMode={darkMode}
                />
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="rounded-2xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
                }`}
              >
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    darkMode={darkMode}
                  />
                ))}
              </div>
            </motion.div>

            {/* Target Band */}
            <TargetBand
              userProgress={userProgress}
              updateTargetBand={updateTargetBand}
              darkMode={darkMode}
            />

            {/* Community Section */}
            <motion.div
              className="rounded-2xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
                }`}
              >
                Community Discussions
              </h2>
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <CommunityPostItem
                    key={post.id}
                    post={post}
                    navigateTo={navigateTo}
                    darkMode={darkMode}
                  />
                ))}
                <button
                  className={`w-full mt-4 font-semibold text-sm ${
                    darkMode ? 'text-peach-400' : 'text-persian-red-600'
                  } hover:underline focus:ring-2 focus:ring-persian-red-500 rounded`}
                  onClick={() => navigateTo('/community')}
                >
                  View all discussions →
                </button>
              </div>
            </motion.div>

            {/* Mock Test History */}
            <motion.div
              className="rounded-2xl shadow-sm p-6 bg-card/70 backdrop-blur-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2
                className={`text-xl font-bold mb-6 ${
                  darkMode ? 'text-lavender-blush-100' : 'text-indigo-dye-900'
                }`}
              >
                Mock Test History
              </h2>
              <div className="space-y-3">
                {mockTests.map((test) => (
                  <MockTestItem key={test.id} test={test} darkMode={darkMode} />
                ))}
                <button
                  className={`w-full mt-2 font-semibold text-sm ${
                    darkMode ? 'text-peach-400' : 'text-persian-red-600'
                  } hover:underline focus:ring-2 focus:ring-persian-red-500 rounded`}
                  onClick={() => navigateTo('/mock-tests')}
                >
                  View full history →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}