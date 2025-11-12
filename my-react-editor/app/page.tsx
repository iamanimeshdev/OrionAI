"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Spline from "@splinetool/react-spline";

export default function LandingPage() {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Floating Navbar */}
      <header className="absolute top-0 left-0 right-0 px-8 py-4 flex justify-between items-center z-20">
         <h1 className="text-3xl md:text-3xl font-extrabold tracking-wide drop-shadow-lg text-white">
          Orion<span className="text-purple-400">.AI</span>
        </h1>
        <nav className="space-x-4">
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
        </nav>
      </header>

      {/* Fullscreen Spline */}
      <div>
         <Spline
        scene="https://prod.spline.design/m0AuzJDQD9FkgT57/scene.splinecode" 
      />
      
      </div>

      {/* Floating Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 text-center text-sm text-gray-400 z-20">
        © {new Date().getFullYear()} Orion.AI 
      </footer>
    </div>
  );
}