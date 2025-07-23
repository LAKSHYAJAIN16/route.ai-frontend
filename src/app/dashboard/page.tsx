"use client";
import React, { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../../components/Sidebar';

const stats = [
  {
    label: "Total bus riders",
    value: 131,
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 bg-[#edeaff] text-[#5f4bb6] rounded-full">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
      </span>
    ),
    change: "+8.5% Up from yesterday",
    changeColor: "text-green-500"
  },
  {
    label: "Average ride rating",
    value: 4.5,
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 bg-[#fff7e6] text-[#f7b500] rounded-full">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2"/></svg>
      </span>
    ),
    change: "+1.3% Up from past week",
    changeColor: "text-green-500"
  },
  {
    label: "Average waiting time",
    value: "12 minutes",
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 bg-[#eafff3] text-[#2ee6a6] rounded-full">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </span>
    ),
    change: "-4.3% Down from yesterday",
    changeColor: "text-red-500"
  },
  {
    label: "New signups",
    value: 42,
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 bg-[#fff3ed] text-[#ff8a4c] rounded-full">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      </span>
    ),
    change: "+1.8% Up from yesterday",
    changeColor: "text-green-500"
  }
];

const ridersData = [
  { hour: '9am', riders: 5 },
  { hour: '10am', riders: 12 },
  { hour: '11am', riders: 18 },
  { hour: '12pm', riders: 33 },
  { hour: '1pm', riders: 17 },
  { hour: '2pm', riders: 20 },
  { hour: '3pm', riders: 15 },
  { hour: '4pm', riders: 28 },
  { hour: '5pm', riders: 22 },
  { hour: '6pm', riders: 19 },
  { hour: '7pm', riders: 16 },
  { hour: '8pm', riders: 14 },
];

const feedback = [
  { time: "12:20pm", route: "12", routeTime: "19 minutes", waiting: "18 minutes", comments: "Bus driver was mean, waited too long" },
  { time: "1:03pm", route: "12", routeTime: "8 minutes", waiting: "9 minutes", comments: "Bus stop was too far away." },
  { time: "5:02pm", route: "12", routeTime: "21 minutes", waiting: "11 minutes", comments: "Too much traffic, did not enjoy ride." },
];

export default function Dashboard() {
  useEffect(() => {
    document.title = "Dashboard";
    const link = document.querySelector("link[rel~='icon']");
    if (link) (link as HTMLLinkElement).href = "/favicon.ico";
  }, []);
  return (
    <>
      <div className="bg-[#f7f8fa] flex font-sans">
      {/* Sidebar */}
      <Sidebar selected="dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <div className="text-[#2d2363] font-semibold">Town of Milton</div>
            <div className="text-xs text-[#b0b0b0]">Admin</div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow-sm border">
              <div>{stat.icon}</div>
              <div className="text-2xl font-bold text-[#2d2363]">{stat.value}</div>
              <div className="text-sm text-[#b0b0b0]">{stat.label}</div>
              <div className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Riders by hour (Chart) */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#2d2363]">Riders by hour</span>
              <select className="ml-2 px-2 py-1 rounded border text-[#5f4bb6] border-[#e5e7eb] bg-white">
                <option>Route 12</option>
              </select>
            </div>
            <select className="px-2 py-1 rounded border text-[#b0b0b0] border-[#e5e7eb] bg-white">
              <option>Today</option>
            </select>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ridersData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }} />
                <Line type="monotone" dataKey="riders" stroke="#5f4bb6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-[#2d2363]">Feedback</span>
            <select className="ml-2 px-2 py-1 rounded border text-[#5f4bb6] border-[#e5e7eb] bg-white">
              <option>Route 12</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-[#b0b0b0] text-left">
                  <th className="py-2 px-4 font-medium">Time</th>
                  <th className="py-2 px-4 font-medium">Route</th>
                  <th className="py-2 px-4 font-medium">Route time</th>
                  <th className="py-2 px-4 font-medium">Waiting time</th>
                  <th className="py-2 px-4 font-medium">Comments</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((f, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 px-4">{f.time}</td>
                    <td className="py-2 px-4 text-[#5f4bb6] underline cursor-pointer">{f.route}</td>
                    <td className="py-2 px-4">{f.routeTime}</td>
                    <td className="py-2 px-4">{f.waiting}</td>
                    <td className="py-2 px-4">{f.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
    </>
  );
} 