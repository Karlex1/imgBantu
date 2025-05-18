
'use client';

import { useState, useEffect } from 'react';
import { generateMultipleCliparts } from '@/ai/flows/generate-multiple-cliparts';
import { ClipartGeneratorForm } from '@/components/ClipartGeneratorForm';
import { ImageGallery } from '@/components/ImageGallery';
import { Logo } from '@/components/icons/Logo';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Github, LogIn, LogOut, UserCircle, Gem, Lightbulb, ShieldAlert } from 'lucide-react'; // Added Lightbulb, removed HistoryIcon
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from '@/components/ui/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export default function ClipArtGenPage() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string>('');

  const { toast } = useToast();
  const { currentUser, logout, loading: authLoading } = useAuth();


  const handleGenerateClipart = async (promptText: string) => {
    if (!promptText.trim()) {
      toast({ title: 'Empty Prompt', description: 'Please enter a prompt to generate clipart.', variant: 'destructive' });
      return;
    }
    if (!currentUser) {
      toast({ title: 'Login Required', description: 'Please login to generate clipart.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setGeneratedImageUrls([]);
    setLastUsedPrompt(promptText);

    try {
      const result = await generateMultipleCliparts({ prompt: promptText, numImages: 4 });
      if (result.images && result.images.length > 0) {
        setGeneratedImageUrls(result.images);
        toast({ title: 'Clipart Generated!', description: 'Your new clipart is ready.', variant: 'default' });
      } else {
        toast({ title: 'Generation Failed', description: 'No images were returned. Please try a different prompt.', variant: 'destructive' });
      }
    } catch (error: any) {
      console.error('Error generating clipart:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error.toString === 'function') {
        const errStr = error.toString();
        if (errStr !== '[object Object]' && errStr.trim() !== '') {
            errorMessage = errStr;
        } else if (error.details) { // Attempt to get more specific details if available
            errorMessage = error.details;
        } else if (error.statusText) { // For network-like errors
            errorMessage = error.statusText;
        }
      }
      toast({
        title: 'Generation Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 px-6 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="https://github.com/karlex1" target="_blank" rel="noopener noreferrer" aria-label="View source code on GitHub">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            {authLoading ? (
              <Button variant="ghost" size="icon" disabled>
                <Loader size="sm" />
              </Button>
            ) : currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem disabled>
                    {currentUser.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/subscribe" className="flex items-center">
                      <Gem className="mr-2 h-4 w-4" />
                      Subscribe
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline">
                <Link href="/auth">
                  <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Controls */}
          <div className="md:col-span-1 space-y-6">
            <section aria-labelledby="generator-heading">
              <h2 id="generator-heading" className="sr-only">Clipart Generator</h2>
              <ClipartGeneratorForm
                onGenerate={handleGenerateClipart}
                isLoading={isLoading}
                initialPrompt={currentPrompt}
              />
            </section>
            <Separator />
            <section aria-labelledby="prompt-tips-heading">
              <h2 id="prompt-tips-heading" className="sr-only">Prompting Tips</h2>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                    Prompting Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Be specific! "A smiling cat" is better than "cat".</li>
                    <li>Add details like colors, style, or actions.</li>
                    <li>Try "cartoon style", "watercolor", "vector art".</li>
                    <li>Combine concepts: "A robot eating spaghetti".</li>
                  </ul>
                   {!currentUser && !authLoading && (
                    <p className="text-xs text-muted-foreground mt-4">
                      <Link href="/auth" className="underline text-primary hover:text-primary/80">Login</Link> to generate images and save your creations.
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Column: Image Gallery */}
          <div className="md:col-span-2">
            <section aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="sr-only">Generated Clipart Gallery</h2>
              <ImageGallery imageUrls={generatedImageUrls} isLoading={isLoading} promptUsed={lastUsedPrompt} />
            </section>
          </div>
        </div>
      </main>

      <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>&copy; 2025 ClipArtGen. Powered by Karlex and gemini.</p>
      </footer>
    </div>
  );
}
