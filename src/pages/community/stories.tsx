'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider'; // Import the theme context
import Image from 'next/image'; // Correct import for Next.js Image

export default function Stories() {
  const { theme } = useTheme(); // Access the theme from context

  const stories = [
    {
      id: 1,
      name: 'Fatima K.',
      location: 'Lahore, Pakistan',
      quote:
        'AIELTS Prep’s AI feedback helped me improve my Writing from Band 6 to 7.5 in just 3 weeks!',
      image: '/community.jpg',
    },
    {
      id: 2,
      name: 'Usman R.',
      location: 'Karachi, Pakistan',
      quote:
        'The mock tests and AI analysis made all the difference. I scored Band 8 in Speaking!',
      image: '/community.jpg',
    },
    {
      id: 3,
      name: 'Ayesha S.',
      location: 'Islamabad, Pakistan',
      quote:
        'The personalized study plan kept me on track. I achieved my target Band 7.0!',
      image: '/community.jpg',
    },
  ];

  return (
    <motion.section
      className="px-6 md:px-20 py-16 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        background: `rgb(var(--color-background))`,
      }}
    >
      <h1
        className="text-3xl sm:text-4xl font-bold mb-6"
        style={{
          color: `rgb(var(--color-foreground))`, // Dynamically apply the text color
        }}
      >
        Success Stories
      </h1>
      <p
        className="text-sm mb-8"
        style={{
          color: `rgb(var(--color-foreground))`, // Dynamically apply the text color
        }}
      >
        Discover how AIELTS Prep has helped students worldwide achieve their
        IELTS goals with AI-driven tools.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            className="p-6 rounded-xl hover:border-orange-500 border border-transparent transition hover:bg-opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            style={{
              background: `rgb(var(--color-card))`, // Dynamically apply background based on theme
              color: `rgb(var(--color-foreground))`, // Dynamically apply text color
            }}
          >
            <div className="rounded-lg overflow-hidden mb-4">
              <Image
                src={story.image}
                alt={`Success story from ${story.name}`}
                width={300}
                height={200}
                className="object-cover w-full hover:scale-105 transition duration-700 transition-opacity opacity-0 duration-300"
                onLoadingComplete={(e) => e.currentTarget.classList.remove('opacity-0')}
              />
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{
                color: `rgb(var(--color-foreground))`, // Apply dynamic text color
              }}
            >
              {story.name}
            </h3>
            <p
              className="text-sm mb-2"
              style={{
                color: `rgb(var(--color-foreground))`, // Apply dynamic text color
              }}
            >
              {story.location}
            </p>
            <p
              className="text-sm italic"
              style={{
                color: `rgb(var(--color-foreground))`, // Apply dynamic text color
              }}
            >
              "{story.quote}"
            </p>
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/signup">
            <button
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
              aria-label="Start Your Journey"
            >
              Start Your Journey
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
