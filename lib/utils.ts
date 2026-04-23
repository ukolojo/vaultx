export function formatTimeAgo(blockTime: number | null | undefined): string {
  if (blockTime == null) return "—";
  const nowMs = Date.now();
  const diffMs = Math.abs(nowMs - blockTime);
  const diffSecs = diffMs / 1000;
  if (diffSecs < 3600) return "Just now";
  const diffHours = Math.floor(diffSecs / 3600);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
