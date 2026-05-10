"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AGENT_TEMPLATES, getTemplatesByDepartment } from "@/lib/agents/templates";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

const departments = [...new Set(AGENT_TEMPLATES.map(t => t.department))];

export default function NewAgentPage() {
  const router = useRouter();
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const templatesByDept = getTemplatesByDepartment();
  const templates = templatesByDept[selectedDept] || [];

  const handleHire = async () => {
    if (!selectedTemplate) return;
    setLoading(true);
    const template = AGENT_TEMPLATES.find(t => t.name === selectedTemplate);
    if (!template) return;
    const res = await fetch("/api/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ templateId: template.name, name: template.name }) });
    const data = await res.json();
    if (data.agent) router.push(`/agents/${data.agent.id}`);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/agents" className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-colors"><ArrowLeft size={14} /> Back to Agents</Link>
      <div>
        <h1 className="text-2xl font-bold text-white">Hire an Agent</h1>
        <p className="text-[13px] text-slate-400 mt-1">Choose from 48 pre-built AI specialists</p>
      </div>

      {/* Department tabs */}
      <div className="flex flex-wrap gap-2">
        {departments.map(dept => (
          <button key={dept} onClick={() => { setSelectedDept(dept); setSelectedTemplate(null); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border ${selectedDept === dept ? "bg-cyan/10 text-cyan border-cyan/25" : "bg-white/3 text-slate-500 border-white/5 hover:border-white/10"}`}>
            {dept}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map(t => (
          <button key={t.name} onClick={() => setSelectedTemplate(t.name)}
            className={`p-4 rounded-xl border text-left transition-all ${selectedTemplate === t.name ? "border-cyan/40 bg-cyan/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[13px] font-bold text-white">{t.name}</h3>
              <Badge variant={t.rarity as "legendary" | "epic" | "rare" | "common"}>{t.rarity}</Badge>
            </div>
            <p className="text-[11px] text-slate-400 mb-1">{t.title}</p>
            <p className="text-[10px] text-slate-500">{t.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {t.skills.slice(0, 3).map(s => <span key={s} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{s}</span>)}
            </div>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-cyan/20 bg-cyan/5">
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white">Ready to hire {selectedTemplate}?</p>
            <p className="text-[11px] text-slate-400">This agent will be available for chat and task assignment.</p>
          </div>
          <Button onClick={handleHire} disabled={loading}><Plus size={14} /> {loading ? "Hiring..." : "Hire Agent"}</Button>
        </div>
      )}
    </div>
  );
}
