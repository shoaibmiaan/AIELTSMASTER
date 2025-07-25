import { useState, useEffect } from 'react';
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
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-2">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke={darkMode ? '#374151' : '#e2e8f0'}
            strokeWidth="2"
          ></circle>
          <circle
            id={id}
            className="progress-ring__circle"
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
            fill={darkMode ? '#f9fafb' : '#1f2937'}
          >
            {percent}%
          </text>
        </svg>
      </div>
      <h3
        className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
      >
        {label}
      </h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Band {band}
      </p>
    </div>
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
    <div
      className={`p-4 rounded-lg border ${
        lesson.locked
          ? `${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`
          : `${darkMode ? 'border-yellow-900 bg-yellow-950' : 'border-yellow-100 bg-yellow-50'}`
      } transition-all duration-300`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3
            className={`font-medium ${
              lesson.locked
                ? `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                : `${darkMode ? 'text-gray-100' : 'text-gray-800'}`
            }`}
          >
            {lesson.title}
            {lesson.locked && (
              <span
                className={`ml-2 text-xs px-2 py-1 rounded ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Locked
              </span>
            )}
          </h3>
          <p
            className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {lesson.module} • {lesson.duration}
          </p>
        </div>
        {!lesson.locked && (
          <button
            className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
            onClick={() => continueLesson(lesson.id)}
          >
            {lesson.progress > 0 ? 'Continue' : 'Start'}
          </button>
        )}
      </div>
      {lesson.progress > 0 && (
        <div className="mt-3">
          <div
            className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <div
              className={`h-2 rounded-full ${
                lesson.module === 'Writing'
                  ? 'bg-yellow-500'
                  : lesson.module === 'Listening'
                    ? 'bg-purple-500'
                    : lesson.module === 'Speaking'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
              }`}
              style={{ width: `${lesson.progress}%` }}
            ></div>
          </div>
          <div
            className={`text-right text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {lesson.progress}% complete
          </div>
        </div>
      )}
    </div>
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
    <button
      className={`w-full flex items-center justify-between p-4 rounded-lg hover:opacity-90 transition-opacity ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: `${color}${darkMode ? '20' : '10'}` }}
        >
          <i className={`${icon}`} style={{ color }}></i>
        </div>
        <span
          className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
        >
          {label}
        </span>
      </div>
      <i
        className={`fas fa-chevron-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
      ></i>
    </button>
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
    <button
      className={`w-full flex items-center justify-between p-4 rounded-lg hover:opacity-90 transition-opacity ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: `${color}${darkMode ? '20' : '10'}` }}
        >
          <i className={`${icon}`} style={{ color }}></i>
        </div>
        <span
          className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
        >
          {label}
        </span>
      </div>
      <i
        className={`fas fa-chevron-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
      ></i>
    </button>
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
      ? 'bg-yellow-900'
      : activity.type === 'speaking'
        ? 'bg-green-900'
        : 'bg-purple-900'
    : activity.type === 'writing'
      ? 'bg-yellow-100'
      : activity.type === 'speaking'
        ? 'bg-green-100'
        : 'bg-purple-100';

  const textColor = darkMode
    ? activity.type === 'writing'
      ? 'text-yellow-400'
      : activity.type === 'speaking'
        ? 'text-green-400'
        : 'text-purple-400'
    : activity.type === 'writing'
      ? 'text-yellow-600'
      : activity.type === 'speaking'
        ? 'text-green-600'
        : 'text-purple-600';

  return (
    <div className="flex items-start">
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
          className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
        >
          {activity.title}
        </h3>
        <div className="flex items-center mt-1">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              activity.score >= 6.5
                ? darkMode
                  ? 'bg-green-900 text-green-200'
                  : 'bg-green-100 text-green-800'
                : activity.score >= 5.5
                  ? darkMode
                    ? 'bg-yellow-900 text-yellow-200'
                    : 'bg-yellow-100 text-yellow-800'
                  : darkMode
                    ? 'bg-red-900 text-red-200'
                    : 'bg-red-100 text-red-800'
            }`}
          >
            Band {activity.score}
          </span>
          <span
            className={`mx-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
          >
            •
          </span>
          <span
            className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {activity.date}
          </span>
        </div>
        <p
          className={`text-xs mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}
        >
          {activity.improvement}
        </p>
      </div>
    </div>
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
    <tr
      className={`cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
      onClick={() => viewWritingFeedback(sample.id)}
    >
      <td
        className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}
      >
        {sample.task}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            sample.band >= 6.5
              ? darkMode
                ? 'bg-green-900 text-green-200'
                : 'bg-green-100 text-green-800'
              : sample.band >= 5.5
                ? darkMode
                  ? 'bg-yellow-900 text-yellow-200'
                  : 'bg-yellow-100 text-yellow-800'
                : darkMode
                  ? 'bg-red-900 text-red-200'
                  : 'bg-red-100 text-red-800'
          }`}
        >
          {sample.band}
        </span>
      </td>
      <td
        className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {sample.date}
      </td>
      <td
        className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {sample.wordCount}
      </td>
      <td
        className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
      >
        {sample.feedback ? (
          <i className="fas fa-check-circle text-green-500"></i>
        ) : (
          <i className="fas fa-clock text-yellow-500"></i>
        )}
      </td>
    </tr>
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
    <div
      className={`p-3 rounded-lg cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
      onClick={() => navigateTo('/community')}
    >
      <h3
        className={`font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
      >
        {post.title}
      </h3>
      <div
        className={`flex items-center mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
      >
        <span>{post.author}</span>
        <span
          className={`mx-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
        >
          •
        </span>
        <span>{post.time}</span>
        <span className="ml-auto flex items-center">
          <i className="far fa-comment mr-1"></i> {post.comments}
        </span>
      </div>
    </div>
  );
}

