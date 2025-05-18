
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

// This component is a placeholder as the prompt history feature has been removed.
export function PromptHistory() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <History className="mr-2 h-5 w-5 text-primary" />
          Prompt History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The prompt history feature has been removed from the application.
        </p>
      </CardContent>
    </Card>
  );
}
