import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, MessageSquare, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

export default async function AgentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const agents = await prisma.agent.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Agents</h1>
          <p className="text-[13px] text-slate-400 mt-1">{agents.length} agents deployed</p>
        </div>
        <Link href="/agents/new"><Button><Plus size={14} /> Hire Agent</Button></Link>
      </div>

      {agents.length === 0 ? (
        <div className="p-12 rounded-xl border border-dashed border-white/10 text-center">
          <p className="text-[14px] text-slate-400 mb-4">No agents yet. Build your AI workforce!</p>
          <Link href="/agents/new"><Button><Plus size={14} /> Hire Your First Agent</Button></Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map(agent => (
            <div key={agent.id} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan/20 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={agent.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14px] font-bold text-white truncate group-hover:text-cyan transition-colors">{agent.name}</h3>
                  <p className="text-[11px] text-slate-500 truncate">{agent.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={agent.rarity as "legendary" | "epic" | "rare" | "common"}>Lv.{agent.level}</Badge>
                    <span className="text-[9px] text-slate-600">{agent.department}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${agent.status === "WORKING" ? "bg-green-500" : agent.status === "CELEBRATING" ? "bg-cyan" : "bg-slate-600"}`} />
                <span className="text-[10px] text-slate-400 capitalize">{agent.status.toLowerCase()}</span>
                <span className="text-[10px] text-slate-600 ml-auto">{agent.completedTasks} tasks</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/chat/${agent.id}`} className="flex-1"><Button variant="secondary" size="sm" className="w-full"><MessageSquare size={12} /> Chat</Button></Link>
                <Link href={`/agents/${agent.id}`} className="flex-1"><Button variant="ghost" size="sm" className="w-full"><Settings2 size={12} /> Manage</Button></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