// Mock Test Item
function MockTestItem({ test, darkMode }: { test: any; darkMode: boolean }) {
  return (
    <div
      className={`flex justify-between items-center p-3 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}
    >
      <div>
        <h3
          className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
        >
          {test.type}
        </h3>
        <p
          className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          {test.date}
        </p>
      </div>
      <div className="text-right">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            test.score >= 6.5
              ? darkMode
                ? 'bg-green-900 text-green-200'
                : 'bg-green-100 text-green-800'
              : darkMode
                ? 'bg-yellow-900 text-yellow-200'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          Band {test.score}
        </span>
        <p
          className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          {test.timeSpent}
        </p>
      </div>
    </div>
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
    <div
      className={`rounded-xl shadow-sm p-6 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <h2
        className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
      >
        Experience Our AI Tools
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Writing Checker */}
        <div
          className={`md:w-1/2 p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}
        >
          <h3
            className={`font-semibold text-lg mb-4 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            <i className="fas fa-edit text-yellow-600 dark:text-yellow-400 mr-2"></i>{' '}
            Writing Checker
          </h3>
          <textarea
            className={`w-full h-40 p-3 border rounded-md mb-4 ${
              darkMode
                ? 'bg-gray-600 border-gray-500 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            placeholder="Paste your IELTS essay here..."
          >
            The internet has revolutionized how we communicate. Some argue it
            has made relationships stronger, while others believe it causes
            isolation. In my opinion, the internet brings people together
            despite physical distances.
          </textarea>
          <button
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium"
            onClick={analyzeWriting}
          >
            Analyze My Writing
          </button>
        </div>

        {/* Speaking Analyzer */}
        <div
          className={`md:w-1/2 p-6 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}
        >
          <h3
            className={`font-semibold text-lg mb-4 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            <i className="fas fa-microphone-alt text-purple-600 dark:text-purple-400 mr-2"></i>{' '}
            Speaking Analyzer
          </h3>
          <div
            className={`rounded-md p-4 mb-4 text-center ${
              darkMode ? 'bg-gray-600' : 'bg-white'
            }`}
          >
            <p
              className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Describe a time you helped someone
            </p>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium mb-2"
              onClick={startSpeakingPractice}
            >
              <i className="fas fa-microphone mr-2"></i> Record Response
            </button>
            <p
              className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              (Sample: 45 seconds)
            </p>
          </div>
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium"
            onClick={startSpeakingPractice}
          >
            Analyze My Speaking
          </button>
        </div>
      </div>
    </div>
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
    <main className="container mx-auto px-6 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 md:p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.name || user?.email?.split('@')[0]}!
            </h1>
            <p className="mb-4 opacity-90">
              {userProgress.streak >= 7
                ? `Great job! Keep up your ${userProgress.streak}-day streak! Practice today to maintain it.`
                : `Keep up your ${userProgress.streak}-day streak! Practice today to maintain it.`}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-white text-yellow-600 px-4 py-2 rounded-md font-medium"
                onClick={startMockTest}
              >
                Take Mock Test
              </button>
              <button
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-md font-medium"
                onClick={() => navigateTo('/courses')}
              >
                Continue Learning
              </button>
              <button
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-md font-medium"
                onClick={analyzeWriting}
              >
                Analyze Writing
              </button>
              <button
                className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded-md font-medium"
                onClick={startSpeakingPractice}
              >
                Speaking Practice
              </button>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="text-center mr-6">
              <div className="text-3xl font-bold">{userProgress.streak}</div>
              <div className="text-sm opacity-80">Your Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userProgress.overall}</div>
              <div className="text-sm opacity-80">Current Band</div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Overview */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Your Progress Overview
              </h2>
              <button
                className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
                onClick={() => navigateTo('/progress')}
              >
                View Details →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ProgressRing
                id="writing-progress"
                percent={userProgress.writing}
                color="#f59e0b"
                label="Writing"
                band={userProgress.overall - 0.5}
                darkMode={darkMode}
              />
              <ProgressRing
                id="listening-progress"
                percent={userProgress.listening}
                color="#8b5cf6"
                label="Listening"
                band={userProgress.overall + 0.5}
                darkMode={darkMode}
              />
              <ProgressRing
                id="speaking-progress"
                percent={userProgress.speaking}
                color="#10b981"
                label="Speaking"
                band={userProgress.overall}
                darkMode={darkMode}
              />
              <ProgressRing
                id="reading-progress"
                percent={userProgress.reading}
                color="#3b82f6"
                label="Reading"
                band={userProgress.overall + 0.5}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Study Plan */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Your Study Plan
              </h2>
              <button
                className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
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
          </div>

          {/* Recent Writing Samples */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Recent Writing Samples
              </h2>
              <button
                className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
                onClick={analyzeWriting}
              >
                + New Sample →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Task
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Band
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Date
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Words
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode
                      ? 'divide-gray-700 bg-gray-800'
                      : 'divide-gray-200 bg-white'
                  }`}
                >
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
          </div>

          {/* AI Tools Section */}
          <AIToolsSection
            analyzeWriting={analyzeWriting}
            startSpeakingPractice={startSpeakingPractice}
            darkMode={darkMode}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Quick Actions
            </h2>
            <div className="space-y-3">
              <QuickActionButton
                icon="fas fa-clock text-yellow-600"
                color="#d97706"
                label="Take Mock Test"
                onClick={startMockTest}
                darkMode={darkMode}
              />
              <QuickActionButton
                icon="fas fa-microphone-alt text-purple-600"
                color="#8b5cf6"
                label="Speaking Practice"
                onClick={startSpeakingPractice}
                darkMode={darkMode}
              />
              <QuickActionButton
                icon="fas fa-edit text-blue-600"
                color="#3b82f6"
                label="Analyze Writing"
                onClick={analyzeWriting}
                darkMode={darkMode}
              />
              <QuickActionButton
                icon="fas fa-book text-green-600"
                color="#10b981"
                label="Vocabulary Builder"
                onClick={() => navigateTo('/vocabulary')}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Flashcards */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Flashcards
            </h2>
            <div className="space-y-3">
              <Flashcard
                icon="fas fa-book-open text-yellow-600"
                color="#d97706"
                label="Vocabulary Review"
                onClick={() => navigateTo('/flashcards/vocabulary')}
                darkMode={darkMode}
              />
              <Flashcard
                icon="fas fa-pen-fancy text-purple-600"
                color="#8b5cf6"
                label="Writing Phrases"
                onClick={() => navigateTo('/flashcards/writing')}
                darkMode={darkMode}
              />
              <Flashcard
                icon="fas fa-headphones text-blue-600"
                color="#3b82f6"
                label="Listening Practice"
                onClick={() => navigateTo('/flashcards/listening')}
                darkMode={darkMode}
              />
              <Flashcard
                icon="fas fa-comment-alt text-green-600"
                color="#10b981"
                label="Speaking Prompts"
                onClick={() => navigateTo('/flashcards/speaking')}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
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
          </div>

          {/* Target Band */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
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
                    stroke="#e2e8f0"
                    strokeWidth="2"
                  ></circle>
                  <circle
                    id="overall-progress"
                    className="progress-ring__circle"
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  ></circle>
                  <circle
                    id="target-progress"
                    className="progress-ring__circle"
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  ></circle>
                  <text
                    x="18"
                    y="18"
                    textAnchor="middle"
                    fontSize="12"
                    fill={darkMode ? '#f9fafb' : '#1f2937'}
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
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Your Target Band
                </label>
                <select
                  id="targetBand"
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
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
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                You're{' '}
                {(
                  (userProgress.overall / userProgress.targetBand) *
                  100
                ).toFixed(0)}
                % to your target
              </div>
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium">
                Update Goal
              </button>
            </div>
          </div>

          {/* Community Section */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
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
                className={`w-full mt-4 font-medium text-sm ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}
                onClick={() => navigateTo('/community')}
              >
                View all discussions →
              </button>
            </div>
          </div>

          {/* Mock Test History */}
          <div
            className={`rounded-xl shadow-sm p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Mock Test History
            </h2>
            <div className="space-y-3">
              {mockTests.map((test) => (
                <MockTestItem key={test.id} test={test} darkMode={darkMode} />
              ))}
              <button
                className={`w-full mt-2 font-medium text-sm ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}
                onClick={() => navigateTo('/mock-tests')}
              >
                View full history →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
