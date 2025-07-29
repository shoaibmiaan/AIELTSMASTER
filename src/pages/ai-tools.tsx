'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

type Tool = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  icon: string;
  color: string;
  locked: boolean;
};

export default function AIToolsPortal() {
  const router = useRouter();
  const user = false; // Simplified since auth is handled in _app.tsx

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'text', name: 'Text', icon: 'file-text' },
    { id: 'image', name: 'Image', icon: 'image' },
    { id: 'code', name: 'Code', icon: 'code' },
    { id: 'audio', name: 'Audio', icon: 'headphones' },
  ];

  const tools: Tool[] = [
    {
      id: '1',
      name: 'AI Essay Grader',
      description:
        'Get instant feedback on your IELTS writing tasks with detailed scoring.',
      categories: ['text'],
      icon: 'edit-3',
      color: 'bg-primary/10 text-primary',
      locked: true,
    },
    {
      id: '2',
      name: 'Speaking Simulator',
      description:
        'Practice IELTS speaking with AI-powered mock interviews and feedback.',
      categories: ['audio'],
      icon: 'mic',
      color: 'bg-primary/10 text-primary',
      locked: true,
    },
    {
      id: '3',
      name: 'Reading Analyzer',
      description:
        'Improve reading comprehension with adaptive exercises and explanations.',
      categories: ['text'],
      icon: 'book-open',
      color: 'bg-primary/10 text-primary',
      locked: true,
    },
    {
      id: '4',
      name: 'Vocabulary Builder',
      description:
        'Expand your academic vocabulary with personalized word lists and quizzes.',
      categories: ['text'],
      icon: 'bookmark',
      color: 'bg-primary/10 text-primary',
      locked: true,
    },
    {
      id: '5',
      name: 'Grammar Checker',
      description:
        'Identify and correct grammatical errors in your writing instantly.',
      categories: ['text'],
      icon: 'check-circle',
      color: 'bg-primary/10 text-primary',
      locked: true,
    },
    {
      id: '6',
      name: 'Listening Trainer',
      description:
        'Practice IELTS listening tests with adjustable difficulty levels.',
      categories: ['audio'],
      icon: 'headphones',
      color: 'bg-primary/10 text-primary',
      locked: true,
    },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || tool.categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  const handleToolClick = (tool: Tool) => {
    if (tool.locked && !user) {
      toast.error('Please log in to access premium features');
      sessionStorage.setItem('redirectUrl', `/ai-tools/${tool.id}`);
      router.push('/login');
    } else if (tool.locked) {
      setShowUpgradeModal(true);
    } else {
      router.push(`/ai-tools/${tool.id}`);
    }
  };

  const Icon = ({ name, className = '' }: { name: string; className?: string }) => {
    const icons: Record<string, JSX.Element> = {
      grid: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      'file-text': (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      image: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      code: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      headphones: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3H6a2 2 0 01-2-2v-2a2 2 0 012-2h3l3-3m0 12l3-3h3a2 2 0 002-2v-2a2 2 0 00-2-2h-3l-3-3"
          />
        </svg>
      ),
      'edit-3': (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 3l6 6-9 9H6v-6l9-9z"
          />
        </svg>
      ),
      mic: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
      'book-open': (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      bookmark: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v18l7-5 7 5V3H5z"
          />
        </svg>
      ),
      'check-circle': (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };
    return icons[name] || <div className={`h-5 w-5 ${className}`} />;
  };

  return (
    <div className="font-sans bg-background text-foreground min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              AI-Powered Learning Tools
            </h1>
            <p className="text-xl text-foreground/80 mb-8">
              Unlock premium AI tools to accelerate your IELTS preparation and achieve your target score
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => router.push('/pricing')}
              >
                <i className="fas fa-rocket mr-2"></i> Explore Premium Tools
              </button>
              <button
                className="bg-card hover:bg-card-hover text-primary border border-primary px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => router.push('/strategies/ai-tools')}
              >
                <i className="fas fa-lightbulb mr-2"></i> Tool Strategies
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-foreground">Available Tools</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-card-hover text-foreground/80 hover:bg-accent'
                  }`}
                >
                  <span className="mr-2">
                    <Icon name={category.icon} />
                  </span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative max-w-md mx-auto mb-6">
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full px-4 py-2 rounded-md border border-border bg-card text-foreground placeholder-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-2.5 text-foreground/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="bg-card border border-border rounded-xl shadow-sm p-8 text-center">
              <i className="fas fa-tools text-4xl text-foreground/30 mb-4"></i>
              <h3 className="text-xl font-semibold text-foreground">No tools found</h3>
              <p className="text-foreground/60 mb-4">
                No tools match your current filters or search query.
              </p>
              <button
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium"
                onClick={() => router.push('/pricing')}
              >
                <i className="fas fa-rocket mr-2"></i> Explore All Tools
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => handleToolClick(tool)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {tool.name}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {tool.locked ? 'Premium' : 'Free'}
                      </span>
                    </div>
                    <p className="text-foreground/80 text-sm mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.categories.map((catId) => {
                        const catName = categories.find((c) => c.id === catId)?.name;
                        return catName ? (
                          <span
                            key={catId}
                            className="text-xs bg-accent/20 text-foreground px-2 py-1 rounded-full"
                          >
                            {catName}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 ${tool.color} rounded-full flex items-center justify-center`}>
                        <Icon name={tool.icon} className="text-primary" />
                      </div>
                    </div>
                  </div>
                  <button
                    className={`w-full py-3 px-4 font-medium transition-colors duration-200 ${
                      tool.locked
                        ? 'bg-card-hover text-primary hover:bg-accent'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {tool.locked ? (
                      <><i className="fas fa-lock mr-2"></i> Upgrade to Access</>
                    ) : (
                      <><i className="fas fa-play mr-2"></i> Open Tool</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card/50 p-6 rounded-xl border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Tool Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <i className="fas fa-rocket text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Maximize Tool Usage</h3>
                  <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-sm">
                    <li>Use tools regularly to track progress</li>
                    <li>Combine text and audio tools for comprehensive practice</li>
                    <li>Review feedback to identify weak areas</li>
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
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Time Efficiency</h3>
                  <p className="text-foreground/80 text-sm">
                    Focus on one tool per session for 15-20 minutes to maintain concentration and achieve better results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-3 text-foreground text-center">Upgrade to Pro</h3>
              <p className="text-foreground/80 mb-4 text-center text-sm">
                Unlock all premium AI tools to accelerate your IELTS preparation
              </p>
              <div className="mb-6">
                <div className="bg-accent/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div>
                      <h4 className="font-medium text-foreground">Pro Features Include:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-foreground/80 text-sm mt-1">
                        <li>All AI-powered learning tools</li>
                        <li>Detailed feedback and analysis</li>
                        <li>Progress tracking</li>
                        <li>Priority support</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Monthly</h4>
                    <p className="text-2xl font-bold text-primary">$19.99</p>
                    <p className="text-foreground/80 text-sm">per month</p>
                  </div>
                  <div className="p-4 border-2 border-primary bg-accent/20 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Yearly</h4>
                        <p className="text-2xl font-bold text-primary">$149.99</p>
                        <p className="text-foreground/80 text-sm">per year</p>
                      </div>
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                        Save 37%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/pricing')}
                  className="bg-primary hover:bg-primary/90 text-white py-2 rounded-md font-medium text-sm"
                >
                  Upgrade Now
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="bg-card hover:bg-card-hover text-primary border border-primary py-2 rounded-md font-medium text-sm"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}