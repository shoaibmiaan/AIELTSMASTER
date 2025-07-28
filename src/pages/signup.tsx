import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import AuthContainer from '@/components/AuthContainer';  // Importing the default export of AuthContainer
import { Button } from '@/components/ui/Button';  // Importing the named export Button
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('email');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (method === 'email') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`
          }
        });
        if (error) throw error;
        alert('Check your email for confirmation!');
      } else {
        const { error } = await supabase.auth.signUp({
          phone,
          password
        });
        if (error) throw error;
        router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Create Account"
      subtitle="Join thousands mastering IELTS with our platform"
    >
      <div className="tabs flex mb-6 rounded-lg bg-slate-gray-100 dark:bg-slate-gray-700 p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-center ${
            method === 'email'
              ? 'bg-indigo-dye text-lavender-blush'
              : 'text-slate-gray dark:text-lavender-blush'
          }`}
          onClick={() => setMethod('email')}
        >
          Email
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-center ${
            method === 'phone'
              ? 'bg-indigo-dye text-lavender-blush'
              : 'text-slate-gray dark:text-lavender-blush'
          }`}
          onClick={() => setMethod('phone')}
        >
          Phone
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {method === 'email' ? (
          <div>
            <label className="block text-sm font-medium text-slate-gray dark:text-lavender-blush mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-gray-300 dark:border-slate-gray-600 rounded-lg bg-card text-foreground"
              required
              placeholder="your.email@example.com"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-gray dark:text-lavender-blush mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-gray-300 dark:border-slate-gray-600 rounded-lg bg-card text-foreground"
              required
              placeholder="+1234567890"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-gray dark:text-lavender-blush mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-gray-300 dark:border-slate-gray-600 rounded-lg bg-card text-foreground"
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <div className="bg-persian-red/10 text-persian-red p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-indigo-dye hover:bg-indigo-dye/90 text-lavender-blush py-2.5"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-gray dark:text-lavender-blush">
          Already have an account?{' '}
          <Link href="/signin" className="text-indigo-dye hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthContainer>
  );
}
