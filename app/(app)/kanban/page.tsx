import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function KanbanPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    include: { agent: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const columns = [
    { id: "backlog", title: "Backlog", color: "#64748b" },
    { id: "planning", title: "Planning", color: "#3b82f6" },
    { id: "in-progress", title: "In Progress", color: "#00e5ff" },
    { id: "review", title: "Review", color: "#eab308" },
    { id: "qa", title: "QA", color: "#a855f7" },
    { id: "done", title: "Done", color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Board</h1>
          <p className="text-[13px] text-slate-400 mt-1">{tasks.length} tasks total</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const colTasks = tasks.filter(t => (t.kanbanColumn || "backlog") === col.id);
          return (
            <div key={col.id} className="min-w-[240px] flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">{col.title}</h3>
                <span className="text-[9px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{colTasks.length}</span>
              </div>
              <div className="space-y-2">
                {colTasks.length === 0 ? (
                  <div className="p-4 rounded-lg border border-dashed border-white/5 text-center">
                    <p className="text-[10px] text-slate-600">No tasks</p>
                  </div>
                ) : colTasks.map(task => (
                  <div key={task.id} className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                    <p className="text-[11px] text-white font-medium mb-1">{task.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500">{task.agent?.name || "Unassigned"}</span>
                      <span className={`text-[8px] px-1 py-0.5 rounded ${task.priority === "CRITICAL" ? "bg-red-500/20 text-red-400" : task.priority === "HIGH" ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-slate-400"}`}>{task.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
