import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const s = await auth();
  if (!s?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const msgs = await prisma.message.findMany({ where: { conversationId: id }, orderBy: { createdAt: "asc" }, take: limit });
  return NextResponse.json({ messages: msgs });
}
