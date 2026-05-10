import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tasks = await prisma.task.findMany({ where: { userId: s.user.id }, include: { agent: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const task = await prisma.task.create({ data: { id: crypto.randomUUID(), ...body, userId: s.user.id } });
  return NextResponse.json({ task }, { status: 201 });
}
