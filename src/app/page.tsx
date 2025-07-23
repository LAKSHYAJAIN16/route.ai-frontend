"use client";

import Image from "next/image";
import Navbar from '../components/Navbar';
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  useEffect(() => {
    document.title = "The future of public transit";
    const link = document.querySelector("link[rel~='icon']");
    if (link) (link as HTMLLinkElement).href = "/favicon.ico";
  }, []);
  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 relative pt-8 pb-0 md:pb-8">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative z-50">
            <h1
              className="text-4xl md:text-5xl text-[#1E0E62] mb-2 md:mb-3 font-semibold"
              style={{ lineHeight: '52px', letterSpacing: '-0.4px' }}
            >
              The <span
                className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent relative font-extrabold shimmer-gradient"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  filter: 'brightness(1.2)'
                }}
              >
                future
              </span> of public transit is here.
            </h1>
          </div>
          <p className="text-lg md:text-xl text-[#404040] mb-6 md:mb-7">You ride the bus. We make it better.</p>
          <a href="/signup" className="bg-[#7c3aed] hover:bg-[#5b21b6] text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg transition mb-0 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-opacity-50">Contact Us</a>

          {/* Showcase Section */}
          <div className="flex flex-col items-center -mt-4">
            <div className="relative flex items-end justify-center w-[850px] h-[520px] max-w-full">
              {/* Ellipse Images for Gradient Effect - Absolute Positioned for Visual Blend */}
              <div className="absolute inset-0 w-full h-full z-0 pointer-events-none top-[-30%]">
                <Image
                  src="/Ellipse.png" // Red (left)
                  alt="Ellipse 1"
                  width={1200}
                  height={1200}
                  className="absolute left-[-18%] opacity-90 select-none"
                />
                <Image
                  src="/Ellipse (1).png" // Blue (center-top)
                  alt="Ellipse 2"
                  width={1200}
                  height={1200}
                  className="absolute left-[30%] opacity-80 select-none"
                  priority
                />
                <Image
                  src="/Ellipse (2).png" // Green (right)
                  alt="Ellipse 3"
                  width={1200}
                  height={1200}
                  className="absolute right-[-15%] opacity-80 select-none"
                  priority
                />
              </div>
              {/* Laptop frame - base layer */}
              <div className="absolute left-1/2 top-[18%] w-[676px] h-[416px] -translate-x-1/2 z-20 select-none">
                <Image
                  src="/laptop-frame.png"
                  alt="Laptop frame"
                  fill
                  style={{objectFit: 'contain'}}
                  className="drop-shadow-xl"
                  priority
                />
              </div>
              {/* Laptop content (dashboard) - ON TOP of the frame, visually clipped to screen area */}
              <div className="absolute left-1/2 top-[18%] w-[520px] h-[340px] -translate-x-1/2 mt-[32px] z-30 overflow-hidden rounded-[3px] shadow-lg" style={{boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}>
                <Image
                  src="/laptop-content.png"
                  alt="Dashboard screenshot"
                  style={{objectFit: 'cover'}}
                  fill
                  priority
                />
              </div>
              {/* Mobile frame and content - fully on top, bottom of phone aligned with bottom of laptop */}
              <div className="absolute left-1/2 top-[18%] w-[676px] h-[416px] -translate-x-1/2 z-40 pointer-events-none select-none">
                <div className="absolute right-8 bottom-0 w-[140px] h-[280px] flex flex-col items-center  md:block">
                  {/* Mobile frame */}
                  <Image
                    src="/mobile-frame.png"
                    alt="Mobile frame"
                    fill
                    style={{objectFit: 'contain'}}
                    className="z-50"
                    priority
                  />
                  {/* Mobile content (feedback UI) */}
                  <div className="absolute left-[7%] top-[3%] w-[85%] h-[100%] z-40 overflow-hidden rounded-xl">
                    <Image
                      src="/mobile-content.png"
                      alt="Mobile feedback UI"
                      fill
                      style={{objectFit: 'cover'}}
                      className=""
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Precis Section */}
      <section className="w-full flex justify-center items-center py-12">
        <div className="w-full max-w-4xl min-h-[250px] bg-[#2d1e7b] rounded-lg flex flex-col justify-center items-center p-8">
          <h2 className="text-white text-lg tracking-widest mb-4">PRECIS</h2>
          <div className="w-full flex justify-center">
            <iframe
              src="https://docs.google.com/document/d/e/2PACX-1vS3uWhmGrWUogaHajO22EXpdlAptP9djcsNfmGdtdQqMRpFSfpVAJAJ-YHafTDLu1l8LiMuO6T6tjpN/pub?embedded=true"
              style={{ width: '100%', minHeight: '500px', background: 'purple' }}
              allowFullScreen
              title="Precis Document"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
