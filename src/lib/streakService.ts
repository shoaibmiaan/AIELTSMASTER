// lib/streakService.ts
import { supabase } from '@/lib/supabaseClient';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
}

export const StreakService = {
  async get(userId: string): Promise<StreakData> {
    const { data, error } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_active_date')
      .eq('id', userId)
      .single();

    if (error) throw new Error(`Streak load failed: ${error.message}`);
    return data as StreakData;
  },

  async increment(userId: string): Promise<StreakData> {
    // First get current streak
    const current = await this.get(userId);

    // Calculate new streak (mock implementation)
    const lastActive = new Date(current.last_active_date);
    const today = new Date();
    const dayDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    const newStreak = dayDiff === 1 ? current.current_streak + 1 : 1;
    const newLongest = Math.max(newStreak, current.longest_streak);

    // Update streak
    const { data, error } = await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_active_date: today.toISOString()
      })
      .eq('id', userId)
      .select();

    if (error) throw new Error(`Streak update failed: ${error.message}`);
    return data[0] as StreakData;
  }
};