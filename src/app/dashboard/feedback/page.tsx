"use client";
import React, { useState } from "react";
import Sidebar from '../../../components/Sidebar';
import { useRouter } from 'next/navigation';
import { getFeedbackData, getRouteColors } from '../data';
import { useEffect } from "react";
import Head from "next/head";

// Define Feedback type
interface FeedbackType {
  id: number;
  time: string;
  date: string;
  remarks: string;
  route: string;
  waiting: string;
  routeTime: string;
  rating: number;
  important?: boolean;
}

export default function Feedback() {
  useEffect(() => {
    document.title = "Feedback";
    const link = document.querySelector("link[rel~='icon']");
    if (link) (link as HTMLLinkElement).href = "/favicon.ico";
  }, []);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [routeOptions, setRouteOptions] = useState<string[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [waitingSort, setWaitingSort] = useState<string>("");
  const [ratingSort, setRatingSort] = useState<string>("");
  const [showWaiting, setShowWaiting] = useState<boolean>(false);
  const [showRating, setShowRating] = useState<boolean>(false);
  const [showTime, setShowTime] = useState<boolean>(false);
  const [timeSort, setTimeSort] = useState<string>("");
  const [feedbackList, setFeedbackList] = useState<FeedbackType[]>([]);
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [routeColors, setRouteColors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  // Fetch feedback and route colors from Firebase
  React.useEffect(() => {
    async function fetchData() {
      const feedback = await getFeedbackData();
      setFeedbackList(feedback);
      setRouteOptions(Array.from(new Set(feedback.map(f => f.route))));
      const colors = await getRouteColors();
      setRouteColors(colors);
    }
    fetchData();
  }, []);

  // Filtering and sorting logic
  let filteredData = feedbackList;
  if (showImportantOnly) {
    filteredData = filteredData.filter(f => f.important);
  }
  if (selectedRoute) {
    filteredData = filteredData.filter(f => f.route === selectedRoute);
  }
  // Text search filter
  if (searchText.trim() !== "") {
    const lower = searchText.toLowerCase();
    filteredData = filteredData.filter(f =>
      f.remarks.toLowerCase().includes(lower) ||
      f.route.toLowerCase().includes(lower) ||
      f.date.toLowerCase().includes(lower)
    );
  }
  // Helper to parse 'waiting' string to number of minutes
  function parseMinutes(str: string) {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  if (showWaiting && waitingSort) {
    filteredData = [...filteredData].sort((a, b) => {
      const aMin = parseMinutes(a.waiting);
      const bMin = parseMinutes(b.waiting);
      if (waitingSort === "lowest-first") return aMin - bMin;
      if (waitingSort === "highest-first") return bMin - aMin;
      return 0;
    });
  }
  if (showRating && ratingSort) {
    filteredData = [...filteredData].sort((a, b) => {
      if (ratingSort === "highest-to-lowest") return b.rating - a.rating;
      if (ratingSort === "lowest-to-highest") return a.rating - b.rating;
      return 0;
    });
  }
  // Helper to parse time string (HH:MM) to minutes since midnight
  function parseTime(str: string) {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  }
  if (showTime && timeSort) {
    filteredData = [...filteredData].sort((a, b) => {
      const aTime = parseTime(a.time);
      const bTime = parseTime(b.time);
      if (timeSort === "latest-first") return bTime - aTime;
      if (timeSort === "earliest-first") return aTime - bTime;
      return 0;
    });
  }
  // Pagination state (must be after filteredData is defined)
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  React.useEffect(() => { setPage(1); }, [selectedRoute, waitingSort, ratingSort, showWaiting, showRating, showImportantOnly, itemsPerPage]);
  // Calculate range for display
  const startIdx = filteredData.length === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endIdx = Math.min(page * itemsPerPage, filteredData.length);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      const dropdown = document.getElementById('filter-dropdown');
      const button = document.getElementById('filter-button');
      if (
        showFilterDropdown &&
        dropdown &&
        !dropdown.contains(e.target as Node) &&
        button &&
        !button.contains(e.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    }
    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFilterDropdown]);

  return (
    <>
      <title>Feedback</title>
      <link rel="icon" href="/favicon.ico" />
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        <Sidebar selected="feedback" />
        <main className="flex-1 p-8">
 
          {/* Feedback Table */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-[#2d2363]">Feedback</h2>
              <button
                className="px-5 py-2 rounded-full font-semibold text-white shadow-md bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 focus:outline-none text-base cursor-pointer transition-all duration-300 hover:scale-105 animated-gradient"
                style={{
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 8px 0 rgba(80, 0, 80, 0.10)',
                }}
                onClick={() => {
                  const dataParam = encodeURIComponent(JSON.stringify(filteredData));
                  router.push(`/dashboard/insights/feedback-chat?data=${dataParam}`);
                }}
              >
                Generate Insights
              </button>
            </div>
            <div className="mb-4 flex items-center gap-2 relative">
              <button
                id="filter-button"
                className="border border-[#e5e7eb] rounded px-3 py-1 text-[#5f4bb6] flex items-center gap-1 relative"
                onClick={() => setShowFilterDropdown((v) => !v)}
              >
                <svg width="18" height="18" fill="none" stroke="#5f4bb6" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                Filter
              </button>
              {showFilterDropdown && (
                <div
                  id="filter-dropdown"
                  className="absolute left-0 top-12 bg-white border border-[#e5e7eb] rounded shadow-lg p-4 min-w-[220px] z-50"
                >
                  <div className="text-black font-semibold mb-2">Filter Options</div>
                  <div className="mb-3">
                    <label className="block text-black text-sm mb-1" htmlFor="route-select">Route</label>
                    <select
                      id="route-select"
                      className="w-full border border-[#e5e7eb] rounded px-2 py-1 text-black bg-white"
                      value={selectedRoute}
                      onChange={e => setSelectedRoute(e.target.value)}
                    >
                      <option value="">All Routes</option>
                      {routeOptions.map(route => (
                        <option key={route} value={route}>{route}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center text-black text-sm gap-2">
                      <input
                        type="checkbox"
                        checked={showTime}
                        onChange={() => setShowTime(v => !v)}
                      />
                      <span>Time</span>
                    </label>
                    {showTime && (
                      <div className="flex flex-col gap-1 ml-6">
                        <label className="inline-flex items-center text-black text-sm">
                          <input
                            type="radio"
                            name="timeSort"
                            value="latest-first"
                            checked={timeSort === "latest-first"}
                            onChange={() => setTimeSort("latest-first")}
                            className="mr-2"
                          />
                          Latest First
                        </label>
                        <label className="inline-flex items-center text-black text-sm">
                          <input
                            type="radio"
                            name="timeSort"
                            value="earliest-first"
                            checked={timeSort === "earliest-first"}
                            onChange={() => setTimeSort("earliest-first")}
                            className="mr-2"
                          />
                          Earliest First
                        </label>
                      </div>
                    )}
                    <label className="flex items-center text-black text-sm gap-2">
                      <input
                        type="checkbox"
                        checked={showImportantOnly}
                        onChange={() => setShowImportantOnly(v => !v)}
                      />
                      <span>Show important only</span>
                    </label>
                    <label className="flex items-center text-black text-sm gap-2">
                      <input
                        type="checkbox"
                        checked={showWaiting}
                        onChange={() => setShowWaiting(v => !v)}
                      />
                      <span>Waiting Time</span>
                    </label>
                    {showWaiting && (
                      <div className="flex flex-col gap-1 ml-6">
                        <label className="inline-flex items-center text-black text-sm">
                          <input
                            type="radio"
                            name="waitingSort"
                            value="lowest-first"
                            checked={waitingSort === "lowest-first"}
                            onChange={() => setWaitingSort("lowest-first")}
                            className="mr-2"
                          />
                          Lowest First
                        </label>
                        <label className="inline-flex items-center text-black text-sm">
                          <input
                            type="radio"
                            name="waitingSort"
                            value="highest-first"
                            checked={waitingSort === "highest-first"}
                            onChange={() => setWaitingSort("highest-first")}
                            className="mr-2"
                          />
                          Highest First
                        </label>
                      </div>
                    )}
                    <label className="flex items-center text-black text-sm gap-2">
                      <input
                        type="checkbox"
                        checked={showRating}
                        onChange={() => setShowRating(v => !v)}
                      />
                      <span>Rating</span>
                    </label>
                    {showRating && (
                      <div className="flex flex-col gap-1 ml-6">
                        <label className="inline-flex items-center text-black text-sm">
                          <input
                            type="radio"
                            name="ratingSort"
                            value="highest-to-lowest"
                            checked={ratingSort === "highest-to-lowest"}
                            onChange={() => setRatingSort("highest-to-lowest")}
                            className="mr-2"
                          />
                          Highest to Lowest
                        </label>
                        <label className="inline-flex items-center text-black text-sm">
                          <input
                            type="radio"
                            name="ratingSort"
                            value="lowest-to-highest"
                            checked={ratingSort === "lowest-to-highest"}
                            onChange={() => setRatingSort("lowest-to-highest")}
                            className="mr-2"
                          />
                          Lowest to Highest
                        </label>
                      </div>
                    )}
                  </div>
                  {/* Clear all filters button */}
                  <div className="mt-4 flex justify-center">
                    <button
                      className="border border-red-500 text-red-500 px-2 py-0.5 rounded-full text-xs cursor-pointer transition-colors duration-150 hover:bg-red-500 hover:text-white bg-transparent"
                      style={{ outline: 'none' }}
                      onClick={() => {
                        setSelectedRoute("");
                        setShowWaiting(false);
                        setWaitingSort("");
                        setShowRating(false);
                        setRatingSort("");
                        setShowImportantOnly(false);
                        setShowTime(false);
                        setTimeSort("");
                      }}
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-1 rounded border border-[#e5e7eb] bg-[#f7f8fa] focus:outline-none w-64 text-black"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-[#b0b0b0] text-left border-b">
                    <th className="py-2 px-4 font-medium">#</th>
                    <th className="py-2 px-4 font-medium">Time</th>
                    <th className="py-2 px-4 font-medium">Remarks</th>
                    <th className="py-2 px-4 font-medium">Route</th>
                    <th className="py-2 px-4 font-medium">Waiting Time</th>
                    <th className="py-2 px-4 font-medium">Route Time</th>
                    <th className="py-2 px-4 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((f) => (
                    <tr key={f.id} className="border-b hover:bg-[#f7f6fa] ">
                      <td className="py-2 px-4 align-top flex items-center gap-2 text-black">
                        {f.id}
                        {f.important && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold" title="Important">!
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-black align-top">
                        <div>{f.time}</div>
                        <div className="text-xs text-[#b0b0b0]">{f.date}</div>
                      </td>
                      <td className="py-2 px-4 align-top">
                        <span
                          className="text-[#5f4bb6] underline cursor-pointer bg-[#f7f6fa] px-1 rounded"
                          onClick={() => setSelectedFeedback(f)}
                        >
                          {f.remarks}
                        </span>
                      </td>
                      <td className="py-2 px-4 align-top">
                        <span className={`inline-block ${routeColors[f.route] || 'bg-gray-300'} text-white rounded px-2 py-1 text-xs font-semibold`}>{f.route}</span>
                      </td>
                      <td className="py-2 px-4 align-top text-black">{f.waiting}</td>
                      <td className="py-2 px-4 align-top text-black">{f.routeTime}</td>
                      <td className="py-2 px-4 align-top text-black">{f.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls - no rows per page dropdown */}
            <div className="flex justify-between items-center mt-4 px-2 text-[#7c88a1] text-sm select-none">
              {/* Left: Range */}
              <div className="min-w-[90px]">{startIdx}-{endIdx} of {filteredData.length}</div>
              {/* Right: Arrows and page info */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  className="w-7 h-7 flex items-center justify-center border border-[#e5e7eb] rounded disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <span className="text-lg">&#60;</span>
                </button>
                <span className="min-w-[40px] text-center">{page}/{totalPages || 1}</span>
                <button
                  className="w-7 h-7 flex items-center justify-center border border-[#e5e7eb] rounded disabled:opacity-50"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  aria-label="Next page"
                >
                  <span className="text-lg">&#62;</span>
                </button>
              </div>
            </div>
          </div>
          {/* Feedback Modal */}
          {selectedFeedback && (
            <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 shadow-lg min-w-[320px] max-w-[90vw] relative">
                <button
                  className="absolute top-2 right-2 text-black text-xl font-bold px-2 py-1 rounded hover:bg-gray-200"
                  onClick={() => setSelectedFeedback(null)}
                  aria-label="Close"
                >
                  ×
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-black">Feedback Details</h3>
                  {selectedFeedback.important && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-base font-bold" title="Important">!
                    </span>
                  )}
                </div>
                <div className="mb-2 text-black"><b>Time:</b> {selectedFeedback.time}</div>
                <div className="mb-2 text-black"><b>Date:</b> {selectedFeedback.date}</div>
                <div className="mb-2 text-black"><b>Remarks:</b> {selectedFeedback.remarks}</div>
                <div className="mb-2 text-black"><b>Route:</b> {selectedFeedback.route}</div>
                <div className="mb-2 text-black"><b>Waiting Time:</b> {selectedFeedback.waiting}</div>
                <div className="mb-2 text-black"><b>Route Time:</b> {selectedFeedback.routeTime}</div>
                <div className="mb-2 text-black"><b>Rating:</b> {selectedFeedback.rating}</div>
                <button
                  className={`mt-4 px-4 py-2 rounded text-white font-semibold ${selectedFeedback.important ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}
                  onClick={() => {
                    setFeedbackList(list => list.map(f =>
                      f.id === selectedFeedback.id ? { ...f, important: !f.important } : f
                    ));
                    setSelectedFeedback(f => f ? { ...f, important: !f.important } : f);
                  }}
                >
                  {selectedFeedback.important ? 'Remove important label' : 'Mark as important'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 