// pages/signup.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const colors = {
  indigoDye: '#08415c',
  persianRed: '#cc2936',
  slateGray: '#6b818c',
  peach: '#f1bf98',
  lavenderBlush: '#eee5e9',
  darkBg: '#0a1a24',
};

export default function SignupPage() {
  const { user, isLoading, signupWithEmail, signupWithGoogle, signupWithFacebook } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Dark mode initialization
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Redirect if logged in
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Password validation
    if (name === 'password') {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  // Handle email signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('You must accept the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const isValidPassword = Object.values(passwordValidation).every(Boolean);
    if (!isValidPassword) {
      setError('Password does not meet requirements');
      return;
    }

    try {
      await signupWithEmail(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    try {
      await signupWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  // Handle Facebook signup
  const handleFacebookSignup = async () => {
    try {
      await signupWithFacebook();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Facebook');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{
            borderTopColor: colors.peach,
            borderBottomColor: colors.indigoDye
          }}
        ></div>
      </div>
    );
  }

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user}>
      <div
        className="max-w-md mx-auto rounded-xl shadow-lg p-8"
        style={{
          backgroundColor: darkMode ? colors.darkBg : colors.lavenderBlush
        }}
      >
        <h2
          className="text-2xl font-bold text-center mb-6"
          style={{ color: darkMode ? colors.peach : colors.indigoDye }}
        >
          Register for IELTS Master
        </h2>

        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-center"
            style={{
              backgroundColor: darkMode ? '#2c0a0d' : '#fce8e9',
              color: colors.persianRed
            }}
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 border rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: darkMode ? '#1a2d38' : 'white',
              borderColor: colors.slateGray,
              color: darkMode ? 'white' : colors.indigoDye
            }}
          >
            <FcGoogle className="w-5 h-5" />
            Sign up with Google
          </button>

          <button
            onClick={handleFacebookSignup}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 border rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: darkMode ? '#1a2d38' : 'white',
              borderColor: colors.slateGray,
              color: darkMode ? 'white' : colors.indigoDye
            }}
          >
            <FaFacebook className="w-5 h-5 text-blue-600" />
            Sign up with Facebook
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t" style={{ borderColor: colors.slateGray }}></div>
          <span
            className="mx-4 text-sm"
            style={{ color: colors.slateGray }}
          >
            OR
          </span>
          <div className="flex-grow border-t" style={{ borderColor: colors.slateGray }}></div>
        </div>

        <form onSubmit={handleEmailSignup} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: darkMode ? colors.peach : colors.indigoDye }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.slateGray,
                backgroundColor: darkMode ? '#1a2d38' : colors.lavenderBlush,
                color: darkMode ? 'white' : colors.indigoDye,
                '--tw-ring-color': darkMode ? colors.peach : colors.indigoDye
              } as React.CSSProperties}
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: darkMode ? colors.peach : colors.indigoDye }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.slateGray,
                  backgroundColor: darkMode ? '#1a2d38' : colors.lavenderBlush,
                  color: darkMode ? 'white' : colors.indigoDye,
                  '--tw-ring-color': darkMode ? colors.peach : colors.indigoDye
                } as React.CSSProperties}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" style={{ color: colors.slateGray }} />
                ) : (
                  <EyeIcon className="h-5 w-5" style={{ color: colors.slateGray }} />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="mt-2 text-xs" style={{ color: colors.slateGray }}>
              <p className="font-medium mb-1">Password must contain:</p>
              <ul className="grid grid-cols-2 gap-1">
                <li className={`flex items-center ${passwordValidation.minLength ? 'text-green-500' : ''}`}>
                  {passwordValidation.minLength ? '✓' : '•'} At least 8 characters
                </li>
                <li className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-500' : ''}`}>
                  {passwordValidation.hasNumber ? '✓' : '•'} At least one number
                </li>
                <li className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-500' : ''}`}>
                  {passwordValidation.hasSpecialChar ? '✓' : '•'} At least one special character
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
              style={{ color: darkMode ? colors.peach : colors.indigoDye }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: colors.slateGray,
                  backgroundColor: darkMode ? '#1a2d38' : colors.lavenderBlush,
                  color: darkMode ? 'white' : colors.indigoDye,
                  '--tw-ring-color': darkMode ? colors.peach : colors.indigoDye
                } as React.CSSProperties}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" style={{ color: colors.slateGray }} />
                ) : (
                  <EyeIcon className="h-5 w-5" style={{ color: colors.slateGray }} />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                className="w-4 h-4 border rounded focus:ring-2"
                style={{
                  borderColor: colors.slateGray,
                  backgroundColor: darkMode ? '#1a2d38' : colors.lavenderBlush,
                  '--tw-ring-color': darkMode ? colors.peach : colors.indigoDye
                } as React.CSSProperties}
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                style={{ color: darkMode ? colors.peach : colors.indigoDye }}
              >
                I agree to the{' '}
                <a
                  href="/terms"
                  className="font-medium hover:underline"
                  style={{ color: darkMode ? colors.peach : colors.indigoDye }}
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full font-medium py-3 px-4 rounded-lg transition-colors duration-300 shadow-md"
              style={{
                backgroundColor: darkMode ? colors.peach : colors.indigoDye,
                color: darkMode ? colors.darkBg : 'white',
              }}
            >
              Register Now
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm" style={{ color: colors.slateGray }}>
          <p>
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium hover:underline"
              style={{ color: darkMode ? colors.peach : colors.indigoDye }}
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}