export function getStreakEmoji(streak: number): string {
  if (streak >= 365) return "🏆";
  if (streak >= 100) return "💯";
  if (streak >= 30) return "⚡";
  if (streak >= 7) return "🔥";
  if (streak >= 3) return "✨";
  return "🌱";
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "Day 1 — great start!";
  if (streak < 7) return `${streak} days — keep going!`;
  if (streak < 30) return `${streak} days — you're on fire!`;
  if (streak < 100) return `${streak} days — incredible consistency!`;
  return `${streak} days — legendary! 🏆`;
}

export function getNextMilestone(streak: number): number {
  const milestones = [3, 7, 14, 30, 60, 100, 200, 365];
  return milestones.find(m => m > streak) ?? 365;
}
