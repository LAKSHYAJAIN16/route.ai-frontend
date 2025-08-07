"use client";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function MobilePage() {
  // Phone frame dimensions
  const frameWidth = 300;
  const frameHeight = 600;
  return (
    <>
      <title>Mobile Preview</title>
      <link rel="icon" href="/favicon.ico" />
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <section className="flex flex-col items-center justify-center flex-1 px-2 sm:px-4 relative mt-4 w-full">
          <div className="text-xs tracking-widest text-[#b0b0b0] mt-2 ">MOBILE PREVIEW</div>
          <h1 className="text-2xl sm:text-4xl md:text-7xl font-extrabold text-white mb-3 leading-tight">
            <span
              className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent relative font-extrabold shimmer-gradient"
              style={{
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                filter: 'brightness(1.2)'
              }}
            >
              Try route.ai on mobile
            </span>
          </h1>
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Instructions for Mobile Emulator */}
            <p className="text-xs sm:text-sm text-white mb-4 text-center max-w-md">
              This is a live preview of the route.ai mobile web app, shown inside a phone frame. You can interact with it just like on a real device—scroll, tap, and explore the features. For the full native experience, use the download button below to install the Android app.
            </p>
            <div className="mt-5 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-24 w-full">
              <div
                className=" rounded-3xl shadow-lg flex flex-col items-center mb-6 md:mb-0"
                style={{ padding: 0, width: frameWidth + 24, height: frameHeight + 24, display: 'flex', justifyContent: 'center' }}
              >
                <div className="relative" style={{ width: frameWidth, height: frameHeight }}>
                  <iframe
                    src="https://route-ai-mobile.vercel.app/"
                    title="Route AI Mobile"
                    className="absolute top-0 left-0 rounded-3xl border-none z-10  hide-scrollbar"
                    style={{ width: frameWidth, height: frameHeight, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', overflow: 'auto' }}
                  />
                  <Image
                    src="/mobile-frame.png"
                    alt="iPhone X Frame"
                    fill
                    className="z-20 pointer-events-none select-none"
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </div>
              {/* Download Android Build Button */}
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                <a
                  href="https://expo.dev/accounts/thereallakshyajain16/projects/route-ai-mobile-app/builds/0cacd485-34b0-427b-952f-1bd976240bbf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-[#7c3aed] hover:bg-[#5b21b6] text-white font-semibold px-6 py-3 rounded-full text-base sm:text-lg shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-opacity-50"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Download Android Build
                </a>
                <a
                  href="https://route-ai-mobile.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white border border-[#7c3aed] hover:bg-[#f3e8ff] text-[#7c3aed] font-semibold px-6 py-3 rounded-full text-base shadow transition focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-opacity-50"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Open Mobile View in New Tab
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H19.5V12M19.5 6L10.5 15M6 19.5H18" />
                  </svg>
                </a>
              </div>
            </div>
            {/* End horizontal flex */}
          </div>
        </section>
        <Footer />
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
} 