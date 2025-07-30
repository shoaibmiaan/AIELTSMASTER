import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import Layout from '@/components/Layout';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyPhoneOTP, isLoading } = useAuth();
  const router = useRouter();
  const { phone } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await verifyPhoneOTP(phone as string, otp);
      router.push('/dashboard'); // Or your desired redirect
    } catch (err: any) {
      // Relay the specific error message if provided
      toast.error(err?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout hideHeader hideFooter>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card rounded-lg shadow-md p-8 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-6">Verify OTP</h1>
          <p className="text-muted-foreground mb-4">Enter the 6-digit code sent to {phone}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                maxLength={6}
                className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading || isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        </div>
        <Toaster position="top-right" />
      </div>
    </Layout>
  );
}