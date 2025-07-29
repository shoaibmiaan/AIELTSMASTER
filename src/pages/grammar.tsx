'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext'; // Keep this import
import { useTheme } from '@/components/ThemeProvider'; // Keep this import

export default function IELTSCoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const { user } = useAuth(); // from context
  const { theme } = useTheme(); // from context

  // UI State
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Course Data with safe initialization
  const [course, setCourse] = useState({
    id: courseId || '',
    title: 'Grammar Mastery for IELTS',
    description:
      'Master essential grammar rules to boost your writing and speaking scores',
    progress: user ? 45 : 0,
    totalLessons: 12,
    completedLessons: user ? 5 : 0,
    instructor: 'Dr. Sarah Johnson',
    rating: 4.8,
    enrolled: 12450,
    lastAccessed: user ? 'Complex Sentences' : null,
  });

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to IELTS Grammar',
      duration: '15 min',
      type: 'video',
      completed: true,
      locked: false,
      preview: false,
    },
    {
      id: 2,
      title: 'Sentence Structures',
      duration: '25 min',
      type: 'interactive',
      completed: true,
      locked: false,
      preview: false,
    },
    {
      id: 3,
      title: 'Complex Sentences',
      duration: '30 min',
      type: 'video',
      completed: user ? true : false,
      locked: !user,
      preview: true,
    },
    {
      id: 4,
      title: 'Conditional Sentences',
      duration: '35 min',
      type: 'interactive',
      completed: false,
      locked: !user,
      preview: false,
    },
  ]);

  const startLesson = (lessonId: number) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson && !lesson.locked) {
      router.push(`/courses/${courseId}/lessons/${lessonId}`);
    } else if (lesson?.locked) {
      toast.error('Please sign in to access this lesson');
      // You can choose to display a custom message or perform any other action here
    }
  };

  const enrollCourse = () => {
    if (!user) {
      // You can implement any other action when a user is not logged in
      toast.error('Please sign in to enroll');
    } else {
      toast.success('Successfully enrolled in course!');
      setLessons(lessons.map((l) => ({ ...l, locked: false })));
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">{course.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-light dark:bg-primary-dark text-primary rounded-full text-sm font-medium">
              Grammar Course
            </span>
            <span className="text-muted">
              {course.rating} ★ ({course.enrolled.toLocaleString()} students)
            </span>
          </div>

          <p className="text-lg text-muted mb-6">{course.description}</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <i className="fas fa-chalkboard-teacher text-primary"></i>
              <span className="text-muted">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-book-open text-primary"></i>
              <span className="text-muted">{course.totalLessons} lessons</span>
            </div>
          </div>

          {user ? (
            <div className="w-full bg-muted-light dark:bg-muted rounded-full h-4 mb-4">
              <div
                className="bg-primary h-4 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          ) : null}

          <div className="flex gap-4">
            {user ? (
              <>
                {course.lastAccessed && (
                  <button
                    onClick={() =>
                      startLesson(
                        lessons.find((l) => l.title === course.lastAccessed)
                          ?.id || 0
                      )
                    }
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg"
                  >
                    Continue Learning
                  </button>
                )}
                <button className="bg-card hover:bg-card-hover text-foreground px-6 py-2 rounded-lg border border-border">
                  Save for Later
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={enrollCourse}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg"
                >
                  Enroll for Free
                </button>
                <button
                  onClick={() => toast.error('Please sign in to preview the course')}
                  className="bg-card hover:bg-card-hover text-foreground px-6 py-2 rounded-lg border border-border"
                >
                  Preview Course
                </button>
              </>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
          <div className="overflow-hidden">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`border-b border-border last:border-0 ${lesson.locked ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center p-4 hover:bg-card-hover transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                    {lesson.completed ? (
                      <div className="w-full h-full rounded-full bg-success-light dark:bg-success-dark flex items-center justify-center">
                        <i className="fas fa-check text-success"></i>
                      </div>
                    ) : (
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center ${
                          lesson.locked
                            ? 'bg-muted-light dark:bg-muted'
                            : 'bg-primary-light dark:bg-primary-dark'
                        }`}
                      >
                        <i
                          className={`fas ${
                            lesson.locked
                              ? 'fa-lock text-muted'
                              : lesson.type === 'video'
                                ? 'fa-play text-primary'
                                : 'fa-mouse-pointer text-primary'
                          }`}
                        ></i>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3
                      className={`font-medium ${
                        lesson.locked ? 'text-muted' : 'text-foreground'
                      }`}
                    >
                      {index + 1}. {lesson.title}
                      {lesson.preview && !lesson.locked && (
                        <span className="ml-2 px-2 py-0.5 bg-primary-light dark:bg-primary-dark text-primary rounded-full text-xs">
                          Free Preview
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted">
                      {lesson.duration} •{' '}
                      {lesson.type === 'video'
                        ? 'Video Lesson'
                        : 'Interactive Exercise'}
                    </p>
                  </div>

                  <button
                    onClick={() => startLesson(lesson.id)}
                    disabled={lesson.locked}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      lesson.locked
                        ? 'text-muted cursor-not-allowed'
                        : 'text-primary hover:bg-primary-light dark:hover:bg-primary-dark'
                    }`}
                  >
                    {lesson.completed ? 'Review' : 'Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
