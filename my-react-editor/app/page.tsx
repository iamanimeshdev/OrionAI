"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Spline from "@splinetool/react-spline";
import { useAuth } from "@/lib/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/Firebase";
import { Loader2, Menu, X } from "lucide-react";

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Loading Overlay — shown until Spline is ready */}
      {!splineLoaded && (
        <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-white">
            Orion<span className="text-purple-400">.AI</span>
          </h1>
          <Loader2 className="animate-spin text-purple-400" size={32} />
          <p className="text-gray-400 text-sm">Loading experience...</p>
        </div>
      )}

      {/* Floating Navbar */}
      <header className="absolute top-0 left-0 right-0 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center z-20">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow-lg text-white">
          Orion<span className="text-purple-400">.AI</span>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center space-x-3 md:space-x-4">
          {authLoading ? (
            <Loader2 className="animate-spin text-white inline" size={20} />
          ) : user ? (
            <>
              <Link href="/prompt">
                <Button className="bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80 text-sm md:text-base">
                  Go to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 text-sm md:text-base"
                onClick={() => signOut(auth)}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="bg-amber-50 border-white/20 hover:bg-blue-300 text-sm md:text-base">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80 text-sm md:text-base">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="sm:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 z-20 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 py-4 sm:hidden">
          <nav className="flex flex-col space-y-3">
            {authLoading ? (
              <Loader2 className="animate-spin text-white mx-auto" size={20} />
            ) : user ? (
              <>
                <Link href="/prompt" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    signOut(auth);
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-amber-50 border-white/20 hover:bg-blue-300">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-purple-600/80 backdrop-blur-sm hover:bg-purple-700/80">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Fullscreen Spline */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/m0AuzJDQD9FkgT57/scene.splinecode"
          onLoad={() => setSplineLoaded(true)}
        />
      </div>

      {/* Floating Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-400 z-20">
        © {new Date().getFullYear()} Orion.AI
      </footer>
    </div>
  );
}