'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PracticePage() {
  const router = useRouter();
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

  // Manual route handling for each module
  const startPractice = (type: string) => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (isLoggedIn || savedLogin === 'true') {
      // Mapping module types to their respective routes manually
      switch (type) {
        case 'listening':
          router.push('/assessmentRoom/listening');
          break;
        case 'reading':
          router.push('/assessmentRoom/reading');
          break;
        case 'writing':
          router.push('/assessmentRoom/writing');
          break;
        case 'speaking':
          router.push('/assessmentRoom/speaking');
          break;
        case 'mini-test':
          router.push('/assessmentRoom/mini-test');
          break;
        case 'start-test':
          router.push('/assessmentRoom/start-test');
          break;
        default:
          console.log(`Unknown module: ${type}`);
      }
    } else {
      setCurrentPage(`/assessmentRoom/${type.toLowerCase()}`);
      setShowLoginModal(true);
    }
  };

  const filteredHistory = activeTab === 'all'
    ? practiceHistory
    : practiceHistory.filter(item => item.type.toLowerCase() === activeTab);

  return (
    <div className="font-sans bg-background text-foreground min-h-screen transition-colors duration-300">
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
          </div>
        </section>

        {/* Primary Focus: Four Main Modules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Practice Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Listening Module */}
            <div className="bg-card border border-border rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-headphones text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground text-center">Listening</h3>
              <p className="text-foreground/80 mb-4 text-center">
                Practice with authentic recordings and questions from all sections
              </p>
              <button
                onClick={() => startPractice('listening')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <i className="fas fa-play mr-2"></i> Start Practice
              </button>
            </div>

            {/* Reading Module */}
            <div className="bg-card border border-border rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-book-open text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground text-center">Reading</h3>
              <p className="text-foreground/80 mb-4 text-center">
                Work on passages from academic journals, magazines, and newspapers
              </p>
              <button
                onClick={() => startPractice('reading')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <i className="fas fa-play mr-2"></i> Start Practice
              </button>
            </div>

            {/* Writing Module */}
            <div className="bg-card border border-border rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-edit text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground text-center">Writing</h3>
              <p className="text-foreground/80 mb-4 text-center">
                Get AI feedback on Task 1 reports and Task 2 essays with band score predictions
              </p>
              <button
                onClick={() => startPractice('writing')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <i className="fas fa-play mr-2"></i> Start Practice
              </button>
            </div>

            {/* Speaking Module */}
            <div className="bg-card border border-border rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <i className="fas fa-microphone-alt text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground text-center">Speaking</h3>
              <p className="text-foreground/80 mb-4 text-center">
                Practice with AI examiners and get feedback on fluency, pronunciation, and vocabulary
              </p>
              <button
                onClick={() => startPractice('speaking')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <i className="fas fa-play mr-2"></i> Start Practice
              </button>
            </div>
          </div>
        </section>

        {/* Secondary Features - Less Prominent */}
        <section className="mb-16 bg-card/50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground/80">Additional Practice Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Mini Test Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-hourglass-half text-amber-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Mini Test</h3>
              </div>
              <p className="text-foreground/80 mb-4 text-sm">
                Quick assessment covering all modules in a condensed format
              </p>
              <button
                onClick={() => startPractice('mini-test')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-md text-sm font-medium"
              >
                <i className="fas fa-bolt mr-2"></i> Start Mini Test
              </button>
            </div>

            {/* Full Test Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-trophy text-emerald-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Full Mock Test</h3>
              </div>
              <p className="text-foreground/80 mb-4 text-sm">
                Complete simulation of the real IELTS test experience
              </p>
              {isPremium ? (
                <button
                  onClick={() => startPractice('start-test')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md text-sm font-medium"
                >
                  <i className="fas fa-play mr-2"></i> Start Full Test
                </button>
              ) : (
                <button
                  onClick={() => handleProtectedClick('/assessmentRoom/start-test')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md text-sm font-medium"
                >
                  <i className="fas fa-crown mr-2"></i> Premium Feature
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Practice History - Collapsible Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setActiveTab(activeTab === 'history' ? 'all' : 'history')}>
            <h2 className="text-2xl font-bold text-foreground">Practice History</h2>
            <i className={`fas fa-chevron-${activeTab === 'history' ? 'up' : 'down'} text-foreground/60`}></i>
          </div>

          {activeTab === 'history' && (
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'listening', 'reading', 'writing', 'speaking'].map(tab => (
                  <button
                    key={tab}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activeTab === tab
                        ? 'bg-primary text-white'
                        : 'bg-card-hover text-foreground/80 hover:bg-accent'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 px-3 text-left text-xs text-foreground/80">Module</th>
                      <th className="py-2 px-3 text-left text-xs text-foreground/80">Task</th>
                      <th className="py-2 px-3 text-left text-xs text-foreground/80">Date</th>
                      <th className="py-2 px-3 text-left text-xs text-foreground/80">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map(item => (
                      <tr key={item.id} className="border-b border-border hover:bg-card-hover">
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'Listening' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'Reading' ? 'bg-green-100 text-green-800' :
                            item.type === 'Writing' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-foreground">{item.task}</td>
                        <td className="py-3 px-3 text-xs text-foreground/80">{item.date}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-sm text-foreground">{item.score}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredHistory.length === 0 && (
                <div className="text-center py-8">
                  <i className="fas fa-history text-2xl text-foreground/30 mb-3"></i>
                  <p className="text-foreground/60 text-sm">No practice history found</p>
                  <button
                    onClick={() => startPractice('listening')}
                    className="mt-3 bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-xs"
                  >
                    Start Practicing
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quick Practice Sessions - Simplified */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6 text-center text-foreground/80">Quick Practice Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => startPractice('listening')}
              className="bg-card border border-border hover:border-primary p-4 rounded-lg text-center transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-headphones text-blue-600"></i>
                </div>
                <span className="font-medium text-foreground">Listening Drill</span>
              </div>
              <p className="text-xs text-foreground/60 mb-2">15 min • Section 1 practice</p>
            </button>

            <button
              onClick={() => startPractice('writing')}
              className="bg-card border border-border hover:border-primary p-4 rounded-lg text-center transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-edit text-purple-600"></i>
                </div>
                <span className="font-medium text-foreground">Writing Challenge</span>
              </div>
              <p className="text-xs text-foreground/60 mb-2">40 min • Task 2 essay</p>
            </button>

            <button
              onClick={() => startPractice('speaking')}
              className="bg-card border border-border hover:border-primary p-4 rounded-lg text-center transition-colors"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-microphone-alt text-red-600"></i>
                </div>
                <span className="font-medium text-foreground">Speaking Practice</span>
              </div>
              <p className="text-xs text-foreground/60 mb-2">10 min • Part 1 questions</p>
            </button>
          </div>
        </section>

        {/* Upgrade Banner - Simplified */}
        <section className="mb-16 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-xl p-6 border border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-2 text-foreground">Unlock Full Potential with Premium</h2>
            <p className="text-sm text-foreground/80 mb-4">
              Get personalized feedback, detailed analytics, and unlimited practice
            </p>
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm">
              <i className="fas fa-crown mr-2"></i> Upgrade to Premium
            </button>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-3 text-foreground text-center">Sign In Required</h3>
            <p className="text-foreground/80 mb-4 text-center text-sm">
              Please sign in to access this practice module
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleFreePlan}
                className="bg-card hover:bg-card-hover text-primary border border-primary py-2 rounded-md font-medium text-sm"
              >
                Continue with Free Account
              </button>
              <button
                onClick={handleLogin}
                className="bg-primary hover:bg-primary/90 text-white py-2 rounded-md font-medium text-sm"
              >
                Sign In with Premium Account
              </button>
            </div>
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
      `}</style>
    </div>
  );
}