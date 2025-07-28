// lib/reset-password.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { sendResetEmail } from '@/lib/passwordResetHelper';  // Import the helper function

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Send the reset email
  const handleSendResetEmail = async () => {
    setIsLoading(true);
    try {
      await sendResetEmail(email);  // Call the helper function to send the reset email
      setIsEmailSent(true);  // Set email sent flag to true
    } catch (error) {
      console.error("Error sending reset email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Perform password reset logic (check if token is valid, etc.)
      const { error } = await supabase.auth.api.updateUser(token, {
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsSuccess(true);
      toast.success('Password successfully updated');
    } catch (error) {
      toast.error('Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout user={null} isLoading={isLoading}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[calc(100vh-160px)]"
      >
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-2xl font-bold mb-4 dark:text-white">
                Reset Password
              </h1>

              {!isEmailSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Enter your email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                      placeholder="Your email"
                      required
                    />
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSendResetEmail}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Email'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-green-500 text-5xl mb-4">✓</div>
                    <p className="mb-6 dark:text-gray-300">
                      We've sent you a password reset email.
                    </p>
                    <p className="mb-6 dark:text-gray-300">
                      Please check your inbox and follow the instructions to reset your password.
                    </p>
                  </div>
                </>
              )}
            </form>
          ) : (
            <div className="text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <p className="mb-6 dark:text-gray-300">
                Your password has been successfully updated.
              </p>
              <a
                href="/login"
                className="inline-block w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold text-white transition"
              >
                Sign In
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
