'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTheme } from '@/context/ThemeContext';

export default function PracticePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [practiceHistory, setPracticeHistory] = useState([
    { id: 1, type: 'Writing', task: 'Task 2: Opinion Essay', date: '2023-06-15', score: 6.5 },
    { id: 2, type: 'Reading', task: 'Passage 3: Scientific Research', date: '2023-06-12', score: 7.0 },
    { id: 3, type: 'Listening', task: 'Section 4: Lecture', date: '2023-06-10', score: 7.5 },
    { id: 4, type: 'Speaking', task: 'Part 2: Describe an Event', date: '2023-06-08', score: 6.0 },
  ]);

  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    const savedPremium = localStorage.getItem('isPremium');

    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }

    if (savedPremium === 'true') {
      setIsPremium(true);
    }
  }, []);

  const handleNavigation = (route: string) => {
    if (route.startsWith('http')) {
      window.open(route, '_blank');
      return;
    }

    if (route === '/logout') {
      handleLogout();
      return;
    }

    router.push(route);
  };

  const handleProtectedClick = (route: string) => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin !== 'true' || !isLoggedIn) {
      setCurrentPage(route);
      setShowLoginModal(true);
    } else {
      router.push(route);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setShowLoginModal(false);
    if (currentPage) {
      router.push(currentPage);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsPremium(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isPremium');
    router.push('/');
  };

  const handleFreePlan = () => {
    setIsLoggedIn(true);
    setIsPremium(false);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isPremium', 'false');
    setShowLoginModal(false);
    if (currentPage) {
      router.push(currentPage);
    }
  };

  const startPractice = (type: string) => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (isLoggedIn || savedLogin === 'true') {
      router.push(`/assessmentRoom/${type.toLowerCase()}`);
    } else {
      setCurrentPage(`/assessmentRoom/${type.toLowerCase()}`);
      setShowLoginModal(true);
    }
  };

  const filteredHistory = activeTab === 'all'
    ? practiceHistory
    : practiceHistory.filter(item => item.type.toLowerCase() === activeTab);

  return (
    <div className={`font-sans bg-background text-foreground min-h-screen transition-colors duration-300`}>
      <Head>
        <title>Practice - IELTS Master</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              IELTS Practice Center
            </h1>
            <p className="text-xl text-foreground/80 mb-8">
              Practice all four modules with authentic IELTS questions and get AI-powered feedback
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isPremium && (
                <button
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                  onClick={() => startPractice('full-test')}
                >
                  <i className="fas fa-stopwatch mr-2"></i> Take Full Mock Test
                </button>
              )}
              <button
                className="bg-card hover:bg-card-hover text-primary border border-primary px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => router.push('/strategies')}
              >
                <i className="fas fa-lightbulb mr-2"></i> View Strategies
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Practice Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: 'Listening',
                icon: 'headphones',
                color: 'light-blue',
                description: 'Practice with authentic recordings and questions from all sections.'
              },
              {
                type: 'Reading',
                icon: 'book-open',
                color: 'dark-spring-green',
                description: 'Work on passages from academic journals, magazines, and newspapers.'
              },
              {
                type: 'Writing',
                icon: 'edit',
                color: 'paynes-gray',
                description: 'Get AI feedback on Task 1 reports and Task 2 essays with band score predictions.'
              },
              {
                type: 'Speaking',
                icon: 'microphone-alt',
                color: 'ghost-white',
                description: 'Practice with AI examiners and get feedback on fluency, pronunciation, and vocabulary.'
              }
            ].map((module) => (
              <div
                key={module.type}
                className="bg-card border border-border rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-${module.color}-100 dark:bg-${module.color}-800 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                  <i className={`fas fa-${module.icon} text-${module.color}-600 dark:text-${module.color}-400 text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground text-center">{module.type}</h3>
                <p className="text-foreground/80 mb-4 text-center">{module.description}</p>
                <button
                  onClick={() => startPractice(module.type.toLowerCase())}
                  className={`w-full bg-${module.color}-600 hover:bg-${module.color}-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center`}
                >
                  <i className="fas fa-play mr-2"></i> Start Practice
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Rest of the sections remain the same as in your original code */}
        {/* Practice History, Quick Practice Sessions, Tips & Strategies sections */}

      </main>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border p-8 rounded-lg max-w-md w-full shadow-xl animate-fade-in">
            {/* Login Modal content */}
          </div>
        </div>
      )}

      <style jsx global>{`
        html {
          transition: background-color 0.3s ease;
        }
        body {
          transition: background-color 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}