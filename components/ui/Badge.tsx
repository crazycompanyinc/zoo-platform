interface BadgeProps { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" | "info" | "legendary" | "epic" | "rare" | "common"; className?: string; }
export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const styles: Record<string, string> = {
    default: "bg-white/10 text-slate-300",
    success: "bg-green-500/15 text-green-400",
    warning: "bg-amber-500/15 text-amber-400",
    danger: "bg-red-500/15 text-red-400",
    info: "bg-cyan/15 text-cyan",
    legendary: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    epic: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    rare: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    common: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles[variant]} ${className}`}>{children}</span>;
}
