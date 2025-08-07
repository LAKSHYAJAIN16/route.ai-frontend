"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function SignIn() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === "SHAD2025") {
      router.push("/dashboard");
    } else {
      setError("Invalid government key. Please try again.");
    }
  };

  return (
    <>
      <title>Sign In</title>
      <link rel="icon" href="/favicon.ico" />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center px-2 sm:px-4 pt-12 sm:pt-16 md:pt-20 w-full">
          <div className="w-[100%] flex flex-col items-center mt-0">
            <h1 className="text-2xl sm:text-3xl md:text-7xl font-extrabold text-white mb-2 text-center w-full">Enter your government key</h1>
            <p className="text-xs sm:text-sm text-white mb-6 text-center">When a government signs up they would get a special key. <br />To demo, just use <span className="font-semibold text-[#7c3aed]">SHAD2025</span></p>
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-2">  
              <input
                type="text"
                placeholder="Your government key..."
                value={key}
                onChange={e => { setKey(e.target.value); setError(""); }}
                className="text-white w-full max-w-xs sm:max-w-md h-12 border-2 border-[#7c3aed] rounded-lg px-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed] transition mb-1" 
                style={{ boxSizing: 'border-box' }}
              />
              {error && <span className="text-red-500 text-sm mb-2">{error}</span>}
              <button
                type="submit"
                className="cursor-pointer w-full max-w-[140px] h-10 bg-[#7c3aed] hover:bg-[#5b21b6] text-white font-semibold rounded-lg text-base sm:text-lg mt-2 shadow transition"
              >
                Sign In
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
} 