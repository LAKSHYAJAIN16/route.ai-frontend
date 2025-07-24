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
    <>
      <title>Route.AI - The future of public transit</title>
      <link rel="icon" href="/favicon.ico" />
      <div className="bg-white flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 relative pt-8 pb-0 md:pb-8 w-full">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative z-50">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[#1E0E62] mb-2 md:mb-3 font-semibold"
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
          <p className="text-base sm:text-lg md:text-xl text-[#404040] mb-6 md:mb-7">You ride the bus. We make it better.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-0 w-full max-w-xs sm:max-w-none">
            <a href="/signin" className="bg-[#7c3aed] hover:bg-[#5b21b6] text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-opacity-50">Sign In</a>
            <a href="/mobile" className="bg-[#5f4bb6] hover:bg-[#2d2363] text-white font-semibold px-8 py-3 rounded-full text-lg shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[#5f4bb6] focus:ring-opacity-50">Download Now</a>
          </div>

          {/* Showcase Section */}
          <div className="flex flex-col items-center -mt-4 w-full">
            {/* Overlapping for sm+ screens */}
            <div className="hidden sm:flex relative items-end justify-center w-[850px] h-[520px] max-w-full">
                {/* Ellipse Images for Gradient Effect - Absolute Positioned for Visual Blend */}
                <div className="absolute inset-0 w-full h-full z-0 pointer-events-none top-[-30%]">
                  <Image
                    src="/Ellipse.png"
                    alt="Ellipse 1"
                    width={1200}
                    height={1200}
                    className="absolute left-[-18%] opacity-90 select-none"
                  />
                  <Image
                    src="/Ellipse (1).png"
                    alt="Ellipse 2"
                    width={1200}
                    height={1200}
                    className="absolute left-[30%] opacity-80 select-none"
                    priority
                  />
                  <Image
                    src="/Ellipse (2).png"
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
            {/* Stacked for <sm screens */}
            <div className="flex flex-col sm:hidden items-center w-full gap-6 relative">
              {/* Ellipse Images for Gradient Effect - Absolute Positioned for Visual Blend */}
              <div className="absolute inset-0 w-full h-full z-0 pointer-events-none top-[-30%]">
                <Image
                  src="/Ellipse.png"
                  alt="Ellipse 1"
                  width={1200}
                  height={1200}
                  className="absolute left-[-18%] opacity-90 select-none"
                />
                <Image
                  src="/Ellipse (1).png"
                  alt="Ellipse 2"
                  width={1200}
                  height={1200}
                  className="absolute left-[30%] opacity-80 select-none"
                  priority
                />
                <Image
                  src="/Ellipse (2).png"
                  alt="Ellipse 3"
                  width={1200}
                  height={1200}
                  className="absolute right-[-15%] opacity-80 select-none"
                  priority
                />
              </div>
              {/* Laptop frame and content */}
              <div className="relative w-full flex flex-col items-center mt-8">
                <div className="w-[90vw] max-w-[350px] aspect-[676/416] relative">
                  <Image
                    src="/laptop-frame.png"
                    alt="Laptop frame"
                    fill
                    style={{objectFit: 'contain'}}
                    className="drop-shadow-xl"
                    priority
                  />
                  <div className="absolute left-[10%] top-[8%] w-[80%] h-[80%] z-10 overflow-hidden rounded-[3px] shadow-lg">
                    <Image
                      src="/laptop-content.png"
                      alt="Dashboard screenshot"
                      fill
                      style={{objectFit: 'cover'}}
                      priority
                    />
                  </div>
                </div>
              </div>
              {/* Mobile frame and content */}
              <div className="relative w-full flex flex-col items-center">
                <div className="w-[40vw] min-w-[120px] max-w-[180px] aspect-[140/280] relative">
                  <Image
                    src="/mobile-frame.png"
                    alt="Mobile frame"
                    fill
                    style={{objectFit: 'contain'}}
                    className="z-50"
                    priority
                  />
                  <div className="absolute left-[7%] top-[3%] w-[85%] h-[94%] z-40 overflow-hidden rounded-xl">
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
      {/* Resources Section */}
      <section className="w-full flex justify-center items-center py-8 sm:py-12 px-2">
        <div className="w-full max-w-4xl min-h-[200px] sm:min-h-[250px] bg-[#2d1e7b] rounded-lg flex flex-col justify-center items-center p-4 sm:p-8">
          <h2 className="text-white text-base sm:text-lg tracking-widest mb-4">RESOURCES</h2>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Storyboard Button - Shows Image */}
            <button
              className="bg-white text-[#2d1e7b] font-semibold px-8 py-4 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer text-lg sm:text-xl"
              onClick={() => {
                const img = document.createElement('img');
                img.src = '/story.png';
                img.alt = 'Storyboard';
                img.style.maxWidth = '90vw';
                img.style.maxHeight = '90vh';
                img.style.display = 'block';
                img.style.margin = '40px auto';
                img.style.borderRadius = '12px';
                img.style.boxShadow = '0 4px 32px rgba(0,0,0,0.18)';
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100vw';
                overlay.style.height = '100vh';
                overlay.style.background = 'rgba(0,0,0,0.7)';
                overlay.style.zIndex = '9999';
                overlay.appendChild(img);
                overlay.onclick = () => document.body.removeChild(overlay);
                document.body.appendChild(overlay);
              }}
            >
              Storyboard
            </button>
            {/* Pitch Deck Button - Link */}
            <a
              href="https://www.canva.com/design/DAGuAPdN88k/wBPVyEjKf-LqvtAN9ho-Bg/edit?utm_content=DAGuAPdN88k&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#2d1e7b] font-semibold px-8 py-4 rounded-lg shadow hover:bg-gray-100 transition text-center text-lg sm:text-xl"
            >
              Pitch Deck
            </a>
            {/* Precis Button - Link */}
            <a
              href="https://docs.google.com/document/d/1ZmB1ot8g6TyNC4pt5DfNzP0JGCjROguElIoEvkVs1FE/edit?tab=t.0#heading=h.r5bob7brynj2"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#2d1e7b] font-semibold px-8 py-4 rounded-lg shadow hover:bg-gray-100 transition text-center text-lg sm:text-xl"
            >
              Precis
            </a>
            {/* Miro Button - Link */}
            <a
              href="https://miro.com/app/board/uXjVJdm2-Kc=/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#2d1e7b] font-semibold px-8 py-4 rounded-lg shadow hover:bg-gray-100 transition text-center text-lg sm:text-xl"
            >
              Miro
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
