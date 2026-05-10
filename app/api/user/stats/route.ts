import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = s.user.id;
  const [agentCount, activeAgents, totalXp, taskStats, recentActivity] = await Promise.all([
    prisma.agent.count({ where: { userId: uid } }),
    prisma.agent.count({ where: { userId: uid, status: "WORKING" } }),
    prisma.agent.aggregate({ where: { userId: uid }, _sum: { xp: true } }),
    prisma.task.groupBy({ by: ["status"], where: { userId: uid }, _count: true }),
    prisma.activityLog.findMany({ where: { userId: uid }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);
  return NextResponse.json({ agentCount, activeAgents, totalXp: totalXp._sum.xp || 0, taskStats, recentActivity });
}
