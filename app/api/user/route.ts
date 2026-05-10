import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: s.user.id }, select: { id: true, email: true, name: true, image: true, tier: true, tokensUsed: true, tokensLimit: true, credits: true, createdAt: true } });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const user = await prisma.user.update({ where: { id: s.user.id }, data: { name: body.name, image: body.image } });
  return NextResponse.json({ user });
}
