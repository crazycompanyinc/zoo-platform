"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); }
    else { router.push("/dashboard"); router.refresh(); }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mx-auto mb-4">
          <Zap size={28} className="text-cyan" />
        </div>
        <h1 className="text-2xl font-bold text-white">Join ZOO</h1>
        <p className="text-[13px] text-slate-400 mt-2">Start with free AI agents</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} icon={<User size={14} />} />
        <Input label="Email" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={14} />} />
        <Input label="Password" type="password" placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} icon={<Lock size={14} />} />
        {error && <p className="text-[12px] text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"} <ArrowRight size={14} />
        </Button>
      </form>
      <p className="mt-6 text-center text-[12px] text-slate-600">
        Already have an account? <Link href="/login" className="text-cyan hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
