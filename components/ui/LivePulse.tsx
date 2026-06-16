export default function LivePulse({
  color = "green",
  label = "LIVE",
}: {
  color?: "green" | "red";
  label?: string;
}) {
  const colors = {
    green: {
      dot: "bg-nacos-green",
      ring: "bg-nacos-green/30",
      text: "text-nacos-green",
      bg: "bg-nacos-green/10",
      border: "border-nacos-green/20",
    },
    red: {
      dot: "bg-red-500",
      ring: "bg-red-400/30",
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };

  const c = colors[color];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-body uppercase tracking-wider ${c.bg} ${c.text} border ${c.border}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${c.ring} live-pulse`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${c.dot}`}
        />
      </span>
      {label}
    </span>
  );
}
