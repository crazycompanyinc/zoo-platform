import { prisma } from "@/lib/prisma";
import { AGENT_TEMPLATES } from "./templates";

export async function createAgentFromTemplate(userId: string, templateId: string, customizations?: Record<string, unknown>) {
  const template = AGENT_TEMPLATES.find(t => t.name.toLowerCase().replace(/\s+/g, "-") === templateId || t.name === templateId);
  if (!template) throw new Error("Template not found");

  const skillsList = Array.isArray(template.skills) ? template.skills.filter(s => typeof s === "string") : [];
  const toolsList = Array.isArray(template.tools) ? template.tools.filter(t => typeof t === "string") : [];
  const abilities = [
    { id: "ab-1", name: "Quick Analysis", description: "Rapid situation assessment", icon: "⚡", cooldown: 30, power: 25 },
    { id: "ab-2", name: "Deep Dive", description: "Thorough investigation mode", icon: "🔍", cooldown: 60, power: 40 },
  ];

  return (prisma as any).agent.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      templateId: template.name,
      name: template.name,
      title: template.title || "",
      role: template.role,
      department: template.department,
      model: template.model,
      systemPrompt: template.systemPrompt || "",
      temperature: template.temperature,
      maxTokens: template.maxTokens,
      skills: JSON.stringify(skillsList),
      tools: JSON.stringify(toolsList),
      element: template.element || "tech",
      rarity: template.rarity || "common",
      abilities: JSON.stringify(abilities),
      personality: "{}",
      ...customizations,
    },
  });
}
