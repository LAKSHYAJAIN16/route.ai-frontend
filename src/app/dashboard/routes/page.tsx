'use client';

import React from "react";
import Sidebar from "../../../components/Sidebar";
import Map, { NavigationControl, Marker, Popup, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { getRoutes } from '../data';
import Head from "next/head";

const center = { lat: 43.5139, lng: -79.865 }; // Centered between all stops

type Route = any;
type Stop = any;

// Haversine formula to calculate distance between two lat/lng points in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getRouteLengthKm(coords: number[][]) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lon1, lat1] = coords[i - 1];
    const [lon2, lat2] = coords[i];
    total += haversineDistance(lat1, lon1, lat2, lon2);
  }
  return total;
}

export default function RoutesPage() {
  return (
    <>
      <Head>
        <title>Routes</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Sidebar */}
      <Sidebar selected="routes" />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#2d2363] mb-2">Routes</h1>
        </div>
        {/* Route selection dropdown */}
        <div className="flex justify-center mb-6">
          <select
            className="border rounded px-4 py-2 text-lg text-[#2d2363] font-semibold bg-white shadow"
            value={selectedRouteId}
            onChange={e => setSelectedRouteId(e.target.value)}
          >
            {routes.map((route: Route) => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
        </div>
        {/* Path length and estimated time */}
        <div className="flex justify-center mb-6 text-[#2d2363] text-lg font-medium">
          <span>
            Total path length: {routeLengthKm.toFixed(2)} km &nbsp;|&nbsp; Estimated time: {estimatedTimeMin} min
          </span>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-center min-h-[600px]">
          <div className="w-full h-[600px] max-w-[1200px] mx-auto flex items-center justify-center">
            {loading ? (
              <div className="text-[#5f4bb6] text-xl font-semibold animate-pulse">Loading routes...</div>
            ) : (
              <Map
                {...viewState}
                mapboxAccessToken={"pk.eyJ1IjoibGFrc2h5YWphaW4xNiIsImEiOiJjbWRkdWt3NTUwOHdjMnJweGdxdTlkeDloIn0.BRAfoSmF17OkVtcq85ACgQ"}
                onMove={handleMove}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
              >
                {selectedRoute && selectedRoute.routeCoordinates.length > 1 && lineGeoJSON && lineLayer && (
                  <Source id="route" type="geojson" data={lineGeoJSON}>
                    <Layer {...(lineLayer as any)} />
                  </Source>
                )}
                {selectedRoute && selectedRoute.stops.map((stop: Stop) => (
                  <Marker
                    key={stop.id}
                    longitude={stop.lng}
                    latitude={stop.lat}
                    anchor="bottom"
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: selectedRoute.color,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 20,
                        border: '2px solid white',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                      }}
                      aria-label={stop.label}
                      onMouseEnter={() => setHovered(stop.id)}
                      onMouseLeave={() => setHovered(h => (h === stop.id ? null : h))}
                    >
                      {stop.id}
                    </span>
                    {hovered === stop.id && (
                      <Popup 
                        longitude={stop.lng} 
                        latitude={stop.lat} 
                        anchor="top" 
                        closeButton={false}
                      >
                        <span style={{ color: '#222' }}>{stop.label}</span>
                      </Popup>
                    )}
                  </Marker>
                ))}
                <NavigationControl />
              </Map>
            )}
          </div>
        </div>
      </main>
    </>
  );
} 