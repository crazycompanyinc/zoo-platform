import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const agents = await prisma.agent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { templateId, name, customizations } = body;
  const template = await prisma.agentTemplate.findUnique({ where: { id: templateId } });
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  const agent = await prisma.agent.create({
    data: {
      id: crypto.randomUUID(),
      userId: session.user.id,
      templateId: template.id,
      name: name || template.name,
      title: template.title,
      role: template.role,
      department: template.department,
      model: template.model || "openrouter/owl-alpha",
      systemPrompt: template.systemPrompt,
      temperature: template.temperature,
      maxTokens: template.maxTokens,
      skills: template.defaultSkills || "[]",
      tools: template.defaultTools || "[]",
      element: template.element || "tech",
      abilities: "[]",
      personality: "{}",
      ...customizations,
    },
  });
  return NextResponse.json({ agent }, { status: 201 });
}
