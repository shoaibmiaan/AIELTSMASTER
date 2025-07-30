'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import FocusedLayout from '@/layouts/FocusedLayout';
import ReadingPassagePane from '@/components/reading/ReadingPassagePane';
import ReadingQuestionPane from '@/components/reading/ReadingQuestionPane';
import QuestionNavigator from '@/components/reading/QuestionNavigator';
import ReadingTimer from '@/components/reading/ReadingTimer';
import ReviewPanel from '@/components/reading/ReviewPanel';
import { logStudyActivity } from '@/lib/logging';
import { ThemeProvider } from '@/components/themeProvider';

interface ReadingQuestion {
  id: string;
  question_number: number;
  question_type: string;
  text: string;
  options: string[];
  answer: string;
  instruction?: string;
}

interface ReadingPassage {
  id: string;
  passage_number: number;
  title: string;
  body: string;
  section_instruction: string;
  reading_questions: ReadingQuestion[];
}

interface ReadingTest {
  id: string;
  title: string;
  reading_passages: ReadingPassage[];
}

export default function ReadingTestPage() {
  const router = useRouter();
  const { testId } = router.query;
  const containerRef = useRef<HTMLDivElement>(null);

  const [test, setTest] = useState<ReadingTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const goFullScreen = useCallback(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.error('Failed to enter fullscreen:', err);
      });
    }
  }, []);

  useEffect(() => {
    if (!testId) return;
    setLoading(true);
    setLoadError(null);

    const loadTest = async () => {
      try {
        const { data, error } = await supabase
          .from('reading_papers')
          .select(`
            id,
            title,
            reading_passages (
              id,
              passage_number,
              title,
              body,
              section_instruction,
              reading_questions (
                id,
                question_number,
                question_type,
                text,
                options,
                answer,
                instruction
              )
            )
          `)
          .eq('id', testId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Test not found');

        setTest(data as ReadingTest);
      } catch (error: any) {
        console.error('Error loading test:', error);
        setLoadError(error.message || 'Failed to load test');
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [testId]);

  useEffect(() => {
    if (testId && testStarted) {
      const savedTime = sessionStorage.getItem(`readingTestTime_${testId}`);
      if (savedTime) {
        setTimeLeft(parseInt(savedTime, 10));
      }
    }
  }, [testId, testStarted]);

  useEffect(() => {
    if (!testStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        const newTime = t - 1;
        if (testId) {
          sessionStorage.setItem(`readingTestTime_${testId}`, newTime.toString());
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, testId]);

  useEffect(() => {
    if (timeLeft === 0 && testStarted) {
      handleSubmit();
    }
  }, [timeLeft, testStarted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleAnswer = useCallback((qnId: string, value: string | string[]) => {
    setAnswers(a => ({ ...a, [qnId]: value }));
  }, []);

  const handleFlag = useCallback((qnId: string) => {
    setFlags(f => ({ ...f, [qnId]: !f[qnId] }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!test) throw new Error('Test data not loaded');

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Sign in required to submit');

      const { error } = await supabase.from('reading_attempts').insert({
        user_id: user.id,
        test_id: test.id,
        answers,
        flags,
        submitted_at: new Date().toISOString(),
      });

      if (error) throw error;

      logStudyActivity(user.id, 'Submitted Reading Test');
      setSubmitSuccess(true);
      sessionStorage.removeItem(`readingTestTime_${testId}`);
      setTimeout(() => {
        router.push(`/assessmentRoom/reading/result?testId=${test.id}`);
      }, 2000);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  }, [test, answers, flags, router, testId]);

  const mappedPassages = useMemo(() =>
    test?.reading_passages?.map(p => ({
      ...p,
      question_groups: [{
        group_number: 1,
        instruction: p.section_instruction || 'General Questions',
        questions: (p.reading_questions || []).map(q => ({
          ...q,
          id: q.id,
          question_number: q.question_number,
          question_type: q.question_type,
          text: q.text,
          options: q.options,
        })),
      }],
    })) || [], [test]);

  const allQuestions = useMemo(() =>
    mappedPassages
      .flatMap(p => p.question_groups.flatMap(g => g.questions))
      .sort((a, b) => (a.question_number ?? 0) - (b.question_number ?? 0)),
    [mappedPassages]
  );

  const handleJump = useCallback((qnId: string) => {
    const element = document.getElementById(`question-${qnId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, []);

  const startTest = useCallback(() => {
    setTestStarted(true);
    goFullScreen();
  }, [goFullScreen]);

  if (loadError) {
    return (
      <FocusedLayout>
        <div className="flex flex-col items-center justify-center h-screen p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-lg">
            <h2 className="font-bold text-xl mb-2">Error Loading Test</h2>
            <p className="mb-4">{loadError}</p>
            <button
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </FocusedLayout>
    );
  }

  if (loading || !test) {
    return (
      <FocusedLayout>
        <div className="flex flex-col items-center justify-center h-screen p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600">Loading test content...</p>
        </div>
      </FocusedLayout>
    );
  }

  if (!testStarted) {
    return (
      <FocusedLayout>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-blue-100">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
              IELTS Reading Test
            </h1>
            <h2 className="text-2xl font-semibold text-center mb-8">
              {test.title}
            </h2>

            <div className="mb-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-xl font-bold mb-4 text-blue-700">Test Instructions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have <strong>60 minutes</strong> to complete the test</li>
                <li>The test will automatically submit when time expires</li>
                <li>Answer all questions before submitting</li>
                <li>Use the flag feature to mark questions for review</li>
                <li>The test will open in fullscreen mode</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={startTest}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-2xl text-xl shadow-lg transition transform hover:scale-105"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </FocusedLayout>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div ref={containerRef} className="fixed inset-0 flex flex-col bg-white">
        <div className="w-full fixed top-0 left-0 z-40 bg-white border-b shadow-sm flex items-center justify-center py-3">
          <ReadingTimer timeLeft={timeLeft} />
          <button
            onClick={() => setShowReview(true)}
            className="absolute right-4 bg-blue-600 text-white px-4 py-1 rounded-lg"
          >
            Review
          </button>
        </div>

        {!isFullScreen && (
          <header className="bg-white shadow-md px-6 py-4 sticky top-12 z-10 border-b mt-2">
            <div className="text-3xl font-bold text-gray-900">{test.title}</div>
          </header>
        )}

        {!isFullScreen && (
          <button
            onClick={goFullScreen}
            className="fixed top-16 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Return to Full Screen
          </button>
        )}

        <div className="flex flex-col md:flex-row flex-1 mt-12 overflow-hidden">
          <div className="md:w-1/2 w-full h-full overflow-y-auto p-4 border-r">
            <ReadingPassagePane passages={test.reading_passages} />
          </div>

          <div className="md:w-1/2 w-full h-full flex flex-col">
            <div className="sticky top-0 z-30 bg-white p-2 border-b">
              <QuestionNavigator
                questions={allQuestions}
                answers={answers}
                flags={flags}
                onJump={handleJump}
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <ReadingQuestionPane
                passages={mappedPassages}
                answers={answers}
                flags={flags}
                onAnswerChange={handleAnswer}
                onFlag={handleFlag}
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowReview(true)}
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg text-lg transition disabled:opacity-50"
          >
            Submit Test
          </button>
        </div>

        {submitError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-800 border border-red-300 px-6 py-3 rounded-2xl shadow-lg z-50 font-bold text-lg">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 border border-green-300 px-6 py-3 rounded-2xl shadow-lg z-50 font-bold text-lg">
            Test submitted successfully! Redirecting...
          </div>
        )}

        {showReview && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-2xl border">
              <ReviewPanel
                questions={allQuestions}
                answers={answers}
                flags={flags}
                onJump={(qnId) => {
                  setShowReview(false);
                  setTimeout(() => handleJump(qnId), 100);
                }}
                onSubmit={handleSubmit}
                onSubmitAnyway={() => {
                  setShowReview(false);
                  handleSubmit();
                }}
              />
              <div className="flex justify-center mt-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
                  onClick={() => setShowReview(false)}
                >
                  Back to Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}