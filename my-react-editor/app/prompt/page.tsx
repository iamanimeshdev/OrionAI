"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Zap } from "lucide-react";

import ProtectedRoute from "@/components/ProtectedRoute";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function PromptPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [rateLimit, setRateLimit] = useState<number>(3);
  const router = useRouter();

  // Fetch rate limit status on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/rate-limit-status`)
      .then((res) => res.json())
      .then((data) => {
        setRemaining(data.remaining);
        setRateLimit(data.limit);
      })
      .catch(() => {
        // If backend is sleeping, just show default
        setRemaining(3);
      });
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (remaining !== null && remaining <= 0) return;
    setLoading(true);
    setTimeout(() => {
      router.push(`/editor?prompt=${encodeURIComponent(input)}`);
    }, 600);
  };

  const isLimitReached = remaining !== null && remaining <= 0;

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen text-white flex items-center justify-center px-6 overflow-hidden">
        {/* 🌌 Glowing Ellipses */}
        <div className="absolute inset-0 -z-10 flex items-end justify-center overflow-hidden bg-black">
          {/* Planet Horizon Glow */}
          <div className="w-[220%] h-[65%] rounded-[50%] bg-gradient-to-t from-[#0f1d3a] via-[#1e3a8a]/70 to-transparent opacity-80 blur-3xl" />

          {/* Bright Edge Rim */}
          <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-white to-blue-500 opacity-80 blur-[1px]" />

          {/* Soft Outer Aura */}
          <div className="absolute bottom-0 w-[150%] h-[40%] rounded-[50%] bg-gradient-to-t from-blue-800/40 via-blue-600/20 to-transparent blur-3xl opacity-60" />
        </div>
        {/* ⚡ Main Content */}
        <div className="w-full max-w-3xl text-center space-y-10">
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-wide drop-shadow-lg">
            Orion<span className="text-purple-400">.AI</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-200 font-light tracking-tight">
            Describe your vision. We'll <span className="font-semibold text-pink-400">build it</span>.
          </p>

          {/* Rate Limit Badge */}
          {remaining !== null && (
            <div className="flex justify-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border ${isLimitReached
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-purple-500/10 border-purple-500/30 text-purple-300"
                }`}>
                <Zap size={14} />
                {isLimitReached
                  ? "No generations left today"
                  : `${remaining}/${rateLimit} generations remaining today`}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="🚀 e.g. Make a beautiful landing page for coffee shop with dark mode"
              disabled={isLimitReached}
              className="min-h-[160px] text-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50"
            />

            <Button
              onClick={handleSubmit}
              disabled={loading || !input.trim() || isLimitReached}
              size="lg"
              className="w-full h-16 text-xl font-semibold tracking-wide bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:opacity-90 disabled:opacity-40"
            >
              {loading ? (
                <span className="inline-flex items-center gap-3">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating...
                </span>
              ) : isLimitReached ? (
                "Rate Limit Reached — Try Again Tomorrow"
              ) : (
                <span className="inline-flex items-center gap-3">
                  Generate App <ArrowRight className="w-7 h-7" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
