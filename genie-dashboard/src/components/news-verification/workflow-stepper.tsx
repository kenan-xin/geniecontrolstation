'use client';

import { Newspaper, Gavel, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: StepConfig[] = [
  { label: 'Unverified', icon: Newspaper },
  { label: 'Approval', icon: Gavel },
  { label: 'Schedule', icon: Clock },
  { label: 'Published', icon: CheckCircle2 }
];

interface WorkflowStepperProps {
  activeStep: number;
  className?: string;
}

export function WorkflowStepper({ activeStep, className }: WorkflowStepperProps) {
  return (
    <nav className={cn('w-full', className)} aria-label="Article workflow progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isPending = index > activeStep;

          return (
            <li key={step.label} className="flex-1 flex items-center">
              <div className="flex-1 flex items-center">
                {/* Step indicator */}
                <div
                  className={cn(
                    'relative flex items-center justify-center transition-all duration-300',
                    'size-9 rounded-full shrink-0',
                    isCompleted && 'bg-primary text-primary-foreground shadow-md shadow-primary/30',
                    isActive && 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/20 ring-offset-2',
                    isPending && 'bg-muted text-muted-foreground border border-border'
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="size-4.5" /> : <Icon className="size-4" />}
                </div>

                {/* Label - hidden on mobile */}
                <span
                  className={cn(
                    'ml-2.5 text-sm font-medium hidden sm:block',
                    isCompleted && 'text-primary dark:text-primary',
                    isActive && 'text-primary',
                    isPending && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-3">
                  <div className={cn('h-0.5 rounded-full transition-all duration-500', isCompleted ? 'bg-primary' : 'bg-border')} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
