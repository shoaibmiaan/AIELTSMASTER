import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import Layout from '@/components/Layout';

export default function PhoneLoginPage() {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithPhone, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await loginWithPhone(phone);
      router.push({
        pathname: '/verify-otp',
        query: { phone },
      });
    } catch (err: any) {
      // Show the actual error message rather than a generic fallback
      toast.error(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout hideHeader hideFooter>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card rounded-lg shadow-md p-8 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-6">Login with Phone</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                required
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading || isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending OTP...' : 'Send Verification Code'}
            </button>
          </form>
        </div>
        <Toaster position="top-right" />
      </div>
    </Layout>
  );
}