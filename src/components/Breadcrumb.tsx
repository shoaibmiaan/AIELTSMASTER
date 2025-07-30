'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StudyStreak from '@/components/StreakDisplay';

type BreadcrumbProps = {
  userId: string | null;
};

export default function Breadcrumb({ userId }: BreadcrumbProps) {
  const pathname = usePathname();

  // Improved path segmentation that handles special characters and multiple slashes
  const segments = pathname
    .split('/')
    .filter(seg => seg.trim() !== '' && seg !== '/');

  const buildPath = (index: number) => {
    return '/' + segments.slice(0, index + 1).join('/');
  };

  const formatSegment = (segment: string) => {
    try {
      const decoded = decodeURIComponent(segment);
      return decoded
        .split(/[-_]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    } catch {
      return segment; // fallback if decode fails
    }
  };

  return (
    <nav
      className="mb-4 overflow-x-auto whitespace-nowrap px-4 py-2 rounded-md shadow bg-lavender-blush-500 dark:bg-slate-gray-500"
      aria-label="Breadcrumb"
    >
      <div className="flex items-center justify-between flex-wrap">
        <ol className="flex items-center space-x-1 text-sm flex-wrap">
          <li>
            <Link
              href="/"
              className="hover:underline text-indigo-dye-500 flex items-center gap-1"
            >
              <span>🏠</span>
              <span className="font-medium hidden sm:inline">Home</span>
            </Link>
          </li>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            return (
              <li key={index} className="flex items-center">
                <span className="px-1 text-slate-gray-500">/</span>
                <Link
                  href={buildPath(index)}
                  className={`${
                    isLast
                      ? 'text-slate-gray-500 dark:text-lavender-blush-500 font-semibold'
                      : 'hover:underline text-slate-gray-500 dark:text-peach-500'
                  }`}
                >
                  {formatSegment(segment)}
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center">
          {userId && <StudyStreak userId={userId} />}
        </div>
      </div>
    </nav>
  );
}