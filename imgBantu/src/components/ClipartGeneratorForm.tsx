"use client";

import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';

interface ClipartGeneratorFormProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading: boolean;
  initialPrompt?: string;
}

export function ClipartGeneratorForm({
  onGenerate,
  isLoading,
  initialPrompt = '',
}: ClipartGeneratorFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  React.useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-foreground mb-1">
          Enter your clipart idea
        </label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., a happy cat wearing a party hat"
          className="min-h-[100px] shadow-sm focus:ring-primary focus:border-primary"
          disabled={isLoading}
          rows={3}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Describe the clipart you want to create. Be as specific or creative as you like!
        </p>
      </div>
      <Button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        aria-label="Generate Clipart"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Generate Clipart
      </Button>
    </form>
  );
}
