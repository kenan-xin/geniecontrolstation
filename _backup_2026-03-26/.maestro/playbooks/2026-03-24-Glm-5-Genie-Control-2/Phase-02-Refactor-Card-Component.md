# Phase 02: Refactor Card Component

Remove the left-border accent anti-pattern and apply subtle background fill. Fix typography hierarchy using `/typeset` principles.

## Tasks

- [x] Refactor `genie-dashboard/src/components/shared/status-stat-card.tsx`:
  - **Remove left-border accent**: ~~Delete `border-l-[3px]` and `config.border` from Card className~~ (already done)
  - **Apply subtle background fill**: ~~Add `config.cardBg` to Card className with `transition-colors duration-200`~~ (already done)
  - **Simplify icon badge**: ~~Change from colored `config.bg` to subtle `bg-background/50`~~ (already done)
  - **Fix typography (typeset)**:
    - Count: `tabular-nums` already present ✓
    - Label: Changed default size from `text-sm` to `text-xs` for consistency ✓
  - **Update Card className**: Changed `hover:bg-accent/50` to `hover:bg-accent/30` ✓

- [x] Update icon wrapper in `status-stat-card.tsx`:
  - Already using `bg-background/50` ✓
  - Icon keeps its color via `config.color` ✓

- [x] Expected final component structure:
  ```tsx
  <Card
    size={isSm ? 'sm' : undefined}
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
          {count}
        </p>
        <p className={cn(
          'mt-1 text-muted-foreground truncate',
          isSm ? 'text-xs' : 'text-xs'
        )}>
          {config.label}
        </p>
      </div>
      <div className={cn('shrink-0 rounded-lg bg-background/50', isSm ? 'p-1.5' : 'p-2')}>
        <Icon className={cn(isSm ? 'size-3.5' : 'size-4', config.color)} />
      </div>
    </CardContent>
  </Card>
  ```
