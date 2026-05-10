import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Settings2, ArrowLeft, Zap, Heart, Shield, Wind, Star, Sword } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;
  const agent = await prisma.agent.findFirst({ where: { id, userId: session.user.id } });
  if (!agent) notFound();

  const tasks = await prisma.task.findMany({ where: { agentId: id }, orderBy: { createdAt: "desc" }, take: 5 });
  const conversations = await prisma.conversation.findMany({ where: { agentId: id }, orderBy: { updatedAt: "desc" }, take: 3 });

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/agents" className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-white"><ArrowLeft size={14} /> Back</Link>

      <div className="flex items-start gap-5 p-6 rounded-xl border border-white/5 bg-white/[0.02]">
        <Avatar name={agent.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-white">{agent.name}</h1>
            <Badge variant={agent.rarity as "legendary" | "epic" | "rare" | "common"}>{agent.rarity}</Badge>
          </div>
          <p className="text-[13px] text-slate-400 mb-2">{agent.title} · {agent.role}</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><Zap size={10} className="text-amber-400" /> Lv.{agent.level}</span>
            <span className="flex items-center gap-1"><Star size={10} className="text-cyan" /> {agent.xp} XP</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-400" /> {agent.completedTasks} tasks</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/chat/${agent.id}`}><Button><MessageSquare size={14} /> Chat</Button></Link>
          <Link href={`/agents/${agent.id}/mold`}><Button variant="secondary"><Settings2 size={14} /> Mold</Button></Link>
        </div>
      </div>

      {/* RPG Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "HP", value: agent.hp, max: agent.maxHp, color: "#22c55e", icon: Heart },
          { label: "Energy", value: agent.energy, max: agent.maxEnergy, color: "#0ea5e9", icon: Zap },
          { label: "Attack", value: agent.attack, max: 100, color: "#ef4444", icon: Sword },
          { label: "Defense", value: agent.defense, max: 100, color: "#3b82f6", icon: Shield },
        ].map(stat => (
          <div key={stat.label} className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">{stat.label}</span>
              <stat.icon size={12} style={{ color: stat.color }} />
            </div>
            <div className="text-[15px] font-bold text-white">{stat.value}<span className="text-[10px] text-slate-600">/{stat.max}</span></div>
            <div className="mt-1.5 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(stat.value / stat.max) * 100}%`, background: stat.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Skills & Tools */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <h3 className="text-[12px] font-bold text-white mb-3">Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {JSON.parse(agent.skills || "[]").map((s: string) => <span key={s} className="text-[10px] px-2 py-1 rounded-md bg-cyan/10 text-cyan">{s}</span>)}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
          <h3 className="text-[12px] font-bold text-white mb-3">Tools</h3>
          <div className="flex flex-wrap gap-1.5">
            {JSON.parse(agent.tools || "[]").map((t: string) => <span key={t} className="text-[10px] px-2 py-1 rounded-md bg-purple-500/10 text-purple-400">{t}</span>)}
          </div>
        </div>
      </div>

      {/* Recent tasks */}
      <div>
        <h3 className="text-[13px] font-bold text-white mb-3">Recent Tasks</h3>
        {tasks.length === 0 ? <p className="text-[12px] text-slate-600">No tasks assigned yet</p> : (
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <p className="text-[12px] text-white truncate">{t.title}</p>
                <Badge variant={t.status === "DONE" ? "success" : t.status === "IN_PROGRESS" ? "info" : "default"}>{t.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
