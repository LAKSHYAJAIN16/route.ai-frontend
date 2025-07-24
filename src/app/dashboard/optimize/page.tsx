"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import Sidebar from '../../../components/Sidebar';
import { getRoutes, getSchedules } from '../data';
import Head from "next/head";
import dynamic from 'next/dynamic';

// Route and Stop types (inline, not exported)
type Stop = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  routeColor?: string;
};
type Route = {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
  routeCoordinates: [number, number][];
};
type ScheduleDay = {
  day: string;
  stops: string[];
  times: string[][];
};
type Schedule = {
  routeId: string;
  days: ScheduleDay[];
};

export default function Optimize() {
  // Add missing state definitions
  const [maxWalkingDistance, setMaxWalkingDistance] = useState(500);
  const [maxWaitTime, setMaxWaitTime] = useState(10);
  const [transferPenalty, setTransferPenalty] = useState(5);
  const [maxTransfers, setMaxTransfers] = useState(2);
  const [serviceStart, setServiceStart] = useState("06:00");
  const [serviceEnd, setServiceEnd] = useState("22:00");
  const [busCapacity, setBusCapacity] = useState(40);
  const [busStopsConstructed, setBusStopsConstructed] = useState(5);
  const [numberOfRoutes, setNumberOfRoutes] = useState(3);
  const [priorityWait, setPriorityWait] = useState(0.33);
  const [priorityWalk, setPriorityWalk] = useState(0.33);
  const [priorityTransfers, setPriorityTransfers] = useState(0.34);
  const prioritySum = priorityWait + priorityWalk + priorityTransfers;
  const sumTextColor = prioritySum === 1 ? 'text-green-600' : 'text-red-600';
  const [allStops, setAllStops] = useState<Stop[]>([]);
  const [routeSchedules, setRouteSchedules] = useState<{ schedule: Schedule; route: Route }[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpand = (routeId: string, day: string) => {
    setExpanded(exp => ({ ...exp, [`${routeId}-${day}`]: !exp[`${routeId}-${day}`] }));
  };
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [optimizationTechnique, setOptimizationTechnique] = useState('gpt');
  const [techniqueError, setTechniqueError] = useState('');
  const [gptResponse, setGptResponse] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setShowPopup(false);
    setGptResponse(null);
    // Gather all settings, routes, and schedules
    const settings = {
      maxWalkingDistance,
      maxWaitTime,
      transferPenalty,
      maxTransfers,
      serviceStart,
      serviceEnd,
      busCapacity,
      busStopsConstructed,
      numberOfRoutes,
      priorityWait,
      priorityWalk,
      priorityTransfers,
      optimizationTechnique,
    };
    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: `Given the following optimization settings, routes, and schedules, generate optimized routes, schedules and bus stops. Output in JSON format, and nothing else. \n\nSETTINGS: ${JSON.stringify(settings)}\n\nROUTES: ${JSON.stringify(routes)}\n\nSCHEDULES: ${JSON.stringify(routeSchedules)}` }
        ],
      });
      const aiText = completion.choices?.[0]?.message?.content || 'No response.';
      setGptResponse(aiText);
    } catch (e) {
      if ((e as any)?.name === 'AbortError') {
        // Request was aborted, do nothing (UI already handled)
        return;
      }
      setGptResponse('Error contacting GPT-4 API.');
    }
    setLoading(false);
    setShowPopup(true);
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setShowPopup(false);
  };

  useEffect(() => {
    async function fetchData() {
      // Fetch routes from Firestore
      const routesData = await getRoutes() as Route[];
      setRoutes(routesData);

      // Build allStops array with routeColor for each stop
      const stopsWithColor: Stop[] = routesData.flatMap(route =>
        route.stops.map((stop) => ({
          ...stop,
          routeColor: route.color || '#888',
        }))
      );
      setAllStops(stopsWithColor);

      // Fetch schedules from Firestore
      const schedulesData = await getSchedules() as Schedule[];
      // Map schedules to their corresponding route
      const routeSchedulesData: { schedule: Schedule; route: Route }[] = routesData.map(route => {
        // Find the schedule for this route
        const schedule = schedulesData.find((s) => s.routeId === route.id);
        return schedule ? { schedule, route } : undefined;
      }).filter((rs): rs is { schedule: Schedule; route: Route } => !!rs); // Only include if schedule exists
      setRouteSchedules(routeSchedulesData);
    }
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Optimize</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen bg-gray-50"> {/* Layout wrapper for sidebar + main */}
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
              {/* Optimization Technique Dropdown (now above bus stops and schedules) */}
              <div className="mt-8 mb-4">
                <div className="flex gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-[#5f4bb6]">Optimization Technique</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#5f4bb6]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div className="relative w-full max-w-xs">
                  <select
                    className="w-full border rounded px-3 py-2 text-black bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#5f4bb6]"
                    value={optimizationTechnique}
                    onChange={e => {
                      setOptimizationTechnique(e.target.value);
                      if (e.target.value === 'actual-ai') {
                        setTechniqueError('This technique is still in development. We only had a couple days bro pls 🙏');
                      } else {
                        setTechniqueError('');
                      }
                    }}
                  >
                    <option value="gpt">GPT (demo)</option>
                    <option value="actual-ai">Like actual AI</option>
                  </select>
                </div>
                {techniqueError && (
                  <div className="text-red-600 text-sm mt-2">{techniqueError}</div>
                )}
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
              </div>
              {/* Schedules Preview for All Routes */}
              <div className="mt-8">
                <h2 className="text-lg font-bold text-[#2d2363] mb-2">Current Schedules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {routeSchedules.map(({ schedule, route }) => {
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
                        {schedule.days.map((day, idx) => {
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
                                  className="text-[10px] px-1 py-0.5 rounded border border-[#5f4bb6] text-[#5f4bb6] hover:bg-[#edeaff] transition cursor-pointer"
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
                  onClick={handleGenerate}
                  disabled={loading || optimizationTechnique === 'actual-ai'}
                >
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
          </div>
          {/* Loading Animation Overlay */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
              <div className="flex flex-col items-center">
                {/* Super cool spinner */}
                <div className="w-24 h-24 border-8 border-dashed border-purple-500 border-t-transparent rounded-full animate-spin mb-6 shadow-2xl"></div>
                <div className="text-2xl font-bold text-black animate-pulse mb-4">Optimizing Routes...</div>
                <button
                  className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-transform cursor-pointer"
                  onClick={handleCancel}
                >
                  I have a short attention span
                </button>
              </div>
            </div>
          )}
          {/* Popup Modal */}
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center animate-fade-in max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="text-3xl font-extrabold text-[#5f4bb6] mb-4">🎉</div>
                <div className="text-xl font-semibold mb-4 text-[#2d2363]">Route optimization done!</div>
                {/* Display GPT response */}
                {gptResponse && (
                  <div className="w-full bg-gray-50 rounded p-4 text-sm text-black mb-4 whitespace-pre-wrap border border-gray-200 max-h-96 overflow-y-auto">
                    <strong>AI Suggestions:</strong>
                    <pre className="whitespace-pre-wrap break-all text-xs font-mono">{gptResponse}</pre>
                  </div>
                )}
                <button
                  className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 