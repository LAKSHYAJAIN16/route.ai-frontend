import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomePage = pathname === '/';
  
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-900/90 backdrop-blur-sm border-b border-purple-500/20">
      <nav className="flex items-center justify-between px-4 md:px-8 py-1 md:py-2 w-full max-w-7xl mx-auto relative">
        <a href="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-all duration-300 transform hover:scale-105">
          route.ai
        </a>
        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 text-base font-medium text-white items-center">
          <a href="/" className="cursor-pointer hover:text-purple-300 transition-all duration-300">
            Home
          </a>
          <a href="/mobile" className="cursor-pointer hover:text-purple-300 transition-all duration-300">
            Mobile
          </a>
          <a href="/signup" className="cursor-pointer hover:text-purple-300 transition-all duration-300">
            Contact
          </a>
        </div>
        <button
          className="hidden cursor-pointer  md:block border border-white text-white px-6 py-2 rounded-full font-medium hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 relative overflow-hidden group"
          onClick={() => router.push('/signin')}
        >
          <span className="relative z-10">Sign In</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom delay-75"></div>
        </button>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/10 transform hover:scale-110"
          aria-label="Open menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <div className="relative w-7 h-7">
            <span className={`absolute top-0 left-0 w-7 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`absolute top-2 left-0 w-7 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`absolute top-4 left-0 w-7 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-800/90 backdrop-blur-sm shadow-lg rounded-b-xl flex flex-col items-center py-4 gap-4 md:hidden z-50 border border-purple-500/20">
            <a href="/" className="w-full text-center py-2 text-base font-medium text-white hover:text-purple-300 transition-all duration-300" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="/mobile" className="w-full text-center py-2 text-base font-medium text-white hover:text-purple-300 transition-all duration-300" onClick={() => setMenuOpen(false)}>Mobile</a>
            <a href="/signup" className="w-full text-center py-2 text-base font-medium text-white hover:text-purple-300 transition-all duration-300" onClick={() => setMenuOpen(false)}>Contact</a>
            <button
              className="w-[90%] border border-white text-white px-6 py-2 rounded-full font-medium hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              onClick={() => { setMenuOpen(false); router.push('/signin'); }}
            >
              Sign In
            </button>
          </div>
        )}
      </nav>
      {/* Animated Line */}
      <div className="relative w-full h-1 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-size-200 animate-gradient-x opacity-30"></div>
      </div>
    </div>
  );
} 