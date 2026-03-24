'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Generic status config interface - works with both news and application configs
interface StatusConfigBase {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg?: string;
  cardBg: string;
}

interface StatusStatCardProps<T extends StatusConfigBase> {
  config: T;
  count: number;
  size?: 'sm' | 'default';
}

/**
 * Format large numbers for display (i18n-ready)
 * Uses Intl.NumberFormat for compact notation
 */
function formatCount(count: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(count);
}

export function StatusStatCard<T extends StatusConfigBase>({ config, count, size = 'default' }: StatusStatCardProps<T>) {
  const Icon = config.icon;
  const isSm = size === 'sm';
  const formattedCount = formatCount(count);
  const ariaLabel = `${count} ${config.label}`; // Use raw count for screen reader accuracy

  return (
    <TooltipProvider>
      <Card
        size={isSm ? 'sm' : undefined}
        role="status"
        aria-label={ariaLabel}
        className={cn(
          'relative overflow-hidden transition-colors duration-200 hover:bg-accent/30',
          config.cardBg
        )}
      >
        <CardContent className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className={cn(
              'font-semibold tabular-nums tracking-tight leading-none',
              isSm ? 'text-xl' : 'text-2xl',
              config.color
            )}>
              {formattedCount}
            </p>
            <Tooltip>
              <TooltipTrigger
                className={cn(
                  'mt-1 text-muted-foreground truncate cursor-default text-left',
                  'text-xs'
                )}
              >
                {config.label}
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                {config.label}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className={cn('shrink-0 rounded-lg bg-background/50', isSm ? 'p-1.5' : 'p-2')}>
            <Icon className={cn(isSm ? 'size-3.5' : 'size-4', config.color)} />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
