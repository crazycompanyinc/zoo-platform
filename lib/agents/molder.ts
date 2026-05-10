import { prisma } from "@/lib/prisma";

interface MoldInstructions {
  personality?: string;
  customInstructions?: string;
  skills?: string[];
  tools?: string[];
  temperature?: number;
  maxTokens?: number;
}

export async function moldAgent(agentId: string, userId: string, instructions: MoldInstructions) {
  const agent = await prisma.agent.findFirst({ where: { id: agentId, userId } });
  if (!agent) throw new Error("Agent not found");

  const updates: Record<string, unknown> = {};

  if (instructions.personality) {
    const existing = JSON.parse(agent.personality || "{}");
    updates.personality = JSON.stringify({ ...existing, custom: instructions.personality });
  }

  if (instructions.customInstructions) {
    updates.customInstructions = instructions.customInstructions;
    updates.systemPrompt = (agent.systemPrompt || "") + "\n\n--- CUSTOM INSTRUCTIONS ---\n" + instructions.customInstructions;
  }

  if (instructions.skills) updates.skills = JSON.stringify(instructions.skills);
  if (instructions.tools) updates.tools = JSON.stringify(instructions.tools);
  if (instructions.temperature !== undefined) updates.temperature = instructions.temperature;
  if (instructions.maxTokens !== undefined) updates.maxTokens = instructions.maxTokens;

  return (prisma as any).agent.update({ where: { id: agentId }, data: updates });
}
