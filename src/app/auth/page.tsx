
import { AuthTabs } from '@/components/auth/AuthTabs';
import { Logo } from '@/components/icons/Logo';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="py-4 px-6 shadow-md bg-card">
        <div className="container mx-auto flex justify-center items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col justify-center">
        <AuthTabs />
      </main>
      <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>&copy; 2025 ClipArtGen. Powered by Karlex and gemini.</p>
      </footer>
    </div>
  );
}
