"use client";
import React, { useState } from "react";
import Sidebar from '../../../components/Sidebar';
import { getRoutes, getSchedules, Route } from '../data';
import type { Schedule } from '../data';
import Head from "next/head";

export default function Schedule() {
  // Add missing state
  const [routeSchedules, setRouteSchedules] = useState<{ route: Route; schedule: Schedule }[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpand = (routeId: string, day: string) => {
    setExpanded(exp => ({ ...exp, [`${routeId}-${day}`]: !exp[`${routeId}-${day}`] }));
  };

  React.useEffect(() => {
    async function fetchData() {
      const [routes, schedules] = await Promise.all([getRoutes(), getSchedules()]);
      // Match schedules to routes by routeId
      const combined = routes.map(route => {
        const schedule = schedules.find(s => s.routeId === route.id);
        return schedule ? { route, schedule } : null;
      }).filter((item): item is { route: Route; schedule: Schedule } => !!item);
      setRouteSchedules(combined);
    }
    fetchData();
  }, []);
  return (
    <>
      <title>Schedule</title>
      <link rel="icon" href="/favicon.ico" />
      <Head>
        <title>Schedule</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        <Sidebar selected="schedule" />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-xl p-12 shadow-sm border mb-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-[#2d2363] mb-6">Bus Schedules</h1>
            <div className="flex flex-col gap-8">
              {/* Color Key and Bus Stops Grid */}
              <div className="mt-2">
                <div className="mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        <div key={route.id} className="bg-white border rounded shadow-sm p-4" style={{ borderLeft: `6px solid ${route.color}` }}>
                          <div className="font-bold text-[#2d2363] mb-2 text-lg flex items-center justify-between">
                            {route.name}
                          </div>
                          {schedule.days.map((day, idx) => {
                            const isExpanded = expanded[`${route.id}-${day.day}`];
                            const showRows = isExpanded ? day.times.length : 6;
                            // Add margin-top to the first weekend table (Saturday or Sunday) if it is not the first day
                            const isWeekend = day.day.toLowerCase().includes('saturday') || day.day.toLowerCase().includes('sunday');
                            const dayDivClass = `mb-4${isWeekend && idx !== 0 ? ' mt-8' : ''}`;
                            return (
                              <div key={day.day} className={dayDivClass}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="font-semibold text-black text-lg">{day.day}</div>
                                  <button
                                    className="text-base px-2 py-1 rounded border border-[#5f4bb6] text-[#5f4bb6] hover:bg-[#edeaff] transition"
                                    onClick={() => toggleExpand(route.id, day.day)}
                                  >
                                    {isExpanded ? 'Show less' : 'Show all'}
                                  </button>
                                </div>
                                <div className="overflow-x-auto w-full">
                                  <table className="w-full text-base border border-gray-200">
                                    <thead>
                                      <tr>
                                        {day.stops.map((stop: string, i: number) => (
                                          <th key={i} className="px-2 py-2 border-b border-r border-gray-200 bg-gray-50 text-black font-semibold whitespace-nowrap text-base text-center">{stop}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {day.times.slice(0, showRows).map((row: string[], i: number) => (
                                        <tr key={i}>
                                          {row.map((time: string, j: number) => (
                                            <td key={j} className="px-2 py-2 border-b border-r border-gray-100 text-black whitespace-nowrap text-base text-center">{time}</td>
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
                            <div className="text-base text-red-600 mt-2">Schedule stops do not match recorded bus stops for this route.</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 