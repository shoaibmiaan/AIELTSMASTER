import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  rank: number;
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching leaderboard data
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call in a real application
        const mockData: LeaderboardEntry[] = [
          { id: '1', username: 'User1', score: 1500, rank: 1 },
          { id: '2', username: 'User2', score: 1200, rank: 2 },
          { id: '3', username: 'User3', score: 1000, rank: 3 },
          { id: '4', username: 'User4', score: 800, rank: 4 },
          { id: '5', username: 'User5', score: 600, rank: 5 },
        ];
        setLeaderboardData(mockData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (!user) {
    return null; // RouteGuard will handle redirect to login
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Leaderboard</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="p-4 text-left text-foreground font-semibold">Rank</th>
                  <th className="p-4 text-left text-foreground font-semibold">Username</th>
                  <th className="p-4 text-left text-foreground font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-t border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4 text-foreground">{entry.rank}</td>
                    <td className="p-4 text-foreground">{entry.username}</td>
                    <td className="p-4 text-foreground">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}