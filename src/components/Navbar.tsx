import React from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto">
      <a href="/" className="text-2xl font-bold text-[#2d2363] hover:text-[#5f4bb6]">route.ai</a>
      <div className="hidden md:flex gap-10 text-base font-medium text-[#2d2363] items-center">
        <a href="/" className="hover:text-[#5f4bb6]">Home</a>
        <a href="/mobile" className="hover:text-[#5f4bb6]">Mobile</a>
        <a href="/signup" className="hover:text-[#5f4bb6]">Contact</a>
      </div>
      <button
        className="border border-[#2d2363] text-[#2d2363] px-6 py-2 rounded-full font-medium hover:bg-[#f5f4fa] transition cursor-pointer"
        onClick={() => router.push('/signin')}
      >
        Sign In
      </button>
    </nav>
  );
} 