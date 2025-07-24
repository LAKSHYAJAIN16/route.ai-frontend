"use client";
import React from "react";
import Sidebar from '../../../components/Sidebar';
import { FiClock, FiActivity, FiUserCheck, FiBarChart2, FiMapPin, FiMap, FiTrendingUp, FiUsers, FiDollarSign } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import { NavigationControl } from 'react-map-gl/mapbox';
import ReactMapGL, { Popup } from 'react-map-gl/mapbox';
import { demoTrips } from '../data';
import { useState } from 'react';
import { Marker } from 'react-map-gl/mapbox';
import { getRoutes } from '../data';
import Head from "next/head";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from "uuid";

// Mock data
const waitingTime = 12; // min
const routeTime = 19; // min
const peopleWaiting = 47;
const salesToday = 320;

const peopleByHourData = [
  { hour: '6am', Route12: 5, Route13: 3, Route14: 2, Route15: 1 },
  { hour: '7am', Route12: 12, Route13: 8, Route14: 6, Route15: 4 },
  { hour: '8am', Route12: 22, Route13: 15, Route14: 10, Route15: 7 },
  { hour: '9am', Route12: 18, Route13: 12, Route14: 8, Route15: 6 },
  { hour: '10am', Route12: 15, Route13: 10, Route14: 7, Route15: 5 },
  { hour: '11am', Route12: 10, Route13: 7, Route14: 5, Route15: 3 },
  { hour: '12pm', Route12: 14, Route13: 9, Route14: 6, Route15: 4 },
  { hour: '1pm', Route12: 16, Route13: 11, Route14: 8, Route15: 5 },
  { hour: '2pm', Route12: 13, Route13: 8, Route14: 6, Route15: 4 },
  { hour: '3pm', Route12: 19, Route13: 13, Route14: 9, Route15: 7 },
  { hour: '4pm', Route12: 21, Route13: 15, Route14: 10, Route15: 8 },
  { hour: '5pm', Route12: 25, Route13: 18, Route14: 12, Route15: 9 },
  { hour: '6pm', Route12: 20, Route13: 14, Route14: 9, Route15: 6 },
  { hour: '7pm', Route12: 12, Route13: 8, Route14: 5, Route15: 3 },
];

const salesByHourData = [
  { hour: '6am', sales: 10 },
  { hour: '7am', sales: 25 },
  { hour: '8am', sales: 40 },
  { hour: '9am', sales: 35 },
  { hour: '10am', sales: 28 },
  { hour: '11am', sales: 22 },
  { hour: '12pm', sales: 30 },
  { hour: '1pm', sales: 32 },
  { hour: '2pm', sales: 27 },
  { hour: '3pm', sales: 38 },
  { hour: '4pm', sales: 41 },
  { hour: '5pm', sales: 45 },
  { hour: '6pm', sales: 36 },
  { hour: '7pm', sales: 20 },
];

const heatmapStops = [
  { stop: 'Main & 1st', lat: 43.513, lng: -79.882, count: 12 },
  { stop: 'Maple & 2nd', lat: 43.515, lng: -79.880, count: 8 },
  { stop: 'Oak & 3rd', lat: 43.517, lng: -79.878, count: 15 },
  { stop: 'Pine & 4th', lat: 43.519, lng: -79.876, count: 5 },
  { stop: 'Birch & 5th', lat: 43.521, lng: -79.874, count: 7 },
];

const peopleWaitingList = [
  { stop: 'Main & 1st', count: 12 },
  { stop: 'Oak & 3rd', count: 15 },
  { stop: 'Maple & 2nd', count: 8 },
  { stop: 'Birch & 5th', count: 7 },
  { stop: 'Pine & 4th', count: 5 },
];

const commonDestinations = [
  { destination: 'Central Station', count: 42 },
  { destination: 'Mall', count: 28 },
  { destination: 'Library', count: 19 },
  { destination: 'Community Center', count: 15 },
  { destination: 'Park', count: 12 },
];

// Mock data additions
const liveBuses = [
  { id: 'Bus 12A', lat: 43.515, lng: -79.88, route: 'Route 12', status: 'On Time' },
  { id: 'Bus 13B', lat: 43.517, lng: -79.878, route: 'Route 13', status: 'Delayed' },
  { id: 'Bus 14C', lat: 43.519, lng: -79.876, route: 'Route 14', status: 'On Time' },
];

