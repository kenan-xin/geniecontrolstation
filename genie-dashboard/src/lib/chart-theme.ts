export function getChartColors() {
  if (typeof document === 'undefined') {
    return {
      primary: 'oklch(0.45 0.08 250)',
      secondary: 'oklch(0.55 0.06 250)',
      muted: 'oklch(0.50 0.02 250)',
      border: 'oklch(0.90 0.005 250)',
      background: 'oklch(0.985 0.002 250)'
    };
  }
  const styles = getComputedStyle(document.documentElement);
  return {
    primary: styles.getPropertyValue('--chart-1').trim() || 'oklch(0.45 0.08 250)',
    secondary: styles.getPropertyValue('--chart-2').trim() || 'oklch(0.55 0.06 250)',
    muted: styles.getPropertyValue('--muted-foreground').trim() || 'oklch(0.50 0.02 250)',
    border: styles.getPropertyValue('--border').trim() || 'oklch(0.90 0.005 250)',
    background: styles.getPropertyValue('--background').trim() || 'oklch(0.985 0.002 250)'
  };
}

export function getChartTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}
