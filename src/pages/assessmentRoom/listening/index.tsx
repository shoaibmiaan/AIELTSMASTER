'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/home/LoginModal';

interface ListeningTest {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration_minutes: number;
  question_count: number;
  description: string;
  created_at: string;
  completed: boolean;
  best_score?: number;
}

export default function ListeningAssessmentRoom() {
  const router = useRouter();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [tests, setTests] = useState<ListeningTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const { data: testsData, error } = await supabase
          .from('listening_tests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (user) {
          const { data: userProgress } = await supabase
            .from('user_listening_progress')
            .select('test_id, completed, score')
            .eq('user_id', user.id);

          const testsWithProgress = testsData.map((test) => {
            const progress = userProgress?.find((p) => p.test_id === test.id);
            return {
              ...test,
              completed: progress?.completed || false,
              best_score: progress?.score,
            };
          });
          setTests(testsWithProgress);
        } else {
          setTests(
            testsData.map((test) => ({
              ...test,
              completed: false,
              best_score: undefined,
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
    const route = `/assessmentRoom/listening/${testId}`;
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

  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      <Head>
        <title>Listening Practice - IELTS Master</title>
        <meta name="description" content="Practice IELTS listening tests with authentic recordings" />
      </Head>

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Listening Practice
            </h1>
            <p className="text-xl text-foreground/80 mb-8">
              Improve your listening skills with authentic IELTS recordings and questions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => handleProtectedClick('/assessmentRoom/listening/new')}
              >
                <i className="fas fa-headphones mr-2"></i> Start New Test
              </button>
              <button
                className="bg-card hover:bg-card-hover text-primary border border-primary px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => router.push('/strategies/listening')}
              >
                <i className="fas fa-lightbulb mr-2"></i> Listening Strategies
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
              <i className="fas fa-headphones text-4xl text-foreground/30 mb-4"></i>
              <h3 className="text-xl font-semibold text-foreground">No tests found</h3>
              <p className="text-foreground/60 mb-4">
                {activeTab === 'all'
                  ? 'There are currently no listening tests available.'
                  : 'No tests match your current filters.'}
              </p>
              <button
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium"
                onClick={() => handleProtectedClick('/assessmentRoom/listening/new')}
              >
                <i className="fas fa-headphones mr-2"></i> Start New Test
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {test.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}
                      >
                        {test.difficulty}
                      </span>
                    </div>
                    <p className="text-foreground/80 text-sm mb-4 line-clamp-2">
                      {test.description}
                    </p>
                    <div className="flex justify-between text-sm text-foreground/60 mb-4">
                      <span>
                        <i className="far fa-clock mr-1"></i>
                        {test.duration_minutes} mins
                      </span>
                      <span>
                        <i className="far fa-question-circle mr-1"></i>
                        {test.question_count} questions
                      </span>
                    </div>
                    {test.completed && test.best_score !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">
                            Your Best Score:
                          </span>
                          <span className="font-bold text-foreground">
                            {test.best_score}/40
                          </span>
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
                    className={`w-full py-3 px-4 font-medium transition-colors duration-200 ${
                      test.completed
                        ? 'bg-card-hover text-primary hover:bg-accent'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {test.completed ? (
                      <><i className="fas fa-redo mr-2"></i> Retake Test</>
                    ) : (
                      <><i className="fas fa-play mr-2"></i> Start Test</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card/50 p-6 rounded-xl border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Listening Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-lightbulb text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Effective Techniques</h3>
                  <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-sm">
                    <li>Practice with diverse English accents</li>
                    <li>Predict answers before hearing the audio</li>
                    <li>Take efficient notes during recordings</li>
                    <li>Focus on keywords and synonyms</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-chart-line text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Progress Tracking</h3>
                  <p className="text-foreground/80 text-sm">
                    Monitor your scores to identify weak areas and focus on improving them consistently.
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