"use client";
import { useState } from "react";
import { User, CreditCard, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-[13px] text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3 mb-4">
          <User size={18} className="text-cyan" />
          <h3 className="text-[14px] font-bold text-white">Profile</h3>
        </div>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          <Button onClick={() => setSaving(true)} disabled={saving}>Save Changes</Button>
        </div>
      </div>

      {/* Plan */}
      <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard size={18} className="text-cyan" />
          <h3 className="text-[14px] font-bold text-white">Plan & Billing</h3>
        </div>
        <p className="text-[12px] text-slate-400 mb-3">You are on the <span className="text-cyan font-bold">FREE</span> plan</p>
        <Button variant="secondary">Upgrade Plan</Button>
      </div>

      {/* Danger */}
      <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 size={18} className="text-red-400" />
          <h3 className="text-[14px] font-bold text-red-400">Danger Zone</h3>
        </div>
        <p className="text-[12px] text-slate-400 mb-3">Permanently delete your account and all data</p>
        <Button variant="danger">Delete Account</Button>
      </div>
    </div>
  );
}
