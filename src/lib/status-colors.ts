export function getProgressColor(percent: number): string {
  if (percent >= 80) return 'bg-status-success';
  if (percent >= 50) return 'bg-status-info';
  if (percent >= 25) return 'bg-status-warning';
  return 'bg-status-error';
}
