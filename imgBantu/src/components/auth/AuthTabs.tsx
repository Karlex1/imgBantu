
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from '@/components/ui/loader'; // Updated import

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

export function AuthTabs() {
  const { login, signup, loading: authLoadingContext } = useAuth(); // Renamed to avoid conflict
  const [formError, setFormError] = useState<string | null>(null);
  
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: isSignupSubmitting },
    reset: resetSignup,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onLogin: SubmitHandler<FormData> = async (data) => {
    setFormError(null);
    try {
      await login(data.email, data.password);
      resetLogin();
    } catch (error) {
      // Error is already toasted by AuthContext, formError could be set if needed for specific UI
      // setFormError("Login failed. Please check your credentials.");
    }
  };

  const onSignup: SubmitHandler<FormData> = async (data) => {
    setFormError(null);
    try {
      await signup(data.email, data.password);
      resetSignup();
    } catch (error) {
      // Error is already toasted by AuthContext
      // setFormError("Signup failed. Please try again.");
    }
  };
  
  const isLoading = authLoadingContext || isLoginSubmitting || isSignupSubmitting;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Access your ImageBantu account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                {formError && <p className="text-sm text-destructive">{formError}</p>}
                <div className="space-y-1">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" {...registerLogin('email')} placeholder="you@example.com" />
                  {loginErrors.email && <p className="text-sm text-destructive">{loginErrors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" {...registerLogin('password')} placeholder="••••••••" />
                  {loginErrors.password && <p className="text-sm text-destructive">{loginErrors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader size="sm" className="mr-2" /> : null} {/* Updated to use Loader */}
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new ImageBantu account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
                {formError && <p className="text-sm text-destructive">{formError}</p>}
                <div className="space-y-1">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" {...registerSignup('email')} placeholder="you@example.com" />
                  {signupErrors.email && <p className="text-sm text-destructive">{signupErrors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" {...registerSignup('password')} placeholder="••••••••" />
                  {signupErrors.password && <p className="text-sm text-destructive">{signupErrors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader size="sm" className="mr-2" /> : null} {/* Updated to use Loader */}
                  Sign Up
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