const recentFeedback = [
  { user: 'Alice', time: '09:12', comment: 'Bus was clean and on time.' },
  { user: 'Bob', time: '08:47', comment: 'Had to wait a bit longer than usual.' },
  { user: 'Carol', time: '08:15', comment: 'Driver was very helpful.' },
  { user: 'Dave', time: '07:55', comment: 'Crowded during rush hour.' },
  { user: 'Eve', time: '07:30', comment: 'App made it easy to track my bus.' },
];

const alerts = [
  { id: 1, type: 'info', message: 'Route 13 is experiencing minor delays due to roadwork.' },
  { id: 2, type: 'warning', message: 'Bus 14C is running at reduced capacity today.' },
  { id: 3, type: 'success', message: 'All other routes are operating normally.' },
];

export default function DataPage() {
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedDisplay, setSelectedDisplay] = useState('all');
  const [selectedTime, setSelectedTime] = useState('today');
  const [selectedMode, setSelectedMode] = useState('heatmap');
  const router = useRouter();
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [selectedDataItems, setSelectedDataItems] = useState<string[]>([]);
  const [selectionEnabled, setSelectionEnabled] = useState(false); // NEW: controls if selection is allowed
  const [routesData, setRoutesData] = useState<any[] | null>(null);
  React.useEffect(() => {
    getRoutes().then(setRoutesData);
  }, []);

  // Helper to toggle selection for any card
  const toggleSelect = (key: string) => {
    if (!selectionEnabled) return;
    setSelectedDataItems(sel => sel.includes(key) ? sel.filter(k => k !== key) : [...sel, key]);
  };

  // Helper to prevent card selection when interacting with dropdowns
  const stopPropagation = (e: React.MouseEvent | React.ChangeEvent) => e.stopPropagation();

  return (
    <>
      <title>Data Analytics</title>
      <link rel="icon" href="/favicon.ico" />
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        <Sidebar selected="data" />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border mb-8 max-w-7xl mx-auto">
            <div className="flex items-center mb-5">
              <h1 className="text-3xl font-bold text-[#2d2363] mr-2">Data</h1>
              {!selectionEnabled && (
                <button
                  className="ml-3 px-5 py-2 rounded-full font-semibold text-white shadow-md bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 focus:outline-none text-base cursor-pointer transition-all duration-300 hover:scale-105 animated-gradient"
                  style={{ letterSpacing: '0.02em', boxShadow: '0 2px 8px 0 rgba(80, 0, 80, 0.10)' }}
                  onClick={() => {
                    setSelectionEnabled(true);
                  }}
                >
                  Generate Insights
                </button>
              )}
            </div>
            {/* Instructional text for selection mode */}
            {selectionEnabled && (
              <div className="mb-4 text-[#5f4bb6] text-base font-medium animate-pulse">Click on a datapoint to add it!</div>
            )}
            {/* Top stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { key: 'waitingTime', icon: <FiClock className="w-6 h-6" />, value: `${waitingTime} min`, label: 'Avg. Waiting Time', sub: '-4.3% Down from yesterday', color: 'bg-[#edeaff] text-[#5f4bb6]' },
                { key: 'routeTime', icon: <FiActivity className="w-6 h-6" />, value: `${routeTime} min`, label: 'Avg. Route Time', sub: '+2.1% Up from last week', color: 'bg-[#e0f2fe] text-[#0284c7]' },
                { key: 'peopleWaiting', icon: <FiUserCheck className="w-6 h-6" />, value: peopleWaiting, label: 'People Waiting', sub: '+5.0% Up from last hour', color: 'bg-[#fef9c3] text-[#eab308]' },
                { key: 'salesToday', icon: <FiBarChart2 className="w-6 h-6" />, value: salesToday, label: 'Sales Today', sub: '+3.2% Up from yesterday', color: 'bg-[#f3e8ff] text-[#a21caf]' },
              ].map(item => (
                <div
                  key={item.key}
                  className={`bg-white rounded-xl p-6 flex flex-col gap-2 shadow-sm border transition duration-200 select-none ${selectionEnabled ? 'cursor-pointer' : ''} ${selectionEnabled && selectedDataItems.includes(item.key) ? 'ring-4 ring-[#7f5af0] border-[#5f4bb6] scale-105' : selectionEnabled ? 'hover:ring-2 hover:ring-[#5f4bb6]' : ''}`}
                  onClick={() => selectionEnabled && toggleSelect(item.key)}
                >
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${item.color}`}>
                    {item.icon}
                  </span>
                  <div className="text-2xl font-bold text-[#2d2363]">{item.value}</div>
                  <div className="text-sm text-[#b0b0b0]">{item.label}</div>
                  <div className="text-xs font-medium text-green-500">{item.sub}</div>
                </div>
              ))}
            </div>
            {/* Graphs row */}
            <div className="flex flex-col gap-8 mb-10">
              {/* People on each route by hour */}
              <div
                className={`bg-white rounded-xl p-6 shadow-sm border flex flex-col transition duration-200 select-none ${selectionEnabled ? 'cursor-pointer' : ''} ${selectionEnabled && selectedDataItems.includes('ridersByHour') ? 'ring-4 ring-[#7f5af0] border-[#5f4bb6] scale-105' : selectionEnabled ? 'hover:ring-2 hover:ring-[#5f4bb6]' : ''}`}
                onClick={() => selectionEnabled && toggleSelect('ridersByHour')}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-[#edeaff] text-[#5f4bb6] rounded-full">
                    <FiUsers className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-semibold text-[#2d2363]">Riders by hour</span>
                </div>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%" className="select-none">
                    <LineChart data={peopleByHourData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }} />
                      <Legend />
                      <Line type="monotone" dataKey="Route12" stroke="#5f4bb6" strokeWidth={3} dot={false} name="Route 12" />
                      <Line type="monotone" dataKey="Route13" stroke="#f7b500" strokeWidth={3} dot={false} name="Route 13" />
                      <Line type="monotone" dataKey="Route14" stroke="#2ee6a6" strokeWidth={3} dot={false} name="Route 14" />
                      <Line type="monotone" dataKey="Route15" stroke="#ef4444" strokeWidth={3} dot={false} name="Route 15" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Sales by hour */}
              <div
                className={`bg-white rounded-xl p-6 shadow-sm border flex flex-col transition duration-200 select-none ${selectionEnabled ? 'cursor-pointer' : ''} ${selectionEnabled && selectedDataItems.includes('salesByHour') ? 'ring-4 ring-[#7f5af0] border-[#5f4bb6] scale-105' : selectionEnabled ? 'hover:ring-2 hover:ring-[#5f4bb6]' : ''}`}
                onClick={() => selectionEnabled && toggleSelect('salesByHour')}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-[#f3e8ff] text-[#a21caf] rounded-full">
                    <FiBarChart2 className="w-5 h-5" />
                  </span>
                  <span className="text-lg font-semibold text-[#2d2363]">Sales by Hour</span>
                </div>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%" className="select-none">
                    <BarChart data={salesByHourData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#b0b0b0', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee' }} />
                      <Bar dataKey="sales" fill="#a21caf" name="Sales" barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Heatmap card, styled like the graph cards */}
            <div
              className={`bg-white rounded-xl p-6 shadow-sm border flex flex-col mb-8 transition duration-200 select-none ${selectionEnabled ? 'cursor-pointer' : ''} ${selectionEnabled && selectedDataItems.includes('tripHeatmap') ? 'ring-4 ring-[#7f5af0] border-[#5f4bb6] scale-105' : selectionEnabled ? 'hover:ring-2 hover:ring-[#5f4bb6]' : ''}`}
              onClick={() => selectionEnabled && toggleSelect('tripHeatmap')}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-[#edeaff] text-[#5f4bb6] rounded-full">
                  <FiMapPin className="w-5 h-5" />
                </span>
                <span className="text-lg font-semibold text-[#2d2363]">Rider data</span>
              </div>
              {/* Dropdowns row */}
              <div className="flex flex-row gap-4 mb-4">
                <div>
                  <label htmlFor="route-select" className="block text-sm font-medium text-[#2d2363] mb-1">Routes</label>
                  <select
                    id="route-select"
                    className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[#2d2363] bg-[#f7f8fa] focus:outline-none focus:ring-2 focus:ring-[#5f4bb6]"
                    value={selectedRoute}
                    onChange={e => { stopPropagation(e); setSelectedRoute(e.target.value); }}
                    onClick={stopPropagation}
                    onMouseDown={stopPropagation}
                  >
                    <option value="all">All Routes</option>
                    <option value="12">Route 12</option>
                    <option value="13">Route 13</option>
                    <option value="14">Route 14</option>
                    <option value="15">Route 15</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="display-select" className="block text-sm font-medium text-[#2d2363] mb-1">Display</label>
                  <select
                    id="display-select"
                    className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[#2d2363] bg-[#f7f8fa] focus:outline-none focus:ring-2 focus:ring-[#5f4bb6]"
                    value={selectedDisplay}
                    onChange={e => { stopPropagation(e); setSelectedDisplay(e.target.value); }}
                    onClick={stopPropagation}
                    onMouseDown={stopPropagation}
                  >
                    <option value="all">All</option>
                    <option value="start-location">Starting location</option>
                    <option value="start-stop">Starting bus stops</option>
                    <option value="end-stop">Ending bus stops</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="time-select" className="block text-sm font-medium text-[#2d2363] mb-1">Time</label>
                  <select
                    id="time-select"
                    className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[#2d2363] bg-[#f7f8fa] focus:outline-none focus:ring-2 focus:ring-[#5f4bb6]"
                    value={selectedTime}
                    onChange={e => { stopPropagation(e); setSelectedTime(e.target.value); }}
                    onClick={stopPropagation}
                    onMouseDown={stopPropagation}
                  >
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mode-select" className="block text-sm font-medium text-[#2d2363] mb-1">Mode</label>
                  <select
                    id="mode-select"
                    className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-[#2d2363] bg-[#f7f8fa] focus:outline-none focus:ring-2 focus:ring-[#5f4bb6]"
                    value={selectedMode}
                    onChange={e => { stopPropagation(e); setSelectedMode(e.target.value); }}
                    onClick={stopPropagation}
                    onMouseDown={stopPropagation}
                  >
                    <option value="heatmap">Heatmap</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>
              </div>
              <div className="w-full h-[500px] md:h-[600px] bg-[#f7f8fa] rounded-xl overflow-hidden">
                <HeatmapTripsFullWidth selectedRoute={selectedRoute} selectedDisplay={selectedDisplay} selectedTime={selectedTime} selectedMode={selectedMode} routesData={routesData} />
              </div>
            </div>
          </div>
          {selectionEnabled && (
            <div
              className="fixed left-1/2 bottom-8 flex flex-col items-center justify-center gap-1"
              style={{ transform: 'translateX(-50%)', maxWidth: '80vw', width: '100%', zIndex: 30 }}
            >
              <button
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white text-base font-semibold rounded-full py-2 px-8 shadow-md focus:outline-none cursor-pointer transition-all duration-300 hover:scale-105 animated-gradient"
                style={{ letterSpacing: '0.02em', boxShadow: '0 2px 8px 0 rgba(80, 0, 80, 0.10)' }}
                disabled={selectedDataItems.length === 0}
                onClick={() => {
                  // Prevent export if routesData is not loaded and tripHeatmap is selected
                  if (selectedDataItems.includes('tripHeatmap') && !routesData) {
                    alert('Map data is still loading. Please wait a moment and try again.');
                    return;
                  }
                  // Collect only the selected data items and send as array of objects
                  const allData = {
                    waitingTime: { label: 'Avg. Waiting Time', value: waitingTime, unit: 'min' },
                    routeTime: { label: 'Avg. Route Time', value: routeTime, unit: 'min' },
                    peopleWaiting: { label: 'People Waiting', value: peopleWaiting },
                    salesToday: { label: 'Sales Today', value: salesToday },
                    peopleByHourData: { label: 'Riders by Hour', value: peopleByHourData },
                    salesByHourData: { label: 'Sales by Hour', value: salesByHourData },
                    heatmapStops: { label: 'Heatmap Stops', value: heatmapStops },
                    peopleWaitingList: { label: 'People Waiting List', value: peopleWaitingList },
                    commonDestinations: { label: 'Common Destinations', value: commonDestinations },
                    liveBuses: { label: 'Live Buses', value: liveBuses },
                    recentFeedback: { label: 'Recent Feedback', value: recentFeedback },
                    alerts: { label: 'Alerts', value: alerts }
                  };
                  // Special handling for tripHeatmap selection
                  let tripHeatmapPoints: any[] = [];
                  if (selectedDataItems.includes('tripHeatmap')) {
                    // Reproduce the points logic from HeatmapTripsFullWidth
                    let filteredTrips = demoTrips;
                    if (selectedRoute !== 'all') {
                      filteredTrips = demoTrips.filter(trip => trip.routeId === selectedRoute);
                    }
                    // Build points array based on display type
                    let pts: { lng: number; lat: number; type: string; tripId: string }[] = [];
                    function findStopLatLng(routeId: string, stopId: string | undefined) {
                      if (!Array.isArray(routesData)) return undefined;
                      const route = routesData.find((r: any) => r.id === routeId);
                      if (!route || !Array.isArray(route.stops)) return undefined;
                      const stop = route.stops.find((s: any) => s.id === stopId);
                      if (!stop) return undefined;
                      return { lat: stop.lat, lng: stop.lng };
                    }
                    filteredTrips.forEach(trip => {
                      // a) Starting position
                      pts.push({ lng: trip.startLng, lat: trip.startLat, type: 'start-position', tripId: trip.id });
                      // b) Starting bus stop
                      const startStop = findStopLatLng(trip.routeId, trip.startStopId);
                      if (startStop) {
                        pts.push({ lng: startStop.lng, lat: startStop.lat, type: 'start-stop', tripId: trip.id });
                      }
                      // c) Ending bus stop
                      const endStop = findStopLatLng(trip.routeId, trip.endStopId);
                      if (endStop) {
                        pts.push({ lng: endStop.lng, lat: endStop.lat, type: 'end-stop', tripId: trip.id });
                      }
                    });
                    // Optionally filter by display type
                    if (selectedDisplay === 'start-location') {
                      pts = pts.filter(pt => pt.type === 'start-position');
                    } else if (selectedDisplay === 'start-stop') {
                      pts = pts.filter(pt => pt.type === 'start-stop');
                    } else if (selectedDisplay === 'end-stop') {
                      pts = pts.filter(pt => pt.type === 'end-stop');
                    }
                    tripHeatmapPoints = pts;
                  }
                  // Compose the array to send
                  const selectedDataArr = selectedDataItems.map(key => {
                    if (key === 'tripHeatmap') {
                      return {
                        key,
                        label: 'Trip Heatmap Points',
                        value: tripHeatmapPoints,
                        filters: {
                          selectedRoute,
                          selectedDisplay,
                          selectedTime,
                          selectedMode
                        }
                      };
                    }
                    // Map UI selection keys to data arrays
                    if (key === 'ridersByHour' && Array.isArray(peopleByHourData) && peopleByHourData.length > 0) {
                      console.log('Exporting peopleByHourData:', peopleByHourData);
                      return {
                        key,
                        label: 'Riders by Hour',
                        value: peopleByHourData,
                        filters: {
                          selectedRoute,
                          selectedDisplay,
                          selectedTime,
                          selectedMode
                        }
                      };
                    }
                    if (key === 'salesByHour' && Array.isArray(salesByHourData) && salesByHourData.length > 0) {
                      console.log('Exporting salesByHourData:', salesByHourData);
                      return {
                        key,
                        label: 'Sales by Hour',
                        value: salesByHourData,
                        filters: {
                          selectedRoute,
                          selectedDisplay,
                          selectedTime,
                          selectedMode
                        }
                      };
                    }
                    if (allData[key] && key !== 'peopleByHourData' && key !== 'salesByHourData') {
                      return {
                        key,
                        ...allData[key],
                        filters: {
                          selectedRoute,
                          selectedDisplay,
                          selectedTime,
                          selectedMode
                        }
                      };
                    }
                    return null;
                  }).filter(Boolean);
                  if (!selectedDataArr.length) {
                    alert('No data selected or available to send.');
                    return;
                  }
                  const dataString = JSON.stringify(selectedDataArr);
                  console.log('Selected Data Array:', selectedDataArr);
                  console.log('Data String:', dataString);
                  if (dataString.length > 1800) {
                    try {
                      if (typeof window !== 'undefined' && window.sessionStorage) {
                        const storageKey = `insights-data-${uuidv4()}`;
                        sessionStorage.setItem(storageKey, dataString);
                        console.log('Navigating with dataKey:', storageKey);
                        setTimeout(() => {
                          router.push(`/dashboard/insights/feedback-chat?dataKey=${storageKey}`);
                        }, 50);
                      } else {
                        alert('Session storage is not available. Please use a modern browser.');
                      }
                    } catch (e) {
                      alert('Failed to store data for transfer. Please try again.');
                    }
                  } else {
                    const dataParam = encodeURIComponent(dataString);
                    console.log('Navigating with data param:', `/dashboard/insights/feedback-chat?data=${dataParam}`);
                    router.push(`/dashboard/insights/feedback-chat?data=${dataParam}`);
                  }
                }}
              >
                Next
              </button>
              <button
                className="bg-red-500 text-white text-xs font-semibold rounded-full py-1 px-4 hover:bg-red-600 transition-colors flex items-center mt-1"
                style={{ letterSpacing: '0.02em', boxShadow: '0 2px 8px 0 rgba(80, 0, 80, 0.10)' }}
                onClick={() => { setSelectionEnabled(false); setSelectedDataItems([]); }}
              >
                <span className="mr-1">&#8592;</span>Back
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// --- Full-width heatmap with hover labels and navigation ---
type HoveredPoint = {
  lng: number;
  lat: number;
  type: string;
  tripId: string;
} | null;

function HeatmapTripsFullWidth({ selectedRoute, selectedDisplay, selectedTime, selectedMode, routesData }: { selectedRoute: string, selectedDisplay: string, selectedTime: string, selectedMode: string, routesData: any[] | null }) {
  // All hooks at the top!
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [hovered, setHovered] = React.useState<HoveredPoint>(null);
  const [viewState, setViewState] = React.useState({
    longitude: -79.865,
    latitude: 43.5139,
    zoom: 12,
  });
  React.useEffect(() => {
    // This useEffect is now redundant as routesData is passed as a prop
    // getRoutes().then(setRoutesData);
  }, []);

  const points = React.useMemo(() => {
    if (!routesData) return [];
    // Filter trips by route
    let filteredTrips = demoTrips;
    if (selectedRoute !== 'all') {
      filteredTrips = demoTrips.filter(trip => trip.routeId === selectedRoute);
    }

    // Build points array based on display type
    let pts: { lng: number; lat: number; type: string; tripId: string }[] = [];
    // Helper to find stop lat/lng by stopId and routeId
    function findStopLatLng(routeId: string, stopId: string | undefined) {
      if (!routesData || !stopId) return undefined;
      const route = routesData.find((r: any) => r.id === routeId);
      if (!route || !Array.isArray(route.stops)) return undefined;
      const stop = route.stops.find((s: any) => s.id === stopId);
      if (!stop) return undefined;
      return { lat: stop.lat, lng: stop.lng };
    }
    filteredTrips.forEach(trip => {
      // a) Starting position
      pts.push({ lng: trip.startLng, lat: trip.startLat, type: 'start-position', tripId: trip.id });
      // b) Starting bus stop
      const startStop = findStopLatLng(trip.routeId, trip.startStopId);
      if (startStop) {
        pts.push({ lng: startStop.lng, lat: startStop.lat, type: 'start-stop', tripId: trip.id });
      }
      // c) Ending bus stop
      const endStop = findStopLatLng(trip.routeId, trip.endStopId);
      if (endStop) {
        pts.push({ lng: endStop.lng, lat: endStop.lat, type: 'end-stop', tripId: trip.id });
      }
    });
    // Optionally filter by display type
    if (selectedDisplay === 'start-location') {
      pts = pts.filter(pt => pt.type === 'start-position');
    } else if (selectedDisplay === 'start-stop') {
      pts = pts.filter(pt => pt.type === 'start-stop');
    } else if (selectedDisplay === 'end-stop') {
      pts = pts.filter(pt => pt.type === 'end-stop');
    }
    return pts;
  }, [selectedRoute, selectedDisplay, routesData]);

  const geojson = React.useMemo(() => ({
    type: 'FeatureCollection' as const,
    features: points.map(pt => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [pt.lng, pt.lat] },
      properties: { type: pt.type, tripId: pt.tripId },
    })),
  }), [points]);

  if (!routesData) return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[#5f4bb6] text-lg font-semibold">Loading map data...</div>
    </div>
  );

  return (
    <div className="w-full h-full">
      <ReactMapGL
        mapboxAccessToken={"pk.eyJ1IjoibGFrc2h5YWphaW4xNiIsImEiOiJjbWRkdWt3NTUwOHdjMnJweGdxdTlkeDloIn0.BRAfoSmF17OkVtcq85ACgQ"}
        {...viewState}
        onMove={evt => setViewState(v => ({ ...v, ...evt.viewState }))}
        interactive={true}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {selectedMode === 'heatmap' ? (
          <Source id="trips-heatmap" type="geojson" data={geojson}>
            <Layer
              id="trips-heatmap-layer"
              type="heatmap"
              maxzoom={15}
              paint={{
                // Make the heatmap more intense and larger when points are close together
                "heatmap-weight": 1,
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 3],
                "heatmap-radius": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  0, 10,
                  9, 20,
                  12, 40,
                  15, 60
                ],
                "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 0.7],
                "heatmap-color": [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0, "rgba(33,102,172,0)",
                  0.2, "rgb(103,169,207)",
                  0.4, "rgb(209,229,240)",
                  0.6, "rgb(253,219,199)",
                  0.8, "rgb(239,138,98)",
                  1, "rgb(178,24,43)"
                ]
              }}
            />
          </Source>
        ) : (
          points.length > 0 && points.map((pt, i) => {
            // Find the trip for this point
            const trip = demoTrips.find(t => t.id === pt.tripId);
            // Human-friendly type label and color
            let typeLabel = '';
            let color = '#5f4bb6';
            if (pt.type === 'start-position') { typeLabel = 'Starting Position'; color = '#2563eb'; }
            else if (pt.type === 'start-stop') { typeLabel = 'Starting Bus Stop'; color = '#22c55e'; }
            else if (pt.type === 'end-stop') { typeLabel = 'Ending Bus Stop'; color = '#ef4444'; }
            else { typeLabel = pt.type; color = '#5f4bb6'; }
            // Format time
            let timeLabel = trip?.startTime ? `Time: ${trip.startTime}` : '';
            return (
              <Marker key={i} longitude={pt.lng} latitude={pt.lat} anchor="center">
                <span
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: color,
                    border: '2px solid white',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 12,
                    textAlign: 'center',
                    lineHeight: '18px',
                    cursor: 'pointer',
                  }}
                  title={typeLabel}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(h => (h === i ? null : h))}
                >
                  •
                </span>
                {hoveredIdx === i && (
                  <Popup longitude={pt.lng} latitude={pt.lat} anchor="top" closeButton={false} closeOnClick={false}>
                    <div style={{ minWidth: 180 }}>
                      <div style={{ color: color, fontWeight: 'bold', fontSize: 14 }}>{typeLabel}</div>
                      <div style={{ color: '#888', fontSize: 12 }}>Trip ID: {pt.tripId}</div>
                      {timeLabel && <div style={{ color: '#888', fontSize: 12 }}>{timeLabel}</div>}
                      {/* Show all coordinates for this trip */}
                      {trip && (
                        <>
                          <div style={{ color: '#222', fontSize: 12, marginTop: 6, fontWeight: 'bold' }}>Start Position:</div>
                          <div style={{ color: '#888', fontSize: 12 }}>({trip.startLat.toFixed(5)}, {trip.startLng.toFixed(5)})</div>
                          <div style={{ color: '#222', fontSize: 12, marginTop: 4, fontWeight: 'bold' }}>Start Stop:</div>
                          <div style={{ color: '#888', fontSize: 12 }}>({trip.startStopLat.toFixed(5)}, {trip.startStopLng.toFixed(5)})</div>
                          <div style={{ color: '#222', fontSize: 12, marginTop: 4, fontWeight: 'bold' }}>End Stop:</div>
                          <div style={{ color: '#888', fontSize: 12 }}>({trip.endStopLat.toFixed(5)}, {trip.endStopLng.toFixed(5)})</div>
                        </>
                      )}
                    </div>
                  </Popup>
                )}
              </Marker>
            );
          })
        )}
        <NavigationControl position="top-right" />
      </ReactMapGL>
    </div>
  );
} 