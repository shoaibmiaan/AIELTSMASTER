'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Components
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import TargetBand from '@/components/TargetBand';
import ProgressChart from '@/components/ProgressChart';
import PerformanceChart from '@/components/PerformanceChart';
import ProgressBar from '@/components/ProgressBar';
import StudyStreak from '@/components/StudyStreak';
import Flashcard from '@/components/Flashcard';
import ThemeToggle from '@/components/ThemeToggle';
import ParticlesBackground from '@/components/ParticlesBackground';

// Icons
import {
  BookOpenIcon,
  MicrophoneIcon,
  PencilIcon,
  ClockIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UsersIcon,
  SparklesIcon,
  ArrowPathIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState({
    writing: 0,
    listening: 0,
    speaking: 0,
    reading: 0,
    overall: 6.0,
    targetBand: 7.5,
    streak: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Simulate API calls
        const progress = await fetchUserProgress();
        const activities = await fetchRecentActivities();
        const tests = await fetchMockTests();
        const plan = await fetchStudyPlan();

        setUserProgress(progress);
        setRecentActivities(activities);
        setMockTests(tests);
        setStudyPlan(plan);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Mock data functions
  const fetchUserProgress = async () => {
    return {
      writing: 65,
      listening: 45,
      speaking: 30,
      reading: 70,
      overall: 6.5,
      targetBand: 7.5,
      streak: user?.streak || 7,
    };
  };

  const fetchRecentActivities = async () => {
    return [
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
    ];
  };

  const fetchMockTests = async () => {
    return [
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
    ];
  };

  const fetchStudyPlan = async () => {
    return [
      {
        id: 1,
        title: 'Complex Sentences',
        module: 'Writing',
        duration: '25 min',
        progress: 65,
        locked: false,
      },
      {
        id: 2,
        title: 'Map Labelling',
        module: 'Listening',
        duration: '35 min',
        progress: 45,
        locked: false,
      },
      {
        id: 3,
        title: 'Part 3 Strategies',
        module: 'Speaking',
        duration: '45 min',
        progress: 30,
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
    ];
  };

  const updateTargetBand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTarget = parseFloat(e.target.value);
    setUserProgress({
      ...userProgress,
      targetBand: newTarget,
    });
    toast.success(`Target band updated to ${newTarget}`);
  };

  const startMockTest = () => {
    router.push('/mock-test/start');
  };

  const analyzeWriting = () => {
    router.push('/writing-evaluator');
  };

  const startSpeakingPractice = () => {
    router.push('/speaking-simulator');
  };

  const continueLesson = (id: number) => {
    router.push(`/lessons/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-dye-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <ParticlesBackground />
      <Header />

      <div className="container mx-auto px-4 py-6">
        <Breadcrumb userId={user?.id} />

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-dye-600 to-indigo-dye-800 rounded-2xl p-6 md:p-8 mb-8 text-lavender-blush-100 shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.name || user?.email?.split('@')[0]}!
              </h1>
              <p className="mb-4 opacity-90">
                {userProgress.streak >= 7
                  ? `Great job! Keep up your ${userProgress.streak}-day streak!`
                  : `Keep up your ${userProgress.streak}-day streak! Practice today to maintain it.`}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={startMockTest}
                  className="bg-lavender-blush-100 hover:bg-lavender-blush-200 text-indigo-dye-800 px-4 py-2 rounded-md font-semibold transition-colors"
                >
                  Take Mock Test
                </button>
                <button
                  onClick={() => router.push('/courses')}
                  className="bg-indigo-dye-700 hover:bg-indigo-dye-800 text-lavender-blush-100 px-4 py-2 rounded-md font-semibold transition-colors"
                >
                  Continue Learning
                </button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{userProgress.streak}</div>
                <div className="text-sm opacity-80">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{userProgress.overall}</div>
                <div className="text-sm opacity-80">Current Band</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-lavender-blush-100 dark:bg-slate-gray-800 rounded-2xl shadow-sm p-6 border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-indigo-dye-900 dark:text-lavender-blush-100">
                  Your Progress Overview
                </h2>
                <button
                  onClick={() => router.push('/progress')}
                  className="text-sm font-semibold text-persian-red-600 dark:text-peach-400 hover:underline"
                >
                  View Details →
                </button>
              </div>

              <PerformanceChart />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {['writing', 'listening', 'speaking', 'reading'].map((skill) => (
                  <div key={skill} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke={theme === 'dark' ? '#6b818c' : '#eee5e9'}
                          strokeWidth="2"
                        />
                        <circle
                          className="progress-ring__circle transition-all duration-300"
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke={
                            skill === 'writing' ? '#cc2936' :
                            skill === 'listening' ? '#08415c' :
                            skill === 'speaking' ? '#f1bf98' : '#6b818c'
                          }
                          strokeWidth="2"
                          strokeDasharray={`${userProgress[skill]} 100`}
                        />
                        <text
                          x="18"
                          y="20"
                          textAnchor="middle"
                          fontSize="10"
                          fill={theme === 'dark' ? '#eee5e9' : '#08415c'}
                          className="font-medium"
                        >
                          {userProgress[skill]}%
                        </text>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-sm text-indigo-dye-900 dark:text-lavender-blush-100">
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}
                    </h3>
                    <p className="text-xs text-slate-gray-500 dark:text-slate-gray-400">
                      Band {skill === 'writing' ? userProgress.overall - 0.5 :
                           skill === 'listening' ? userProgress.overall + 0.5 :
                           skill === 'speaking' ? userProgress.overall :
                           userProgress.overall + 0.5}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Study Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-lavender-blush-100 dark:bg-slate-gray-800 rounded-2xl shadow-sm p-6 border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-indigo-dye-900 dark:text-lavender-blush-100">
                  Your Study Plan
                </h2>
                <button
                  onClick={() => router.push('/courses')}
                  className="text-sm font-semibold text-persian-red-600 dark:text-peach-400 hover:underline"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {studyPlan.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border border-border transition-all duration-300 hover:shadow-md ${
                      lesson.locked ? 'opacity-75' : 'cursor-pointer hover:bg-peach-50 dark:hover:bg-slate-gray-700'
                    }`}
                    onClick={() => !lesson.locked && continueLesson(lesson.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-semibold text-sm ${
                          lesson.locked ? 'text-slate-gray-500 dark:text-slate-gray-400' :
                          'text-indigo-dye-900 dark:text-lavender-blush-100'
                        }`}>
                          {lesson.title}
                          {lesson.locked && (
                            <span className="ml-2 text-xs px-2 py-1 rounded bg-lavender-blush-200 dark:bg-slate-gray-700 text-slate-gray-600 dark:text-slate-gray-300">
                              Locked
                            </span>
                          )}
                        </h3>
                        <p className="text-xs mt-1 text-slate-gray-500 dark:text-slate-gray-400">
                          {lesson.module} • {lesson.duration}
                        </p>
                      </div>
                      {!lesson.locked && (
                        <button
                          className={`text-sm font-medium px-3 py-1 rounded hover:bg-persian-red-100 ${
                            theme === 'dark' ? 'text-peach-400' : 'text-persian-red-600'
                          }`}
                        >
                          {lesson.progress > 0 ? 'Continue' : 'Start'}
                        </button>
                      )}
                    </div>
                    {lesson.progress > 0 && (
                      <div className="mt-3">
                        <div className={`w-full rounded-full h-2 ${
                          theme === 'dark' ? 'bg-slate-gray-700' : 'bg-lavender-blush-200'
                        }`}>
                          <div
                            className={`h-2 rounded-full ${
                              lesson.module === 'Writing' ? 'bg-persian-red-500' :
                              lesson.module === 'Listening' ? 'bg-indigo-dye-500' :
                              lesson.module === 'Speaking' ? 'bg-peach-500' : 'bg-slate-gray-500'
                            }`}
                            style={{ width: `${lesson.progress}%` }}
                          />
                        </div>
                        <div className="text-right text-xs mt-1 text-slate-gray-500 dark:text-slate-gray-400">
                          {lesson.progress}% complete
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-lavender-blush-100 dark:bg-slate-gray-800 rounded-2xl shadow-sm p-6 border border-border"
            >
              <h2 className="text-xl font-bold mb-6 text-indigo-dye-900 dark:text-lavender-blush-100">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={startMockTest}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-peach-50 dark:hover:bg-slate-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-dye-500/10 flex items-center justify-center mr-4">
                      <ClockIcon className="w-5 h-5 text-indigo-dye-600 dark:text-indigo-dye-400" />
                    </div>
                    <span className="font-semibold text-sm text-indigo-dye-900 dark:text-lavender-blush-100">
                      Take Mock Test
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-gray-400 dark:text-slate-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={analyzeWriting}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-peach-50 dark:hover:bg-slate-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-persian-red-500/10 flex items-center justify-center mr-4">
                      <PencilIcon className="w-5 h-5 text-persian-red-600 dark:text-persian-red-400" />
                    </div>
                    <span className="font-semibold text-sm text-indigo-dye-900 dark:text-lavender-blush-100">
                      Analyze Writing
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-gray-400 dark:text-slate-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={startSpeakingPractice}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-peach-50 dark:hover:bg-slate-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-peach-500/10 flex items-center justify-center mr-4">
                      <MicrophoneIcon className="w-5 h-5 text-peach-600 dark:text-peach-400" />
                    </div>
                    <span className="font-semibold text-sm text-indigo-dye-900 dark:text-lavender-blush-100">
                      Speaking Practice
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-gray-400 dark:text-slate-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => router.push('/vocabulary')}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-peach-50 dark:hover:bg-slate-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-gray-500/10 flex items-center justify-center mr-4">
                      <BookOpenIcon className="w-5 h-5 text-slate-gray-600 dark:text-slate-gray-400" />
                    </div>
                    <span className="font-semibold text-sm text-indigo-dye-900 dark:text-lavender-blush-100">
                      Vocabulary Builder
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-gray-400 dark:text-slate-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Target Band */}
            <TargetBand
              userProgress={userProgress}
              updateTargetBand={updateTargetBand}
              darkMode={theme === 'dark'}
            />

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-lavender-blush-100 dark:bg-slate-gray-800 rounded-2xl shadow-sm p-6 border border-border"
            >
              <h2 className="text-xl font-bold mb-6 text-indigo-dye-900 dark:text-lavender-blush-100">
                Recent Activity
              </h2>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      activity.type === 'writing' ? 'bg-persian-red-100 dark:bg-persian-red-900' :
                      activity.type === 'speaking' ? 'bg-peach-100 dark:bg-peach-900' :
                      'bg-indigo-dye-100 dark:bg-indigo-dye-900'
                    } ${
                      activity.type === 'writing' ? 'text-persian-red-600 dark:text-persian-red-400' :
                      activity.type === 'speaking' ? 'text-peach-600 dark:text-peach-400' :
                      'text-indigo-dye-600 dark:text-indigo-dye-400'
                    }`}>
                      {activity.type === 'writing' ? (
                        <PencilIcon className="w-5 h-5" />
                      ) : activity.type === 'speaking' ? (
                        <MicrophoneIcon className="w-5 h-5" />
                      ) : (
                        <AcademicCapIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-indigo-dye-900 dark:text-lavender-blush-100">
                        {activity.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.score >= 6.5 ? 'bg-peach-100 dark:bg-peach-900 text-peach-800 dark:text-peach-200' :
                          activity.score >= 5.5 ? 'bg-persian-red-100 dark:bg-persian-red-900 text-persian-red-800 dark:text-persian-red-200' :
                          'bg-indigo-dye-100 dark:bg-indigo-dye-900 text-indigo-dye-800 dark:text-indigo-dye-200'
                        }`}>
                          Band {activity.score}
                        </span>
                        <span className="mx-2 text-slate-gray-400 dark:text-slate-gray-600">•</span>
                        <span className="text-xs text-slate-gray-500 dark:text-slate-gray-400">
                          {activity.date}
                        </span>
                      </div>
                      <p className="text-xs mt-1 text-peach-600 dark:text-peach-400">
                        {activity.improvement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mock Test History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-lavender-blush-100 dark:bg-slate-gray-800 rounded-2xl shadow-sm p-6 border border-border"
            >
              <h2 className="text-xl font-bold mb-6 text-indigo-dye-900 dark:text-lavender-blush-100">
                Mock Test History
              </h2>

              <div className="space-y-3">
                {mockTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex justify-between items-center p-3 rounded-lg border border-border hover:bg-peach-50 dark:hover:bg-slate-gray-700 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-sm text-indigo-dye-900 dark:text-lavender-blush-100">
                        {test.type}
                      </h3>
                      <p className="text-xs text-slate-gray-500 dark:text-slate-gray-400">
                        {test.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        test.score >= 6.5 ? 'bg-peach-100 dark:bg-peach-900 text-peach-800 dark:text-peach-200' :
                        'bg-persian-red-100 dark:bg-persian-red-900 text-persian-red-800 dark:text-persian-red-200'
                      }`}>
                        Band {test.score}
                      </span>
                      <p className="text-xs mt-1 text-slate-gray-500 dark:text-slate-gray-400">
                        {test.timeSpent}
                      </p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => router.push('/mock-tests')}
                  className="w-full mt-2 font-semibold text-sm text-persian-red-600 dark:text-peach-400 hover:underline"
                >
                  View full history →
                </button>
              </div>
            </motion.div>

            {/* Community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-lavender-blush-100 dark:bg-slate-gray-800 rounded-2xl shadow-sm p-6 border border-border"
            >
              <h2 className="text-xl font-bold mb-6 text-indigo-dye-900 dark:text-lavender-blush-100">
                Community Discussions
              </h2>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border hover:bg-peach-50 dark:hover:bg-slate-gray-700 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-sm text-persian-red-600 dark:text-peach-400">
                    How to improve speaking fluency quickly?
                  </h3>
                  <div className="flex items-center mt-1 text-xs text-slate-gray-500 dark:text-slate-gray-400">
                    <span>Rajesh</span>
                    <span className="mx-2">•</span>
                    <span>2 hours ago</span>
                    <span className="ml-auto flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      42
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border hover:bg-peach-50 dark:hover:bg-slate-gray-700 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-sm text-persian-red-600 dark:text-peach-400">
                    Writing Task 2 sample answer review
                  </h3>
                  <div className="flex items-center mt-1 text-xs text-slate-gray-500 dark:text-slate-gray-400">
                    <span>Maria</span>
                    <span className="mx-2">•</span>
                    <span>5 hours ago</span>
                    <span className="ml-auto flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      18
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/community')}
                  className="w-full mt-2 font-semibold text-sm text-persian-red-600 dark:text-peach-400 hover:underline"
                >
                  View all discussions →
                </button>
              </div>
            </motion.div>

            {/* Premium CTA */}
            {!user?.isPremium && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-r from-peach-400 to-peach-500 rounded-2xl shadow-sm p-6 text-lavender-blush-100"
              >
                <h2 className="text-xl font-bold mb-2">Unlock Premium Features</h2>
                <p className="text-sm mb-4">
                  Get unlimited mock tests, detailed feedback, and personalized study plans.
                </p>
                <button
                  onClick={() => router.push('/premium')}
                  className="w-full bg-lavender-blush-100 hover:bg-lavender-blush-200 text-indigo-dye-800 py-2 rounded-md font-semibold transition-colors"
                >
                  Upgrade Now
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}