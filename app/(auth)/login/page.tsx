"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) { setError("Invalid credentials"); setLoading(false); }
    else { router.push("/dashboard"); router.refresh(); }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center mx-auto mb-4">
          <Zap size={28} className="text-cyan" />
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome to ZOO</h1>
        <p className="text-[13px] text-slate-400 mt-2">AI agents that work for you 24/7</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={14} />} />
        <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} icon={<Lock size={14} />} />
        {error && <p className="text-[12px] text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"} <ArrowRight size={14} />
        </Button>
      </form>
      <div className="mt-4 text-center">
        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-all">
          Continue with Google
        </button>
      </div>
      <p className="mt-6 text-center text-[12px] text-slate-600">
        Don&apos;t have an account? <Link href="/register" className="text-cyan hover:underline">Sign up free</Link>
      </p>
    </div>
  );
}
