'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/home/LoginModal';

interface WritingTask {
  id: string;
  title: string;
  task_type: 'Task 1' | 'Task 2';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  word_count: number;
  time_limit_minutes: number;
  description: string;
  created_at: string;
  completed: boolean;
  best_score?: number;
}

export default function WritingAssessmentRoom() {
  const router = useRouter();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data: tasksData, error } = await supabase
          .from('writing_tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (user) {
          const { data: userProgress } = await supabase
            .from('user_writing_progress')
            .select('task_id, completed, score')
            .eq('user_id', user.id);

          const tasksWithProgress = tasksData.map((task) => {
            const progress = userProgress?.find((p) => p.task_id === task.id);
            return {
              ...task,
              completed: progress?.completed || false,
              best_score: progress?.score,
            };
          });
          setTasks(tasksWithProgress);
        } else {
          setTasks(
            tasksData.map((task) => ({
              ...task,
              completed: false,
              best_score: undefined,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
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

  const startTask = (taskId: string) => {
    const route = `/assessmentRoom/writing/${taskId}`;
    if (user) {
      router.push(route);
    } else {
      setCurrentPage(route);
      sessionStorage.setItem('redirectUrl', route);
      setShowLoginModal(true);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (!user) return activeTab === 'all' || activeTab === 'incomplete';
    return (
      activeTab === 'all' ||
      (activeTab === 'completed' && task.completed) ||
      (activeTab === 'incomplete' && !task.completed)
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
        <title>Writing Practice - IELTS Master</title>
        <meta name="description" content="Practice IELTS writing tasks with authentic prompts" />
      </Head>

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Writing Practice
            </h1>
            <p className="text-xl text-foreground/80 mb-8">
              Develop your writing skills with authentic IELTS tasks and feedback
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => handleProtectedClick('/assessmentRoom/writing/new')}
              >
                <i className="fas fa-pen mr-2"></i> Start New Task
              </button>
              <button
                className="bg-card hover:bg-card-hover text-primary border border-primary px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => router.push('/strategies/writing')}
              >
                <i className="fas fa-lightbulb mr-2"></i> Writing Strategies
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-foreground">Available Tasks</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === 'all' ? 'bg-primary text-white' : 'bg-card-hover text-foreground/80 hover:bg-accent'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Tasks
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
          ) : filteredTasks.length === 0 ? (
            <div className="bg-card border border-border rounded-xl shadow-sm p-8 text-center">
              <i className="fas fa-pen text-4xl text-foreground/30 mb-4"></i>
              <h3 className="text-xl font-semibold text-foreground">No tasks found</h3>
              <p className="text-foreground/60 mb-4">
                {activeTab === 'all'
                  ? 'There are currently no writing tasks available.'
                  : 'No tasks match your current filters.'}
              </p>
              <button
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium"
                onClick={() => handleProtectedClick('/assessmentRoom/writing/new')}
              >
                <i className="fas fa-pen mr-2"></i> Start New Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(task.difficulty)}`}
                      >
                        {task.difficulty}
                      </span>
                    </div>
                    <p className="text-foreground/80 text-sm mb-4 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex justify-between text-sm text-foreground/60 mb-4">
                      <span>
                        <i className="far fa-clock mr-1"></i>
                        {task.time_limit_minutes} mins
                      </span>
                      <span>
                        <i className="fas fa-pen mr-1"></i>
                        {task.word_count} words
                      </span>
                    </div>
                    {task.completed && task.best_score !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">
                            Your Best Score:
                          </span>
                          <span className="font-bold text-foreground">
                            {task.best_score}/9
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(task.best_score / 9) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => startTask(task.id)}
                    className={`w-full py-3 px-4 font-medium transition-colors duration-200 ${
                      task.completed
                        ? 'bg-card-hover text-primary hover:bg-accent'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {task.completed ? (
                      <><i className="fas fa-redo mr-2"></i> Retake Task</>
                    ) : (
                      <><i className="fas fa-play mr-2"></i> Start Task</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card/50 p-6 rounded-xl border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Writing Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-pen text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Essay Structure</h3>
                  <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-sm">
                    <li>Plan with clear introduction, body, and conclusion</li>
                    <li>Use topic sentences to start each paragraph</li>
                    <li>Support arguments with relevant examples</li>
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
                    Allocate 20 minutes for Task 1 and 40 minutes for Task 2.
                    Spend 5-7 minutes planning before writing.
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
              Please sign in to access this practice task
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