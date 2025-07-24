import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 w-full max-w-7xl mx-auto relative z-50">
      <a href="/" className="text-2xl font-bold text-[#2d2363] hover:text-[#5f4bb6]">route.ai</a>
      {/* Desktop Links */}
      <div className="hidden md:flex gap-10 text-base font-medium text-[#2d2363] items-center">
        <a href="/" className="hover:text-[#5f4bb6]">Home</a>
        <a href="/mobile" className="hover:text-[#5f4bb6]">Mobile</a>
        <a href="/signup" className="hover:text-[#5f4bb6]">Contact</a>
      </div>
      <button
        className="hidden md:block border border-[#2d2363] text-[#2d2363] px-6 py-2 rounded-full font-medium hover:bg-[#f5f4fa] transition cursor-pointer"
        onClick={() => router.push('/signin')}
      >
        Sign In
      </button>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5f4bb6]"
        aria-label="Open menu"
        onClick={() => setMenuOpen(v => !v)}
      >
        <svg className="w-7 h-7 text-[#2d2363]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl flex flex-col items-center py-4 gap-4 md:hidden animate-fade-in z-50">
          <a href="/" className="w-full text-center py-2 text-base font-medium text-[#2d2363] hover:text-[#5f4bb6]" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/mobile" className="w-full text-center py-2 text-base font-medium text-[#2d2363] hover:text-[#5f4bb6]" onClick={() => setMenuOpen(false)}>Mobile</a>
          <a href="/signup" className="w-full text-center py-2 text-base font-medium text-[#2d2363] hover:text-[#5f4bb6]" onClick={() => setMenuOpen(false)}>Contact</a>
          <button
            className="w-[90%] border border-[#2d2363] text-[#2d2363] px-6 py-2 rounded-full font-medium hover:bg-[#f5f4fa] transition cursor-pointer"
            onClick={() => { setMenuOpen(false); router.push('/signin'); }}
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
} 