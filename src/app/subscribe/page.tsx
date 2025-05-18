
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/Logo';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader'; 

export default function SubscribePage() {
  const { currentUser, loading } = useAuth(); // `loading` here refers to AuthContext's initial auth check.
  const router = useRouter();

  const handleSubscribe = () => {
    // Placeholder for actual subscription logic
    alert('Subscription feature coming soon! This will integrate with a payment provider.');
    // Example: router.push('/checkout/premium-plan');
  };

  // The AuthProvider already handles a full-page loader for the initial auth state.
  // So, this component will only render once `useAuth().loading` is false.
  // The `if (loading)` check here for the same flag is therefore redundant.

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/10 via-background to-background">
      <header className="py-4 px-6 shadow-sm bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          {currentUser ? (
             <Button variant="outline" onClick={() => router.push('/')}>Back to App</Button>
          ) : (
            <Button asChild variant="default">
              <Link href="/auth">Login / Sign Up</Link>
            </Button>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Unlock Premium Features</CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Supercharge your clipart generation with ImageBantu Pro.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-5xl font-extrabold text-foreground">$1.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                Unlimited clipart generations
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                Access to exclusive styles & models
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                Higher resolution downloads
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                Priority support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
              onClick={handleSubscribe}
              disabled={!currentUser || loading} // Disable if still in auth loading or no user
            >
              {loading ? <Loader size="sm" className="mr-2" /> : (currentUser ? 'Subscribe Now' : 'Login to Subscribe')}
            </Button>
          </CardFooter>
        </Card>
        {!currentUser && !loading && <p className="mt-4 text-sm text-muted-foreground">You need to be logged in to subscribe.</p>}
         <p className="mt-8 text-center text-xs text-muted-foreground">
            Payments are securely processed. You can cancel anytime.
          </p>
      </main>
      
      <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>&copy; 2025 ClipArtGen. Powered by Karlex and gemini.</p>
      </footer>
    </div>
  );
}
