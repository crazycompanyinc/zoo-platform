"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
interface ModalProps { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: "sm" | "md" | "lg" | "xl"; }
export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);
  if (!isOpen) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full ${sizes[size]} bg-[#0f1018] border border-white/10 rounded-2xl shadow-2xl`} onClick={e => e.stopPropagation()}>
        {title && <div className="flex items-center justify-between px-5 py-4 border-b border-white/5"><h3 className="text-[14px] font-bold text-white">{title}</h3><button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><X size={16} /></button></div>}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
