import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const convs = await prisma.conversation.findMany({
    where: { userId: s.user.id },
    include: { agent: { select: { id: true, name: true } }, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ conversations: convs });
}

export async function POST(req: NextRequest) {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const conv = await prisma.conversation.create({ data: { id: crypto.randomUUID(), userId: s.user.id, agentId: body.agentId, title: body.title } });
  return NextResponse.json({ conversation: conv }, { status: 201 });
}
