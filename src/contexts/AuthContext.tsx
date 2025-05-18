
'use client';

import type { User, AuthError } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  UserCredential
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import { createUserDocument } from '@/lib/firestoreService'; // Import the new function

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Firebase onAuthStateChanged error:", error);
      toast({ title: 'Authentication Error', description: 'Could not initialize session. Please check configuration.', variant: 'destructive' });
      setLoading(false); 
    });
    return () => unsubscribe();
  }, [toast]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/');
    } catch (error) {
      const authError = error as AuthError;
      toast({ title: 'Login Failed', description: authError.message, variant: 'destructive' });
      console.error("Login error:", authError);
      setLoading(false); 
      throw authError; 
    } 
  };

  const signup = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, pass);
      
      // After successful Firebase Auth user creation, create user document in Firestore
      if (userCredential.user) {
        try {
          await createUserDocument(userCredential.user.uid, userCredential.user.email);
          toast({ title: 'Signup Successful', description: 'Welcome! Your account and profile have been created.' });
        } catch (firestoreError: any) {
          console.error("Error creating user document in Firestore during signup:", firestoreError);
          // Auth user was created, but Firestore doc creation failed.
          // Inform user, but still proceed with login state.
          toast({
            title: 'Account Created, Profile Issue',
            description: 'Your account is set up, but we had trouble creating your user profile. Some features might be limited. Please try logging out and back in, or contact support.',
            variant: 'destructive',
            duration: 7000, // Longer duration for important messages
          });
        }
      } else {
        // This case should ideally not happen if createUserWithEmailAndPassword succeeds
        toast({ title: 'Signup Issue', description: 'Account created, but user details are missing. Please try logging in.', variant: 'destructive' });
      }
      router.push('/');
    } catch (error) {
      const authError = error as AuthError;
      toast({ title: 'Signup Failed', description: authError.message, variant: 'destructive' });
      console.error("Signup error:", authError);
      setLoading(false); 
      throw authError; 
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/'); 
    } catch (error) {
      const authError = error as AuthError;
      toast({ title: 'Logout Failed', description: authError.message, variant: 'destructive' });
      setLoading(false); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-primary">
        <Loader size="lg" className="text-primary" />
        <p className="mt-4 text-muted-foreground">Initializing session...</p>
      </div>
    );
  }

  const value = {
    currentUser,
    loading, 
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
