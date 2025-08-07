import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Separator line */}
      <div className="border-t border-purple-500/20 mb-6"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Company Info */}
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              route.ai
            </h3>
            <span className="text-gray-400 text-sm">© Lakshya Jain 2025. All rights reserved.</span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="/signup" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            <a href="/mobile" className="text-gray-300 hover:text-white transition-colors">Preview</a>
            <a href="/mobile" className="text-gray-300 hover:text-white transition-colors">Mobile</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
