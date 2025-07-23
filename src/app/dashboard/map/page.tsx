"use client";
import React from "react";
import Sidebar from "../../../components/Sidebar";
import Map, { NavigationControl, Source, Layer, Popup, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { getRoutes, getUserPositions, getWaitingUsers, getBuses } from '../data';
import Head from "next/head";

export default function MapPage() {
  return (
    <>
      <Head>
        <title>Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        {/* Sidebar stays visible */}
        <Sidebar selected="map" />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#2d2363] mb-2">Map</h1>
            {/* Top buttons below title (hidden while loading) */}
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-center min-h-[600px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#5f4bb6] border-t-transparent rounded-full animate-spin" />
              <div className="text-xl font-semibold text-[#2d2363]">Refreshing your map....</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 