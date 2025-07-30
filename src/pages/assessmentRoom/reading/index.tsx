'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/home/LoginModal';

interface ReadingTest {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration_minutes: number;
  question_count: number;
  description: string;
  created_at: string;
  completed: boolean;
  best_score?: number;
  last_progress?: {
    answers: Record<string, string>;
    time_spent: number;
  };
}

export default function ReadingAssessmentRoom() {
  const router = useRouter();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [tests, setTests] = useState<ReadingTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const { data: testsData, error } = await supabase
          .from('reading_papers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (user) {
          const { data: userProgress } = await supabase
            .from('user_reading_progress')
            .select('test_id, completed, score, answers, time_spent')
            .eq('user_id', user.id);

          const testsWithProgress = testsData.map((test) => {
            const progress = userProgress?.find((p) => p.test_id === test.id);
            return {
              ...test,
              completed: progress?.completed || false,
              best_score: progress?.score,
              last_progress: progress?.answers ? {
                answers: progress.answers,
                time_spent: progress.time_spent || 0
              } : undefined,
            };
          });
          setTests(testsWithProgress);
        } else {
          setTests(
            testsData.map((test) => ({
              ...test,
              completed: false,
              best_score: undefined,
              last_progress: undefined,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user]);

  // Save progress when leaving a test
  useEffect(() => {
    const saveProgressOnLeave = async () => {
      if (router.pathname.includes('/assessmentRoom/reading/') && user) {
        // This would be called from the actual test page, but we'll set up the listener here
        const handleBeforeUnload = async () => {
          // This assumes we have access to current test state
          // In a real implementation, this would be in the test page component
          const currentTestId = router.query.testId;
          const currentAnswers = JSON.parse(sessionStorage.getItem(`test_${currentTestId}_answers`) || '{}');
          const timeSpent = Number(sessionStorage.getItem(`test_${currentTestId}_time`) || 0);

          if (currentTestId && Object.keys(currentAnswers).length > 0) {
            await supabase
              .from('user_reading_progress')
              .upsert({
                user_id: user.id,
                test_id: currentTestId,
                completed: false,
                answers: currentAnswers,
                time_spent: timeSpent,
                updated_at: new Date().toISOString(),
              });
          }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };

    saveProgressOnLeave();
  }, [router, user]);

  const handleProtectedClick = (route: string) => {
    setCurrentPage(route);
    if (!user) {
      sessionStorage.setItem('redirectUrl', route);
      setShowLoginModal(true);
    } else {
      router.push(route);
    }
  };

  const startTest = (testId: string) => {
    const route = `/assessmentRoom/reading/${testId}`;
    if (user) {
      router.push(route);
    } else {
      setCurrentPage(route);
      sessionStorage.setItem('redirectUrl', route);
      setShowLoginModal(true);
    }
  };

  const resumeTest = (testId: string) => {
    const route = `/assessmentRoom/reading/${testId}?resume=true`;
    if (user) {
      router.push(route);
    } else {
      setCurrentPage(route);
      sessionStorage.setItem('redirectUrl', route);
      setShowLoginModal(true);
    }
  };

  const filteredTests = tests.filter((test) => {
    if (!user) return activeTab === 'all' || activeTab === 'incomplete';
    return (
      activeTab === 'all' ||
      (activeTab === 'completed' && test.completed) ||
      (activeTab === 'incomplete' && !test.completed)
    );
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedTests = filteredTests.filter(test => test.completed);
  const incompleteTests = filteredTests.filter(test => !test.completed && !test.last_progress);
  const inProgressTests = filteredTests.filter(test => !test.completed && test.last_progress);

  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      <Head>
        <title>Reading Practice - IELTS Master</title>
        <meta name="description" content="Practice IELTS reading tests with authentic passages" />
      </Head>

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Reading Practice
            </h1>
            <p className="text-xl text-foreground/80 mb-8">
              Improve your reading skills with authentic IELTS passages and questions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => handleProtectedClick('/assessmentRoom/reading/new')}
              >
                <i className="fas fa-book-open mr-2"></i> Start New Test
              </button>
              <button
                className="bg-card hover:bg-card-hover text-primary border border-primary px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => router.push('/strategies/reading')}
              >
                <i className="fas fa-lightbulb mr-2"></i> Reading Strategies
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-foreground">Available Tests</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === 'all' ? 'bg-primary text-white' : 'bg-card-hover text-foreground/80 hover:bg-accent'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Tests
              </button>
              {user && (
                <>
                  <button
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      activeTab === 'completed' ? 'bg-primary text-white' : 'bg-card-hover text-foreground/80 hover:bg-accent'
                    }`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                      activeTab === 'incomplete' ? 'bg-primary text-white' : 'bg-card-hover text-foreground/80 hover:bg-accent'
                    }`}
                    onClick={() => setActiveTab('incomplete')}
                  >
                    Incomplete
                  </button>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="bg-card border border-border rounded-xl shadow-sm p-8 text-center">
              <i className="fas fa-book-open text-4xl text-foreground/30 mb-4"></i>
              <h3 className="text-xl font-semibold text-foreground">No tests found</h3>
              <p className="text-foreground/60 mb-4">
                {activeTab === 'all'
                  ? 'There are currently no reading tests available.'
                  : 'No tests match your current filters.'}
              </p>
              <button
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium"
                onClick={() => handleProtectedClick('/assessmentRoom/reading/new')}
              >
                <i className="fas fa-book-open mr-2"></i> Start New Test
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {inProgressTests.length > 0 && (activeTab === 'all' || activeTab === 'incomplete') && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">In Progress Tests</h3>
                  <div className="space-y-4">
                    {inProgressTests.map((test) => (
                      <div
                        key={test.id}
                        className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-semibold text-foreground">{test.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                                {test.difficulty}
                              </span>
                            </div>
                            <p className="text-foreground/80 text-sm mb-2">{test.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mb-2">
                              <span><i className="far fa-clock mr-1"></i>{test.duration_minutes} mins</span>
                              <span><i className="far fa-question-circle mr-1"></i>{test.question_count} questions</span>
                              {test.last_progress && (
                                <span><i className="fas fa-hourglass-half mr-1"></i>
                                  {Math.round(test.last_progress.time_spent / 60)} mins spent
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => resumeTest(test.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 w-full sm:w-auto"
                          >
                            <i className="fas fa-play-circle mr-2"></i> Resume Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {incompleteTests.length > 0 && (activeTab === 'all' || activeTab === 'incomplete') && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Not Started Tests</h3>
                  <div className="space-y-4">
                    {incompleteTests.map((test) => (
                      <div
                        key={test.id}
                        className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-semibold text-foreground">{test.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                                {test.difficulty}
                              </span>
                            </div>
                            <p className="text-foreground/80 text-sm mb-2">{test.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mb-2">
                              <span><i className="far fa-clock mr-1"></i>{test.duration_minutes} mins</span>
                              <span><i className="far fa-question-circle mr-1"></i>{test.question_count} questions</span>
                            </div>
                          </div>
                          <button
                            onClick={() => startTest(test.id)}
                            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 w-full sm:w-auto"
                          >
                            <i className="fas fa-play mr-2"></i> Start Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedTests.length > 0 && (activeTab === 'all' || activeTab === 'completed') && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Completed Tests</h3>
                  <div className="space-y-4">
                    {completedTests.map((test) => (
                      <div
                        key={test.id}
                        className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-semibold text-foreground">{test.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                                {test.difficulty}
                              </span>
                            </div>
                            <p className="text-foreground/80 text-sm mb-2">{test.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mb-2">
                              <span><i className="far fa-clock mr-1"></i>{test.duration_minutes} mins</span>
                              <span><i className="far fa-question-circle mr-1"></i>{test.question_count} questions</span>
                            </div>
                            {test.best_score !== undefined && (
                              <div className="mt-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="font-medium text-foreground">Your Best Score:</span>
                                  <span className="font-bold text-foreground">{test.best_score}/40</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${(test.best_score / 40) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => startTest(test.id)}
                            className="bg-card-hover text-primary hover:bg-accent py-2 px-4 rounded-md font-medium transition-colors duration-200 w-full sm:w-auto"
                          >
                            <i className="fas fa-redo mr-2"></i> Retake Test
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-card/50 p-6 rounded-xl border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Reading Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-search text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Skimming & Scanning</h3>
                  <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-sm">
                    <li>Skim first for main ideas (1-2 minutes per passage)</li>
                    <li>Scan for specific information when answering questions</li>
                    <li>Highlight keywords in both questions and text</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-clock text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Time Management</h3>
                  <p className="text-foreground/80 text-sm">
                    Allocate 20 minutes per passage. Don't spend more than 1-1.5
                    minutes per question. If stuck, mark it and move on.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-3 text-foreground text-center">Sign In Required</h3>
            <p className="text-foreground/80 mb-4 text-center text-sm">
              Please sign in to access this practice test
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  router.push('/signup');
                }}
                className="bg-card hover:bg-card-hover text-primary border border-primary py-2 rounded-md font-medium text-sm"
              >
                Create Free Account
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  router.push('/login');
                }}
                className="bg-primary hover:bg-primary/90 text-white py-2 rounded-md font-medium text-sm"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}