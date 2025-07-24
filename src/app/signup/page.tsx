"use client";
import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar';

export default function Signup() {
  useEffect(() => {
    document.title = "Sign Up";
    const link = document.querySelector("link[rel~='icon']");
    if (link) (link as HTMLLinkElement).href = "/favicon.ico";
  }, []);
  const [form, setForm] = useState({ email: "", location: "", population: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Add form submission logic here
  };

  return (
    <>
      <title>Sign Up</title>
      <link rel="icon" href="/favicon.ico" />
      <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 relative mt-4">
        <div className="text-xs tracking-widest text-[#b0b0b0] mb-2">GOVERNMENT SIGNUP</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2d2363] mb-3 leading-tight">
          <span
            className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent relative font-extrabold shimmer-gradient"
            style={{
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              filter: 'brightness(1.2)'
            }}
          >
            Level up your transit service
          </span><br />
          with route.ai
        </h1>

        {/* Interest Form */}
        <div className="w-full max-w-2xl mt-10">
          <h2 className="text-2xl font-bold text-[#2d2363] mb-6 text-left md:text-center">Interest form</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center bg-[#f7f6fa] px-4 py-4 rounded">
              <label className="w-full md:w-1/4 text-left text-[#2d2363] font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email here...."
                className="flex-1 bg-transparent outline-none px-2 py-1 text-[#2d2363]"
              />
              <span className="w-full md:w-1/4 text-right text-xs text-[#5f4bb6]">*required</span>
            </div>
            <div className="flex flex-col md:flex-row items-center bg-[#f7f6fa] px-4 py-4 rounded">
              <label className="w-full md:w-1/4 text-left text-[#2d2363] font-medium">Location</label>
              <input
                type="text"
                name="location"
                required
                value={form.location}
                onChange={handleChange}
                placeholder="Enter city / town here......."
                className="flex-1 bg-transparent outline-none px-2 py-1 text-[#2d2363]"
              />
              <span className="w-full md:w-1/4 text-right text-xs text-[#5f4bb6]">*required</span>
            </div>
            <div className="flex flex-col md:flex-row items-center bg-[#f7f6fa] px-4 py-4 rounded">
              <label className="w-full md:w-1/4 text-left text-[#2d2363] font-medium">Town population</label>
              <input
                type="number"
                name="population"
                required
                value={form.population}
                onChange={handleChange}
                placeholder="Enter town population here......."
                className="flex-1 bg-transparent outline-none px-2 py-1 text-[#2d2363]"
              />
              <span className="w-full md:w-1/4 text-right text-xs text-[#5f4bb6]">*required</span>
            </div>
            <button
              type="submit"
              className="mt-6 mx-auto bg-[#5f4bb6] hover:bg-[#2d2363] text-white font-semibold px-8 py-2 rounded-full text-lg shadow-md transition"
            >
              Submit
            </button>
            {submitted && (
              <div className="text-green-600 text-center mt-2">Thank you for your interest!</div>
            )}
          </form>
        </div>
      </section>
    </div>
    </>
  );
} 