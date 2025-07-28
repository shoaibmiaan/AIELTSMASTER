// lib/passwordResetHelper.ts

import { supabase } from '@/lib/supabaseClient';  // Import Supabase client
import toast from 'react-hot-toast';  // Import toast for notifications

export const sendResetEmail = async (email: string) => {
  const { error } = await supabase.auth.api.resetPasswordForEmail(email);

  if (error) {
    console.error("Error sending reset email:", error.message);
    toast.error('There was an issue sending the reset email');
    throw new Error('There was an issue sending the reset email');
  } else {
    toast.success('Password reset email sent!');
    return true; // Return success status
  }
};
