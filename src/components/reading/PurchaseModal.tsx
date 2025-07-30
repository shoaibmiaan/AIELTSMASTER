import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPremium: boolean;
}

export default function PurchaseModal({ open, onOpenChange, isPremium }: PurchaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isPremium ? 'Get More Tests' : 'Upgrade Your Account'}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {isPremium
              ? 'Purchase additional tests for your premium account'
              : 'Get full access to unlimited test generation'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          {/* Test Packages */}
          <div className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg">5 Tests</h3>
            <p className="text-2xl font-bold my-3">$4.99</p>
            <p className="text-sm text-gray-600 mb-4">$1.00 per test</p>
            <Button className="w-full">Purchase</Button>
          </div>

          <div className="border rounded-lg p-4 text-center border-blue-300 bg-blue-50 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg">10 Tests</h3>
            <p className="text-2xl font-bold my-3">$8.99</p>
            <p className="text-sm text-gray-600 mb-4">$0.90 per test</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Best Value
            </Button>
          </div>

          <div className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg">20 Tests</h3>
            <p className="text-2xl font-bold my-3">$15.99</p>
            <p className="text-sm text-gray-600 mb-4">$0.80 per test</p>
            <Button className="w-full">Purchase</Button>
          </div>
        </div>

        {!isPremium && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-bold text-lg mb-3">Premium Membership</h3>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                50 tests per month included
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Priority test generation
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Detailed analytics
              </li>
            </ul>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-lg">
              Upgrade to Premium - $9.99/month
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}