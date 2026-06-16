interface VoteProgressBarProps {
  value: number; // 0–100
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export default function VoteProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "sm",
}: VoteProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const height = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className="w-full flex items-center gap-2">
      <div className={`flex-1 ${height} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} bg-nacos-green rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 font-body w-8 text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
}
