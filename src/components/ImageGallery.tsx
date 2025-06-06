"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download, ImageOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageGalleryProps {
  imageUrls: string[];
  isLoading: boolean;
  promptUsed?: string; // Optional: To show what prompt generated these images
}

async function downloadImage(imageUrl: string, prompt: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Sanitize prompt for filename
    const safePrompt = prompt.replace(/[^a-z0-9_]/gi, '_').substring(0, 30);
    a.download = `clipartgen_${safePrompt || 'image'}.png`; // Assume PNG, actual format might vary
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download image:', error);
    // Potentially show a toast notification to the user
    alert('Failed to download image. Please try again.');
  }
}


export function ImageGallery({ imageUrls, isLoading, promptUsed = "your prompt" }: ImageGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <Skeleton className="w-full aspect-square" />
            </CardContent>
            <CardFooter className="p-2">
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (imageUrls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-border rounded-lg bg-muted/20">
        <ImageOff className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No Images Yet</h3>
        <p className="text-muted-foreground">Enter a prompt and click "Generate Clipart" to see your creations here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {imageUrls.map((url, index) => (
        <Card key={index} className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
          <CardContent className="p-0 relative aspect-square">
            <Image
              src={url}
              alt={`Generated Clipart ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="bg-muted"
              data-ai-hint="illustration drawing"
              unoptimized={url.startsWith('data:')} // Data URIs don't need optimization from Next/Image
            />
          </CardContent>
          <CardFooter className="p-3 bg-card/80 backdrop-blur-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadImage(url, promptUsed)}
              className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
              aria-label={`Download clipart image ${index + 1}`}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
