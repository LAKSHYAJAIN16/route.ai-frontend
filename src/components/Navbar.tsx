import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto">
      <div className="text-2xl font-bold text-[#2d2363]">route.ai</div>
      <div className="hidden md:flex gap-10 text-base font-medium text-[#2d2363]">
        <a href="/" className="hover:text-[#5f4bb6]">Home</a>
        <a href="/signup" className="hover:text-[#5f4bb6]">Contact</a>
      </div>
      <button className="border border-[#2d2363] text-[#2d2363] px-6 py-2 rounded-full font-medium hover:bg-[#f5f4fa] transition">Sign In</button>
    </nav>
  );
} 