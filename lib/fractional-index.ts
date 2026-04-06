// Generates order values between two tasks for drag-and-drop
export function generateOrderBetween(prev: number | null, next: number | null): number {
  if (prev === null && next === null) return 1000;
  if (prev === null) return next! / 2;
  if (next === null) return prev + 1000;
  return (prev + next) / 2;
}