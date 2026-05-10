import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const { id: agentId } = await params;
  const body = await req.json();
  const { message, conversationId } = body;
  const agent = await prisma.agent.findFirst({ where: { id: agentId, userId: session.user.id } });
  if (!agent) return new Response("Not found", { status: 404 });
  let convId = conversationId;
  if (!convId) {
    const conv = await prisma.conversation.create({ data: { id: crypto.randomUUID(), userId: session.user.id, agentId, title: message.slice(0, 50) } });
    convId = conv.id;
  }
  await prisma.message.create({ data: { id: crypto.randomUUID(), conversationId: convId, role: "user", content: message } });
  const msgs = await prisma.message.findMany({ where: { conversationId: convId }, orderBy: { createdAt: "asc" }, take: 20 });
  const aiMessages = [
    { role: "system", content: agent.systemPrompt || "You are a helpful AI assistant." },
    ...msgs.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
  ];
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "HTTP-Referer": process.env.NEXTAUTH_URL || "" },
          body: JSON.stringify({ model: agent.model, messages: aiMessages, stream: true, temperature: agent.temperature, max_tokens: agent.maxTokens }),
        });
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");
        const decoder = new TextDecoder();
        let full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = decoder.decode(value).split("\n").filter((l: string) => l.startsWith("data: "));
          for (const line of lines) {
            const d = line.replace("data: ", "");
            if (d === "[DONE]") continue;
            try { const p = JSON.parse(d); const c = p.choices?.[0]?.delta?.content || ""; if (c) { full += c; controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: c })}\n\n`)); } } catch {}
          }
        }
        await prisma.message.create({ data: { id: crypto.randomUUID(), conversationId: convId, role: "assistant", content: full } });
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (e) { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(e) })}\n\n`)); controller.close(); }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}
