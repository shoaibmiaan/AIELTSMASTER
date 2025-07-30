'use client';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider'; // Import the useTheme hook
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Forum() {
  const { theme } = useTheme(); // Access the theme from ThemeProvider
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Tips for IELTS Writing Task 2',
      author: 'Ayesha K.',
      date: '2025-07-12',
      replies: 15,
    },
    {
      id: 2,
      title: 'How to improve Speaking fluency?',
      author: 'Usman R.',
      date: '2025-07-11',
      replies: 8,
    },
    {
      id: 3,
      title: 'Best resources for Listening practice',
      author: 'Fatima S.',
      date: '2025-07-10',
      replies: 12,
    },
  ]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.section
      className={`px-6 md:px-20 py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} backdrop-blur-sm`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
        Community Forum
      </h1>
      <p className={`text-${theme === 'dark' ? 'gray-300' : 'gray-600'} mb-8 text-sm`}>
        Engage with IELTS aspirants worldwide, share your experiences, and get expert advice.
      </p>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search forum posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${
            theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-100 text-black border-gray-300'
          }`}
          aria-label="Search forum posts"
        />
      </div>
      <div className="space-y-6 mb-12">
        {filteredPosts.length === 0 ? (
          <p className={`text-${theme === 'dark' ? 'gray-400' : 'gray-500'} text-sm`}>No posts found.</p>
        ) : (
          filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              className={`p-6 rounded-xl hover:border-${theme === 'dark' ? 'orange-500' : 'orange-600'} border border-transparent transition hover:bg-${theme === 'dark' ? 'gray-700' : 'gray-100'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                <Link href={`/community/forum/${post.id}`}>{post.title}</Link>
              </h3>
              <div className={`flex justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>By {post.author}</span>
                <span>
                  {post.date} • {post.replies} Replies
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
      <div className="text-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/community/forum/new">
            <button
              className={`px-6 py-3 font-semibold rounded-lg transition ${
                theme === 'dark' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
              aria-label="Create New Post"
            >
              Create New Post
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
