"use client";
import React from "react";
import Sidebar from '../../../components/Sidebar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import Head from "next/head";

const revenueStats = [
  {
    label: "Total Revenue",
    value: "$42,500",
    change: "+5.2% from last month",
    changeColor: "text-green-500"
  },
  {
    label: "Average Fare",
    value: "$2.75",
    change: "+2.0% from last month",
    changeColor: "text-green-500"
  },
  {
    label: "Rides Today",
    value: "410",
    change: "+4.1% from yesterday",
    changeColor: "text-green-500"
  },
  {
    label: "Revenue Today",
    value: "$1,250",
    change: "+4.1% from yesterday",
    changeColor: "text-green-500"
  }
];

const revenueTrendData = [
  { date: 'Jul 1', revenue: 900, rides: 320 },
  { date: 'Jul 2', revenue: 1100, rides: 350 },
  { date: 'Jul 3', revenue: 950, rides: 300 },
  { date: 'Jul 4', revenue: 1200, rides: 400 },
  { date: 'Jul 5', revenue: 1050, rides: 370 },
  { date: 'Jul 6', revenue: 1300, rides: 420 },
  { date: 'Jul 7', revenue: 1250, rides: 410 },
  { date: 'Jul 8', revenue: 980, rides: 330 },
  { date: 'Jul 9', revenue: 1020, rides: 340 },
  { date: 'Jul 10', revenue: 1150, rides: 390 },
  { date: 'Jul 11', revenue: 1400, rides: 450 },
  { date: 'Jul 12', revenue: 1500, rides: 480 },
  { date: 'Jul 13', revenue: 1200, rides: 400 },
  { date: 'Jul 14', revenue: 1250, rides: 410 },
];

export default function Revenue() {
  return (
    <>
      <title>Revenue</title>
      <link rel="icon" href="/favicon.ico" />
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        <Sidebar selected="revenue" />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-xl p-12 shadow-sm border mb-8 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-[#2d2363] mb-8">Revenue Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {revenueStats.map((stat, i) => (
                <div key={i} className="bg-[#f7f8fa] rounded-xl p-6 flex flex-col gap-2 shadow-sm border">
                  <div className="text-2xl font-bold text-[#2d2363]">{stat.value}</div>
                  <div className="text-sm text-[#b0b0b0]">{stat.label}</div>
                  <div className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</div>
                </div>
              ))}
            </div>
            {/* Revenue Trend Line Chart */}
            <div className="bg-white rounded-xl p-8 shadow border flex flex-col items-center justify-center mb-8">
              <span className="text-[#2d2363] text-lg mb-4 font-semibold self-start">Revenue (Last 14 Days)</span>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', color:"black" }} />
                    <Line type="monotone" dataKey="revenue" stroke="#5f4bb6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Rides per Day Bar Chart */}
            <div className="bg-white rounded-xl p-8 shadow border flex flex-col items-center justify-center">
              <span className="text-[#2d2363] text-lg mb-4 font-semibold self-start">Rides per Day (Last 14 Days)</span>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', color:"black" }} />
                    <Bar dataKey="rides" fill="#5f4bb6" name="Rides" barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 