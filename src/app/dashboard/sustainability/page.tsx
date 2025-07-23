"use client";
import React from "react";
import Sidebar from '../../../components/Sidebar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import Head from "next/head";

const sustainabilityStats = [
  {
    label: "CO₂ Saved (This Month)",
    value: "2,800 kg",
    change: "+8.2% from last month",
    changeColor: "text-green-500"
  },
  {
    label: "Avg. Emissions per Ride",
    value: "0.19 kg",
    change: "-3.1% from last month",
    changeColor: "text-green-500"
  },
  {
    label: "Fuel Saved (Liters)",
    value: "1,120 L",
    change: "+6.5% from last month",
    changeColor: "text-green-500"
  },
  {
    label: "Avg. Bus Occupancy",
    value: "28 riders",
    change: "+2.3% from last month",
    changeColor: "text-green-500"
  }
];

const co2TrendData = [
  { date: 'Jul 1', co2: 160 },
  { date: 'Jul 2', co2: 180 },
  { date: 'Jul 3', co2: 150 },
  { date: 'Jul 4', co2: 200 },
  { date: 'Jul 5', co2: 170 },
  { date: 'Jul 6', co2: 210 },
  { date: 'Jul 7', co2: 220 },
  { date: 'Jul 8', co2: 140 },
  { date: 'Jul 9', co2: 155 },
  { date: 'Jul 10', co2: 190 },
  { date: 'Jul 11', co2: 230 },
  { date: 'Jul 12', co2: 250 },
  { date: 'Jul 13', co2: 180 },
  { date: 'Jul 14', co2: 210 },
];

const busTypeData = [
  { date: 'Jul 1', electric: 180, diesel: 140 },
  { date: 'Jul 2', electric: 200, diesel: 150 },
  { date: 'Jul 3', electric: 170, diesel: 130 },
  { date: 'Jul 4', electric: 220, diesel: 180 },
  { date: 'Jul 5', electric: 190, diesel: 160 },
  { date: 'Jul 6', electric: 240, diesel: 180 },
  { date: 'Jul 7', electric: 250, diesel: 160 },
  { date: 'Jul 8', electric: 160, diesel: 120 },
  { date: 'Jul 9', electric: 170, diesel: 130 },
  { date: 'Jul 10', electric: 210, diesel: 180 },
  { date: 'Jul 11', electric: 260, diesel: 190 },
  { date: 'Jul 12', electric: 270, diesel: 210 },
  { date: 'Jul 13', electric: 200, diesel: 150 },
  { date: 'Jul 14', electric: 220, diesel: 190 },
];

export default function Sustainability() {
  return (
    <>
      <Head>
        <title>Sustainability</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        <Sidebar selected="sustainability" />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-xl p-12 shadow-sm border mb-8 max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-[#2d2363] mb-8">Sustainability</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {sustainabilityStats.map((stat, i) => (
                <div key={i} className="bg-[#f7f8fa] rounded-xl p-6 flex flex-col gap-2 shadow-sm border">
                  <div className="text-2xl font-bold text-[#2d2363]">{stat.value}</div>
                  <div className="text-sm text-[#b0b0b0]">{stat.label}</div>
                  <div className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</div>
                </div>
              ))}
            </div>
            {/* CO2 Reduction Target Progress Bar */}
            <div className="bg-[#f7f8fa] rounded-xl p-6 shadow-sm border flex flex-col gap-4 mb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-[#2d2363]">CO₂ Reduction Target</span>
                <span className="text-sm text-[#5f4bb6] font-bold">2,800 kg / 3,500 kg</span>
              </div>
              <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-[#2ee6a6] transition-all duration-700"
                  style={{ width: `${(2800/3500)*100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#b0b0b0] mt-1">
                <span>0</span>
                <span>3,500 kg</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 