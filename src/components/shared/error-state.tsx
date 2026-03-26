"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader className="items-center text-center pb-2">
        <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertCircle className="size-8 text-destructive" />
        </div>
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
          {message}
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
      <AlertCircle className="size-5 text-destructive shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-destructive">{message}</p>
      </div>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="shrink-0">
          <RefreshCw className="size-3.5 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
}
