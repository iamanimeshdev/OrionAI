"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import Spline from "@splinetool/react-spline";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in user using Firebase
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Redirect to your next page after successful login
      router.push("/prompt");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 relative bg-black flex items-center justify-center">
        {/* Top-left logo */}
        <header className="absolute top-6 left-6 z-10">
          <div className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm w-max">
            <Logo />
          </div>
        </header>

        {/* Form card */}
        <div className="w-full max-w-md px-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-extrabold tracking-tight mb-6 text-white text-center">
              Welcome Back
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 placeholder:text-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white/10 text-white border-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 placeholder:text-gray-300"
                  required
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-semibold shadow-lg hover:opacity-90 transition-all"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <p className="text-sm text-gray-400 text-center mt-4">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-purple-300 hover:text-purple-200 transition-colors underline-offset-4 hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Spline Scene */}
      <div className="w-1/2 hidden md:block bg-black relative">
        <Spline scene="https://prod.spline.design/hene0jF2rxDh0jnH/scene.splinecode" />
      </div>
    </div>
  );
}
