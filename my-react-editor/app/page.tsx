"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Spline from "@splinetool/react-spline";
import { useAuth } from "@/lib/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/Firebase";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();
  const [splineLoaded, setSplineLoaded] = useState(false);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Loading Overlay — shown until Spline is ready */}
      {!splineLoaded && (
        <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-white">
            Orion<span className="text-purple-400">.AI</span>
          </h1>
          <Loader2 className="animate-spin text-purple-400" size={32} />
          <p className="text-gray-400 text-sm">Loading experience...</p>
        </div>
      )}

      {/* Floating Navbar */}
      <header className="absolute top-0 left-0 right-0 px-8 py-4 flex justify-between items-center z-20">
        <h1 className="text-3xl md:text-3xl font-extrabold tracking-wide drop-shadow-lg text-white">
          Orion<span className="text-purple-400">.AI</span>
        </h1>
        <nav className="space-x-4">
          {authLoading ? (
            <Loader2 className="animate-spin text-white inline" size={20} />
          ) : user ? (
            <>
              <Link href="/prompt">
                <Button className="bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80">
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/10"
                onClick={() => signOut(auth)}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="bg-amber-50 border-white/20 hover:bg-blue-300 color-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Fullscreen Spline */}
      <div>
        <Spline
          scene="https://prod.spline.design/m0AuzJDQD9FkgT57/scene.splinecode"
          onLoad={() => setSplineLoaded(true)}
        />
      </div>

      {/* Floating Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-400 z-20">
        © {new Date().getFullYear()} Orion.AI
      </footer>
    </div>
  );
}