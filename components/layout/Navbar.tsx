"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, Users, MessageSquare, KanbanSquare, Settings, LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/Avatar";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agents", label: "Agents", icon: Users },
  { href: "/kanban", label: "Kanban", icon: KanbanSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar({ userName, userImage }: { userName?: string | null; userImage?: string | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#06060a]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center group-hover:bg-cyan/15 transition-colors">
            <Zap size={16} className="text-cyan" />
          </div>
          <span className="font-bold text-white text-sm">ZOO</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all ${pathname === href ? "bg-cyan/10 text-cyan" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
              <Icon size={15} />{label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Avatar src={userImage} name={userName || "U"} size="sm" />
            <span className="text-[13px] text-slate-300">{userName || "User"}</span>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Sign out">
            <LogOut size={16} />
          </button>
          <button className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={18} />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 px-4 py-2 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] ${pathname === href ? "bg-cyan/10 text-cyan" : "text-slate-400"}`}>
              <Icon size={15} />{label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
