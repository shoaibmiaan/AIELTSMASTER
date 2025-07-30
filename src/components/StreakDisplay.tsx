// components/StreakDisplay.tsx
import { useEffect, useState } from 'react';
import { StreakService } from '@/lib/streakService';

export default function StreakDisplay({ userId }: { userId: string }) {
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const data = await StreakService.get(userId);
        setStreak(data.current_streak);
      } catch (err) {
        setError(err.message);
      }
    };

    loadStreak();
  }, [userId]);

  if (error) return <div className="error">Error: {error}</div>;
  if (streak === null) return <div>Loading...</div>;

  return (
    <div className="streak-display">
      Current streak: {streak} days
    </div>
  );
}