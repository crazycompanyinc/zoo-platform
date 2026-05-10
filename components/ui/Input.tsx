import { forwardRef, type InputHTMLAttributes } from "react";
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: React.ReactNode; }
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = "", ...props }, ref) => (
  <div className="space-y-1">
    {label && <label className="block text-[12px] font-medium text-slate-400">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>}
      <input ref={ref} className={`w-full ${icon ? "pl-9" : "px-3"} py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-600 outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20 transition-all ${error ? "border-red-500/50" : ""} ${className}`} {...props} />
    </div>
    {error && <p className="text-[10px] text-red-400">{error}</p>}
  </div>
));
Input.displayName = "Input";
