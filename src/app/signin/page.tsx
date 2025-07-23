"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function SignIn() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always redirect to /signin when the button is clicked
    router.push("/signin");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 pt-16 md:pt-20">
        <div className="w-full max-w-xl flex flex-col items-center mt-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2d1e7b] mb-2 text-center">Enter government key</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">When a government signs up they would get a special key. <br />Right now just use <span className="font-semibold text-[#7c3aed]">SHAD2025</span></p>
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <input
              type="text"
              placeholder="Your government key..."
              value={key}
              onChange={e => { setKey(e.target.value); setError(""); }}
              className="w-[320px] md:w-[592px] h-[50px] border-2 border-[#7c3aed] rounded-lg px-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition mb-2 text-black"
              style={{ boxSizing: 'border-box' }}
            />
            {error && <span className="text-red-500 text-sm mb-2">{error}</span>}
            <button
              type="submit"
              className="w-[140px] h-[40px] bg-[#7c3aed] hover:bg-[#5b21b6] text-white font-semibold rounded-lg text-lg mt-2 shadow transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 