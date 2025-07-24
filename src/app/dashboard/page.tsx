"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../../components/Sidebar';
import { getFeedbackData } from "./data";
import { routes } from "./data";
import Head from "next/head";

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

// Riders by hour data for each route
const ridersDataByRoute = {
  "12": [
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
  ],
  "13": [
    { hour: '9am', riders: 8 },
    { hour: '10am', riders: 15 },
    { hour: '11am', riders: 20 },
    { hour: '12pm', riders: 25 },
    { hour: '1pm', riders: 22 },
    { hour: '2pm', riders: 18 },
    { hour: '3pm', riders: 24 },
    { hour: '4pm', riders: 30 },
    { hour: '5pm', riders: 27 },
    { hour: '6pm', riders: 21 },
    { hour: '7pm', riders: 19 },
    { hour: '8pm', riders: 17 },
  ],
  "14": [
    { hour: '9am', riders: 3 },
    { hour: '10am', riders: 7 },
    { hour: '11am', riders: 12 },
    { hour: '12pm', riders: 18 },
    { hour: '1pm', riders: 14 },
    { hour: '2pm', riders: 16 },
    { hour: '3pm', riders: 13 },
    { hour: '4pm', riders: 19 },
    { hour: '5pm', riders: 15 },
    { hour: '6pm', riders: 12 },
    { hour: '7pm', riders: 10 },
    { hour: '8pm', riders: 8 },
  ],
  "15": [
    { hour: '9am', riders: 6 },
    { hour: '10am', riders: 10 },
    { hour: '11am', riders: 14 },
    { hour: '12pm', riders: 20 },
    { hour: '1pm', riders: 18 },
    { hour: '2pm', riders: 15 },
    { hour: '3pm', riders: 17 },
    { hour: '4pm', riders: 22 },
    { hour: '5pm', riders: 19 },
    { hour: '6pm', riders: 16 },
    { hour: '7pm', riders: 13 },
    { hour: '8pm', riders: 11 },
  ],
};

export default function Dashboard() {
  const [feedback, setFeedback] = useState([]);
  const [selectedChartRoute, setSelectedChartRoute] = useState("12");
  const [selectedFeedbackRoute, setSelectedFeedbackRoute] = useState("12");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard";
    const link = document.querySelector("link[rel~='icon']");
    if (link) (link as HTMLLinkElement).href = "/favicon.ico";
  }, []);

  useEffect(() => {
    setLoading(true);
    getFeedbackData().then((data) => {
      setFeedback(data);
      setLoading(false);
    });
  }, []);

  // Filter feedback by selected feedback route
  const filteredFeedback = feedback.filter(f => f.route === selectedFeedbackRoute);

  // Find the selected route object for chart color
  const selectedChartRouteObj = routes.find(r => r.id === selectedChartRoute);
  const chartRouteColor = selectedChartRouteObj ? selectedChartRouteObj.color : "#5f4bb6";

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
             <select
               className="ml-2 px-2 py-1 rounded border border-[#e5e7eb] bg-white"
               style={{ color: chartRouteColor }}
               value={selectedChartRoute}
               onChange={e => setSelectedChartRoute(e.target.value)}
             >
               {routes.map(route => (
                 <option
                   key={route.id}
                   value={route.id}
                   style={{ color: selectedChartRoute === route.id ? 'black' : route.color }}
                 >
                   {route.name}
                 </option>
               ))}
             </select>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
             <LineChart data={ridersDataByRoute[selectedChartRoute] || []} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="hour" tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
               <YAxis tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
               <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }} />
               <Line type="monotone" dataKey="riders" stroke={chartRouteColor} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
             </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Feedback Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-[#2d2363]">Feedback</span>
           <select
             className="ml-2 px-2 py-1 rounded border border-[#e5e7eb] bg-white"
             style={{ color: routes.find(r => r.id === selectedFeedbackRoute)?.color || '#5f4bb6' }}
             value={selectedFeedbackRoute}
             onChange={e => setSelectedFeedbackRoute(e.target.value)}
           >
             {routes.map(route => (
               <option
                 key={route.id}
                 value={route.id}
                 style={{ color: selectedFeedbackRoute === route.id ? 'black' : route.color }}
               >
                 {route.name}
               </option>
             ))}
           </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-black text-left">
                  <th className="py-2 px-4 font-medium">Time</th>
                  <th className="py-2 px-4 font-medium">Route</th>
                  <th className="py-2 px-4 font-medium">Route time</th>
                  <th className="py-2 px-4 font-medium">Waiting time</th>
                  <th className="py-2 px-4 font-medium">Comments</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-2 px-4 text-center text-black">Loading...</td></tr>
                ) : filteredFeedback.length === 0 ? (
                  <tr><td colSpan={5} className="py-2 px-4 text-center text-black">No feedback for this route.</td></tr>
                ) : (
                  filteredFeedback.map((f, i) => (
                    <tr key={i} className="border-t text-black">
                      <td className="py-2 px-4">{f.time}</td>
                      <td className="py-2 px-4 underline cursor-pointer">{f.route}</td>
                      <td className="py-2 px-4">{f.routeTime}</td>
                      <td className="py-2 px-4">{f.waiting}</td>
                      <td className="py-2 px-4">{f.remarks || f.comments}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
    </>
  );
} 