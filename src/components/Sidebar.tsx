import React from "react";
import Link from "next/link";
import { FiGrid, FiDatabase, FiHeart, FiMessageSquare, FiSliders, FiMap, FiClock, FiBarChart2, FiEye, FiDollarSign, FiTrendingUp, FiPower } from "react-icons/fi";

type SidebarProps = {
  selected?: string;
};

const navItemsTop = [
  { label: "Dashboard", key: "dashboard", href: "/dashboard", icon: <FiGrid /> },
  { label: "Data", key: "data", href: "/dashboard/data", icon: <FiDatabase className="w-5 h-5" /> },
  { label: "Feedback", key: "feedback", href: "/dashboard/feedback", icon: <FiHeart /> },
  { label: "Broadcast", key: "broadcast", href: "/dashboard/broadcast", icon: <FiMessageSquare /> },
  { label: "Map", key: "map", href: "/dashboard/map", icon: <FiMap /> },
  { label: "Optimize", key: "optimize", href: "/dashboard/optimize", icon: <FiSliders />, ai: true },
  { label: "Insights", key: "insights", href: "/dashboard/insights", icon: <FiEye />, ai: true },
];
const navItemsMiddle = [
  { label: "Schedule", key: "schedule", href: "/dashboard/schedule", icon: <FiClock /> },
  { label: "Routes", key: "routes", href: "/dashboard/routes", icon: <FiBarChart2 /> },
  { label: "Revenue", key: "revenue", href: "/dashboard/revenue", icon: <FiDollarSign /> },
  { label: "Sustainability", key: "sustainability", href: "/dashboard/sustainability", icon: <FiTrendingUp /> },
];

export default function Sidebar({ selected }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r flex flex-col py-8 px-4 sticky top-0 h-screen">
      <div className="text-3xl font-extrabold text-[#2d2363] mb-4 text-center w-full tracking-tight">route.ai</div>
      <nav className="flex-1 flex flex-col gap-2">
        {navItemsTop.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={
              `flex items-center justify-between gap-3 px-4 py-2 rounded-lg font-semibold ` +
              (selected === item.key
                ? "bg-[#5f4bb6] text-white"
                : "text-[#2d2363] hover:bg-[#f7f6fa]")
            }
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </span>
            {item.ai ? (
              <span className={`text-xs font-bold px-2 py-0.5 rounded align-middle ${selected === item.key ? 'bg-gradient-to-r from-[#5f4bb6] to-[#2d2363]' : 'bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400'} text-white animated-gradient`}>
                ai
              </span>
            ) : (
              <span className="text-xs font-bold px-2 py-0.5 rounded align-middle invisible">ai</span>
            )}
          </Link>
        ))}
        <div className="border-t my-4" />
        {navItemsMiddle.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={
              `flex items-center gap-3 px-4 py-2 rounded-lg font-semibold ` +
              (selected === item.key
                ? "bg-[#5f4bb6] text-white"
                : "text-[#2d2363] hover:bg-[#f7f6fa]")
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t my-4" />
      <a className="mt-auto flex items-center gap-3 px-4 py-2 rounded-lg text-[#b0b0b0] hover:bg-[#f7f6fa]" href="#">
        <span className="text-lg"><FiPower /></span>
        Logout
      </a>
    </aside>
  );
} 