// login.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'twitter') => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    // Phone login implementation would go here
    // This would typically open a modal or switch to phone input
    console.log('Phone login initiated');
  };

  return (
    <>
      <Head>
        <title>{activeTab === 'login' ? 'Login' : 'Sign Up'} | Your App</title>
      </Head>

      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex border-b mb-8">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('login')}
              >
                Log In
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6">
              {activeTab === 'login' ? 'Log into your account' : 'Create a new account'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <button
                onClick={() => handleSocialLogin('twitter')}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24">
                  {/* Twitter/X icon */}
                  <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                {activeTab === 'login' ? 'Login with X' : 'Sign up with X'}
              </button>

              <button
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  {/* Google icon */}
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
                  <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/>
                  <path fill="#FBBC05" d="M1.24 6.65A11.995 11.995 0 0 0 0 12c0 1.92.445 3.73 1.24 5.35l4.04-3.065A7.015 7.015 0 0 1 4.077 12c0-.79.14-1.56.393-2.265L1.24 6.65z"/>
                  <path fill="#4285F4" d="M12 4.909c1.68 0 3.182.593 4.36 1.582L19.818 3C17.545 1.145 14.818 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115c1.18-2.58 4.464-4.856 8.734-4.856z"/>
                  <path fill="#EA4335" d="M12 16.91c-1.68 0-3.182-.593-4.36-1.582L4.182 21C6.455 22.855 9.182 24 12 24c4.73 0 8.802-2.698 10.76-6.65l-4.026-3.115c-1.18 2.58-4.464 4.856-8.734 4.856z"/>
                </svg>
                {activeTab === 'login' ? 'Login with Google' : 'Sign up with Google'}
              </button>

              <button
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  {/* Apple icon */}
                  <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                {activeTab === 'login' ? 'Login with Apple' : 'Sign up with Apple'}
              </button>

              <button
                onClick={handlePhoneLogin}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 border rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  {/* Phone icon */}
                  <path fill="currentColor" d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 0 0-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                </svg>
                {activeTab === 'login' ? 'Login with Phone' : 'Sign up with Phone'}
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-gray-500 text-sm">
                  Or {activeTab === 'login' ? 'login' : 'sign up'} with email
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              {activeTab === 'login' && (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
              >
                {loading
                  ? activeTab === 'login' ? 'Logging in...' : 'Signing up...'
                  : activeTab === 'login' ? 'Login with email' : 'Sign up with email'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>

        {/* Right side - Logo/Image */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              {/* Replace with your logo */}
              <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Our Platform</h2>
            <p className="text-lg text-gray-600">
              {activeTab === 'login'
                ? 'Log in to access your account and continue your journey with us.'
                : 'Join our community today and unlock amazing features.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}