"use client";
import React from "react";
import Sidebar from '../../../components/Sidebar';
import { getRoutes, getSchedules } from '../data';
import Head from "next/head";

export default function Optimize() {
  return (
    <>
      <Head>
        <title>Optimize</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar selected="optimize" />
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border mb-8 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#2d2363] mb-2">Optimize</h1>
          <div className="flex flex-col gap-8">
            {/* General Settings */}
            <div>
              <h3 className="text-lg font-semibold text-[#5f4bb6] mb-2">General Settings</h3>
              <div className="flex flex-col gap-6">
                {/* Max walking distance */}
                <div>
                  <label className="block font-semibold text-black mb-1">Max walking distance to bus stop: <span className="text-[#5f4bb6]">{maxWalkingDistance} m</span></label>
                  <input type="range" min={100} max={2000} step={50} value={maxWalkingDistance} onChange={e => setMaxWalkingDistance(Number(e.target.value))} className="w-full accent-[#5f4bb6]" />
                </div>
                {/* Max wait time */}
                <div>
                  <label className="block font-semibold text-black mb-1">Max wait time at bus stop: <span className="text-[#5f4bb6]">{maxWaitTime} min</span></label>
                  <input type="range" min={1} max={30} value={maxWaitTime} onChange={e => setMaxWaitTime(Number(e.target.value))} className="w-full accent-[#5f4bb6]" />
                </div>
                {/* Transfer penalty */}
                <div>
                  <label className="block font-semibold text-black mb-1">Transfer penalty: <span className="text-[#5f4bb6]">{transferPenalty} min</span></label>
                  <input type="range" min={0} max={20} value={transferPenalty} onChange={e => setTransferPenalty(Number(e.target.value))} className="w-full accent-[#5f4bb6]" />
                </div>
                {/* Max transfers */}
                <div>
                  <label className="block font-semibold text-black mb-1">Max transfers: <span className="text-[#5f4bb6]">{maxTransfers}</span></label>
                  <input type="number" min={0} max={5} value={maxTransfers} onChange={e => setMaxTransfers(Number(e.target.value))} className="w-20 border rounded px-2 py-1 text-black" />
                </div>
              </div>
            </div>
            {/* Service Hours */}
            <div>
              <h3 className="text-lg font-semibold text-[#5f4bb6] mb-2">Service Hours</h3>
              <div className="flex gap-4 items-center">
                <label className="font-semibold text-black">Service hours:</label>
                <input type="time" value={serviceStart} onChange={e => setServiceStart(e.target.value)} className="border rounded px-2 py-1 text-black" />
                <span className="mx-2 text-black">to</span>
                <input type="time" value={serviceEnd} onChange={e => setServiceEnd(e.target.value)} className="border rounded px-2 py-1 text-black" />
              </div>
            </div>
            {/* Route & Stops */}
            <div>
              <h3 className="text-lg font-semibold text-[#5f4bb6] mb-2">Route & Stops</h3>
              <div className="flex flex-col gap-6">
                {/* Bus capacity */}
                <div>
                  <label className="block font-semibold text-black mb-1">Bus capacity: <span className="text-[#5f4bb6]">{busCapacity}</span></label>
                  <input type="number" min={10} max={100} value={busCapacity} onChange={e => setBusCapacity(Number(e.target.value))} className="w-24 border rounded px-2 py-1 text-black" />
                </div>
                {/* Bus stops that can be constructed */}
                <div>
                  <label className="block font-semibold text-black mb-1">Bus stops that can be constructed: <span className="text-[#5f4bb6]">{busStopsConstructed}</span></label>
                  <input type="number" min={0} max={1000} value={busStopsConstructed} onChange={e => setBusStopsConstructed(Number(e.target.value))} className="w-32 border rounded px-2 py-1 text-black" />
                </div>
                {/* Number of routes */}
                <div>
                  <label className="block font-semibold text-black mb-1">Number of routes: <span className="text-[#5f4bb6]">{numberOfRoutes}</span></label>
                  <input type="range" min={1} max={25} value={numberOfRoutes} onChange={e => setNumberOfRoutes(Number(e.target.value))} className="w-full accent-[#5f4bb6]" />
                </div>
              </div>
            </div>
            {/* Priorities */}
            <div>
              <h3 className="text-lg font-semibold text-[#5f4bb6] mb-2">Priorities</h3>
              <div>
                <label className="block font-semibold text-black mb-1">Priority weights (must sum to 1):</label>
                <div className="flex gap-4 items-center">
                  <span className="text-black">Wait time</span>
                  <input type="number" min={0} max={1} step={0.01} value={priorityWait} onChange={e => setPriorityWait(Number(e.target.value))} className="w-16 border rounded px-2 py-1 text-black" />
                  <span className="text-black">Walking distance</span>
                  <input type="number" min={0} max={1} step={0.01} value={priorityWalk} onChange={e => setPriorityWalk(Number(e.target.value))} className="w-16 border rounded px-2 py-1 text-black" />
                  <span className="text-black">Transfers</span>
                  <input type="number" min={0} max={1} step={0.01} value={priorityTransfers} onChange={e => setPriorityTransfers(Number(e.target.value))} className="w-16 border rounded px-2 py-1 text-black" />
                </div>
                <div className={`text-xs mt-1 ${sumTextColor}`}>Current sum: {prioritySum.toFixed(2)}</div>
              </div>
            </div>
            {/* Color Key and Bus Stops Grid */}
            <div className="mt-2">
              {/* Color Key */}
              <div className="flex flex-wrap gap-2 mb-3 items-center">
                {routes.map(route => (
                  <div key={route.id} className="flex items-center gap-1 text-xs">
                    <span className="inline-block w-4 h-4 rounded" style={{ background: route.color }}></span>
                    <span className="text-black">{route.name}</span>
                  </div>
                ))}
              </div>
              <h2 className="text-lg font-bold text-[#2d2363] mb-2">Current Bus Stops</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
                {allStops.map((stop, i) => (
                  <div
                    key={i}
                    className="rounded p-2 text-white shadow flex flex-col items-start text-xs min-w-0"
                    style={{ background: stop.routeColor }}
                  >
                    <div className="font-semibold truncate w-full mb-0.5" title={stop.label}>{stop.label}</div>
                    <div className="font-mono">{stop.lat}</div>
                    <div className="font-mono">{stop.lng}</div>
                  </div>
                ))}
              </div>
              {/* Schedules Preview for All Routes */}
              <div className="mt-8">
                <h2 className="text-lg font-bold text-[#2d2363] mb-2">Current Schedules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {routeSchedules.map(({ schedule, route }: ScheduleType) => {
                    // Get the stop IDs from the route's stops (in order)
                    const routeStopIds = route.stops.map(s => s.id);
                    // For each day, check if the schedule stops match the route stops
                    const scheduleStopMismatch = schedule.days.some(day => {
                      if (day.stops.length !== routeStopIds.length) return true;
                      for (let i = 0; i < day.stops.length; i++) {
                        if (day.stops[i] !== routeStopIds[i]) return true;
                      }
                      return false;
                    });
                    return (
                      <div key={route.id} className="bg-white border rounded shadow-sm p-1" style={{ borderLeft: `4px solid ${route.color}` }}>
                        <div className="font-bold text-[#2d2363] mb-0.5 text-[10px] flex items-center justify-between">
                          {route.name}
                        </div>
                        {schedule.days.map((day: { day: string; stops: string[]; times: string[][]; }, idx: number) => {
                          const isExpanded = expanded[`${route.id}-${day.day}`];
                          const showRows = isExpanded ? day.times.length : 3;
                          // Add margin-top to the first weekend table (Saturday or Sunday) if it is not the first day
                          const isWeekend = day.day.toLowerCase().includes('saturday') || day.day.toLowerCase().includes('sunday');
                          const dayDivClass = `mb-1${isWeekend && idx !== 0 ? ' mt-4' : ''}`;
                          return (
                            <div key={day.day} className={dayDivClass}>
                              <div className="flex justify-between items-center mb-1">
                                <div className="font-semibold text-black text-[10px]">{day.day}</div>
                                <button
                                  className="text-[10px] px-1 py-0.5 rounded border border-[#5f4bb6] text-[#5f4bb6] hover:bg-[#edeaff] transition"
                                  onClick={() => toggleExpand(route.id, day.day)}
                                >
                                  {isExpanded ? 'Show less' : 'Show all'}
                                </button>
                              </div>
                              <div className="overflow-x-auto w-full">
                                <table className="w-full text-[10px] border border-gray-200">
                                  <thead>
                                    <tr>
                                      {day.stops.map((stop: string, i: number) => (
                                        <th key={i} className="px-1 py-0.5 border-b border-r border-gray-200 bg-gray-50 text-black font-semibold whitespace-nowrap text-[10px] text-center">{stop}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {day.times.slice(0, showRows).map((row: string[], i: number) => (
                                      <tr key={i}>
                                        {row.map((time: string, j: number) => (
                                          <td key={j} className="px-1 py-0.5 border-b border-r border-gray-100 text-black whitespace-nowrap text-[10px] text-center">{time}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                        {scheduleStopMismatch && (
                          <div className="text-[10px] text-red-600 mt-1">Schedule stops do not match recorded bus stops for this route.</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Optimize Button with Gradient (moved below schedules) */}
              <div className="flex justify-center my-8">
                <button
                  className="cursor-pointer px-8 py-3 rounded-full text-white font-bold text-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 animated-gradient"
                  style={{ boxShadow: '0 4px 20px 0 rgba(127, 90, 240, 0.15)' }}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 