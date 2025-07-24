"use client";
import React from "react";
import Sidebar from "../../../components/Sidebar";
import Map, { NavigationControl, Source, Layer, Popup, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { routes as localRoutes, userPositions as localUserPositions, waitingUsers as localWaitingUsers, demoTrips as localBuses, UserPosition, WaitingUser, Bus, Trip } from '../data';
import Head from "next/head";

// Define Stop and Route types based on the data.ts structure
// If these are exported from data.ts, import them instead

type Stop = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

type Route = {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
  routeCoordinates: number[][];
};

export default function MapPage() {
  const [routes] = React.useState<Route[]>(localRoutes);
  const [userPositions] = React.useState<UserPosition[]>(localUserPositions);
  const [waitingUsers] = React.useState<WaitingUser[]>(localWaitingUsers);
  const [buses] = React.useState<(Bus | Trip)[]>(localBuses);
  const [loading] = React.useState(false);
  const [error] = React.useState<string | null>(null);

  // Defensive: allStops and userStops
  const allStops = React.useMemo<Stop[]>(() => {
    if (!routes || !Array.isArray(routes)) return [];
    return routes.flatMap((route) => Array.isArray(route.stops) ? route.stops : []);
  }, [routes]);
  const userStops = React.useMemo(() => {
    if (!routes || !Array.isArray(routes)) return [];
    return routes.flatMap((route) => Array.isArray(route.stops) ? route.stops.map((stop) => ({ ...stop, routeName: route.name, routeId: route.id })) : []);
  }, [routes]);

  const [viewState, setViewState] = React.useState({
    longitude: -79.865, // Corrected: longitude is negative
    latitude: 43.5139, // Corrected: latitude is positive
    zoom: 13,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    width: 1200,
    height: 600,
  });

  // Fix handleMove type for react-map-gl
  const handleMove = (evt: { viewState: any }) => {
    setViewState(prev => ({
      ...prev,
      ...evt.viewState,
      width: prev.width,
      height: prev.height,
      padding: prev.padding,
    }));
  };

  const [hoveredUserId, setHoveredUserId] = React.useState<string | null>(null);
  const [selectedMode, setSelectedMode] = React.useState('walking');

  // Button state
  const BUTTONS = [
    { key: 'walking', label: 'Users walking to bus stop' },
    { key: 'waiting', label: 'Users waiting at bus stop' },
    { key: 'buses', label: 'Buses' },
  ];

  // Defensive: if any are empty, show a message
  if (routes.length === 0 || userPositions.length === 0 || waitingUsers.length === 0 || buses.length === 0) {
    return (
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen items-center justify-center">
        <div className="text-[#5f4bb6] text-xl font-bold">Some map data is empty. Please check your local data file.</div>
      </div>
    );
  }

  return (
    <>
      <title>Map</title>
      <link rel="icon" href="/favicon.ico" />
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        {/* Sidebar */}
        <Sidebar selected="map" />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#2d2363] mb-2">Map</h1>
            {/* Top buttons below title */}
            <div className="flex gap-4 mt-2 mb-2 justify-center items-center">
              <button
                className="px-3 py-2 rounded bg-[#e5e7eb] text-[#2d2363] font-semibold shadow hover:bg-[#d1d5db] transition flex items-center gap-2"
                style={{ minWidth: 40 }}
                title="Refresh"
                onClick={() => window.location.reload()}
              >
                <span style={{ fontSize: 18, display: 'inline-block', lineHeight: 1 }}>⟳</span>
              </button>
              {BUTTONS.map(btn => (
                <button
                  key={btn.key}
                  className={`px-4 py-2 rounded font-semibold shadow transition ${selectedMode === btn.key
                    ? 'bg-[#2d2363] text-white' :
                      btn.key === 'walking' ? 'bg-[#edeaff] text-[#2d2363] hover:bg-[#d6d0f7]' :
                      btn.key === 'waiting' ? 'bg-[#eafff3] text-[#2d2363] hover:bg-[#c7f7e3]' :
                      'bg-[#fff7e6] text-[#2d2363] hover:bg-[#ffe2b8]'}`}
                  onClick={() => setSelectedMode(btn.key)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-center min-h-[600px]">
            <div className="w-full h-[600px] max-w-[1200px] mx-auto">
              <Map
                {...viewState}
                mapboxAccessToken={"pk.eyJ1IjoibGFrc2h5YWphaW4xNiIsImEiOiJjbWRkdWt3NTUwOHdjMnJweGdxdTlkeDloIn0.BRAfoSmF17OkVtcq85ACgQ"}
                onMove={handleMove}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
              >
                {/* Only show users walking to bus stop mode */}
                {selectedMode === 'walking' && (
                  <>
                    {/* Markers for users */}
                    {userPositions.map((user) => (
                      <React.Fragment key={user.id}>
                        <Marker
                          longitude={user.lng}
                          latitude={user.lat}
                          anchor="bottom"
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: '#2d2363',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: 12,
                              border: '2px solid white',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={() => setHoveredUserId(user.id)}
                            onMouseLeave={() => setHoveredUserId(h => (h === user.id ? null : h))}
                          >
                            •
                          </span>
                        </Marker>
                        {hoveredUserId === user.id && (
                          <Popup
                            longitude={user.lng}
                            latitude={user.lat}
                            anchor="top"
                            closeButton={false}
                            closeOnClick={false}
                            focusAfterOpen={false}
                          >
                            <div style={{ minWidth: 120 }}>
                              <div style={{ color: '#888', fontSize: 12 }}>({user.lat?.toFixed(5)}, {user.lng?.toFixed(5)})</div>
                              {(() => {
                                const stop = allStops.find((s) => s.id === user.busStopId);
                                return stop ? (
                                  <div style={{ color: '#5f4bb6', fontSize: 13, marginTop: 4 }}>
                                    Heading to: <b>{stop.label}</b>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </Popup>
                        )}
                        {/* Draw line to bus stop */}
                        {(() => {
                          const stop = allStops.find((s) => s.id === user.busStopId);
                          if (!stop) return null;
                          const isHovered = hoveredUserId === user.id;
                          return (
                            <Source
                              key={`line-${user.id}`}
                              id={`line-${user.id}`}
                              type="geojson"
                              data={{
                                type: "FeatureCollection",
                                features: [
                                  {
                                    type: "Feature",
                                    geometry: {
                                      type: "LineString",
                                      coordinates: [
                                        [user.lng, user.lat],
                                        [stop.lng, stop.lat],
                                      ],
                                    },
                                    properties: {},
                                  },
                                ],
                              }}
                            >
                              <Layer
                                id={`line-layer-${user.id}`}
                                type="line"
                                paint={{
                                  "line-color": isHovered ? "#5f4bb6" : "#bbb",
                                  "line-width": 2,
                                  "line-opacity": 0.7,
                                }}
                              />
                </Source>
                          );
                        })()}
                      </React.Fragment>
                    ))}
                  </>
                )}
                {/* Users waiting at bus stop mode: show heatmap */}
                {selectedMode === 'waiting' && (
                  <>
                    <Source
                      id="waiting-heatmap"
                      type="geojson"
                      data={{
                        type: "FeatureCollection",
                        features: (Array.from(new Set(waitingUsers.map(u => u.busStopId)))
                          .map(stopId => {
                            const stop = allStops.find((s) => s.id === stopId);
                            if (!stop) return undefined;
                            const count = waitingUsers.filter((u) => u.busStopId === stopId).length;
                            return {
                              type: "Feature" as const,
                              geometry: { type: "Point" as const, coordinates: [stop.lng, stop.lat] },
                              properties: { weight: count },
                            };
                          })
                          .filter((f) => !!f)) as any[],
                      }}
                    >
                      <Layer
                        id="waiting-heatmap-layer"
                        type="heatmap"
                        maxzoom={15}
                        paint={{
                          "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, 10, 1],
                          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 15, 3],
                          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 10, 15, 40],
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
                    {/* Markers for each bus stop with waiting users */}
                    {Array.from(new Set(waitingUsers.map(u => u.busStopId))).map(stopId => {
                      const stop = allStops.find((s) => s.id === stopId);
                      if (!stop) return null;
                      const usersAtStop = waitingUsers.filter((u) => u.busStopId === stopId);
                      const count = usersAtStop.length;
                      return (
                        <React.Fragment key={stopId}>
                <Marker
                  longitude={stop.lng}
                  latitude={stop.lat}
                  anchor="bottom"
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                              width: 32,
                              height: 32,
                      borderRadius: '50%',
                              background: '#5f4bb6',
                      color: 'white',
                      fontWeight: 'bold',
                              fontSize: 16,
                      border: '2px solid white',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                    }}
                            onMouseEnter={() => setHoveredUserId(stopId)}
                            onMouseLeave={() => setHoveredUserId(h => (h === stopId ? null : h))}
                  >
                            {count}
                  </span>
                        </Marker>
                        {hoveredUserId === stopId && (
                    <Popup 
                      longitude={stop.lng} 
                      latitude={stop.lat} 
                      anchor="top" 
                      closeButton={false}
                            closeOnClick={false}
                            focusAfterOpen={false}
                          >
                            <div style={{ minWidth: 120 }}>
                              <div style={{ color: '#5f4bb6', fontWeight: 'bold', fontSize: 14 }}>
                                {(() => {
                                  const route = routes.find((r) => Array.isArray(r.stops) && r.stops.some((s) => s.id === stop.id));
                                  return route ? `${route.id}:${stop.id}` : stop.id;
                                })()}
                              </div>
                              <div style={{ color: '#888', fontSize: 12 }}>({stop.lat?.toFixed(5)}, {stop.lng?.toFixed(5)})</div>
                              <div style={{ color: '#2d2363', fontSize: 13, marginTop: 4 }}>Waiting: <b>{count}</b></div>
                            </div>
                    </Popup>
                  )}
                      </React.Fragment>
                    );
                  })}
                  {/* Invisible markers for hover popups on individual users (optional, can remove if not needed) */}
                </>
              )}
              {/* Buses mode: show all buses as markers */}
              {selectedMode === 'buses' && (
                <>
                  {buses.map((bus) => {
                    // Use startLat/startLng for demoTrips
                    const lat = (bus as Trip).startLat ?? (bus as Bus).lat;
                    const lng = (bus as Trip).startLng ?? (bus as Bus).lng;
                    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return null;
                    const stop = allStops.find((s) => s.id === (bus as Bus).nextStopId);
                    return (
                      <React.Fragment key={bus.id}>
                        <Marker
                          longitude={lng}
                          latitude={lat}
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
                              background: '#fff7e6',
                              color: '#2d2363',
                              fontWeight: 'bold',
                              fontSize: 22,
                              border: '2px solid #ffb84c',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={() => setHoveredUserId(bus.id)}
                            onMouseLeave={() => setHoveredUserId(h => (h === bus.id ? null : h))}
                          >
                            🚌
                          </span>
                        </Marker>
                        {hoveredUserId === bus.id && (
                          <Popup
                            longitude={lng}
                            latitude={lat}
                            anchor="top"
                            closeButton={false}
                            closeOnClick={false}
                            focusAfterOpen={false}
                          >
                            <div style={{ minWidth: 140 }}>
                              <div style={{ color: '#ff8800', fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>
                                Route Number: {(bus as Bus).routeId}
                              </div>
                              {/* Passengers is not in demoTrips, so skip or fake */}
                              <div style={{ color: '#5f4bb6', fontSize: 13, marginBottom: 2 }}>
                                Next stop: <b>{stop ? stop.label : (bus as Bus).nextStopId}</b>
                              </div>
                              <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>({lat?.toFixed(5)}, {lng?.toFixed(5)})</div>
                            </div>
                          </Popup>
                        )}
                      </React.Fragment>
                    );
                  })}
                </>
              )}
              <NavigationControl />
            </Map>
          </div>
        </div>
      </main>
    </div>
    </>
  );
} 