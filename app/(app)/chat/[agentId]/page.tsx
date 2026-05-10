"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

interface Message { role: "user" | "assistant"; content: string; id: string; }

export default function ChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState<{ name: string; role: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/agents/${agentId}`).then(r => r.json()).then(d => {
      if (d.agent) setAgent({ name: d.agent.name, role: d.agent.role });
    });
  }, [agentId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim(), id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/agents/${agentId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { role: "assistant", content: "", id: assistantId }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              assistantContent += parsed.content;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m));
            }
          } catch {}
        }
      }
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Error: Could not reach agent.", id: "err" }]); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <Avatar name={agent?.name || "A"} size="md" />
        <div>
          <h2 className="text-[14px] font-bold text-white">{agent?.name || "Agent"}</h2>
          <p className="text-[10px] text-slate-500">{agent?.role || "Loading..."}</p>
        </div>
        {loading && <Loader2 size={14} className="text-cyan animate-spin ml-auto" />}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-[14px] text-slate-400">Start a conversation with {agent?.name || "your agent"}</p>
            <p className="text-[11px] text-slate-600 mt-1">Ask anything related to their expertise</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-cyan/20" : "bg-purple-500/20"}`}>
              {msg.role === "user" ? <User size={14} className="text-cyan" /> : <Bot size={14} className="text-purple-400" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-xl text-[13px] leading-relaxed ${msg.role === "user" ? "bg-cyan/10 text-white rounded-tr-sm" : "bg-white/5 text-slate-200 rounded-tl-sm"}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your message..." rows={1}
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-[13px] placeholder-slate-600 outline-none focus:border-cyan/50 resize-none" />
          <Button onClick={sendMessage} disabled={loading || !input.trim()} className="px-4">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
