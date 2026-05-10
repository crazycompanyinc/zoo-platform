import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Zap, TrendingUp, CheckCircle2, Plus, ArrowRight, Activity } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const uid = session.user.id;

  const [agents, stats, recentTasks, recentActivity] = await Promise.all([
    prisma.agent.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.agent.aggregate({ where: { userId: uid }, _count: true, _sum: { xp: true } }),
    prisma.task.findMany({ where: { userId: uid }, orderBy: { updatedAt: "desc" }, take: 5, include: { agent: { select: { name: true } } } }),
    prisma.activityLog.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  const activeAgents = await prisma.agent.count({ where: { userId: uid, status: "WORKING" } });
  const doneTasks = await prisma.task.count({ where: { userId: uid, status: "DONE" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[13px] text-slate-400 mt-1">Welcome back, {session.user.name}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "AI Agents", value: stats._count, icon: Users, color: "#00e5ff", sub: `${activeAgents} active` },
          { label: "Total XP", value: (stats._sum.xp || 0).toLocaleString(), icon: Zap, color: "#f59e0b", sub: "Across all agents" },
          { label: "Tasks Done", value: doneTasks, icon: CheckCircle2, color: "#22c55e", sub: `${recentTasks.length} recent` },
          { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "#a855f7", sub: "24/7 availability" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
            <div className="flex items-center justify-between mb-3">
              <s.icon size={18} style={{ color: s.color }} />
              <span className="text-[10px] text-slate-500">{s.sub}</span>
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Agents section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-white">Your Agents</h2>
          <Link href="/agents" className="text-[12px] text-cyan hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
        </div>
        {agents.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-white/10 text-center">
            <Users size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-[14px] text-slate-400 mb-4">No agents yet. Hire your first AI agent!</p>
            <Link href="/agents/new"><Button><Plus size={14} /> Hire Your First Agent</Button></Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map(agent => (
              <Link key={agent.id} href={`/agents/${agent.id}`} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan/20 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={agent.name} size="md" />
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold text-white truncate group-hover:text-cyan transition-colors">{agent.name}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={agent.rarity as "legendary" | "epic" | "rare" | "common"}>Lv.{agent.level}</Badge>
                  <span className="text-[10px] text-slate-500">{agent.department}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-[15px] font-bold text-white mb-4">Recent Tasks</h2>
          <div className="space-y-2">
            {recentTasks.length === 0 ? <p className="text-[12px] text-slate-600">No tasks yet</p> : recentTasks.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <div className="min-w-0">
                  <p className="text-[12px] text-white truncate">{t.title}</p>
                  <p className="text-[10px] text-slate-500">{t.agent?.name || "Unassigned"}</p>
                </div>
                <Badge variant={t.status === "DONE" ? "success" : t.status === "IN_PROGRESS" ? "info" : "default"}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-white mb-4">Activity Feed</h2>
          <div className="space-y-2">
            {recentActivity.length === 0 ? <p className="text-[12px] text-slate-600">No activity yet</p> : recentActivity.map(a => (
              <div key={a.id} className="flex items-center gap-2 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <Activity size={12} className="text-cyan shrink-0" />
                <p className="text-[11px] text-slate-300 truncate">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
