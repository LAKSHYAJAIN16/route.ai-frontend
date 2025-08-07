"use client";

import Image from "next/image";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect } from "react";  

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
      
      {/* Particle Background */}
      <div className="particle-container">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 relative pt-8 pb-0 md:pb-8 w-full">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative z-50">
                      <h1
            className="text-3xl sm:text-4xl md:text-7xl text-white mb-2 md:mb-3 mt-4 font-semibold"
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
          <p className="text-base sm:text-lg md:text-2xl text-gray-300 mb-6 md:mb-7 md:mt-4">You ride the bus. We make it better.</p>
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

      {/* Problem Section */}
      <section className="w-full flex justify-center items-center py-16 px-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4">The Problem</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Public transit riders face daily frustrations that make planning their journeys difficult and stressful.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-white text-xl font-semibold mb-6 text-center">Rider Experience</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-200">Unreliable schedules and frequent delays</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-200">Poor communication from transit agencies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-200">Lack of real-time updates and notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-200">No feedback mechanism for riders</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-white text-xl font-semibold mb-6 text-center">System Inefficiencies</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-200">Inefficient routes and poor optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-200">Limited data on rider patterns and preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-200">No real-time demand forecasting</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-200">Inadequate resource allocation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}