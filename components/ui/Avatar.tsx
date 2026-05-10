interface AvatarProps { src?: string | null; name: string; size?: "sm" | "md" | "lg"; className?: string; }
export function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const sizes = { sm: "w-6 h-6 text-[10px]", md: "w-8 h-8 text-xs", lg: "w-12 h-12 text-sm" };
  const colors = ["bg-cyan/20 text-cyan", "bg-purple-500/20 text-purple-400", "bg-amber-500/20 text-amber-400", "bg-green-500/20 text-green-400", "bg-pink-500/20 text-pink-400"];
  const colorIdx = name.charCodeAt(0) % colors.length;
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
  return <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold ${colors[colorIdx]} ${className}`}>{name.charAt(0).toUpperCase()}</div>;
}
