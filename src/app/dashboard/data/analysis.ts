// Utility: Haversine geodesic distance in meters
function geodesicDistance(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3; // meters
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

import { getRoutes, getFeedbackData } from '../data';

/**
 * Aggregates average wait time, ride time, rating, and feedback volume per stop.
 * @returns Array of stop stats with coordinates and route info.
 */
export async function aggregateStopStats() {
  const [routes, feedback] = await Promise.all([getRoutes(), getFeedbackData()]);
  // Flatten stops with route info
  const stops = routes.flatMap(route =>
    (route.stops || []).map((stop: any) => ({
      ...stop,
      route: route.id,
      routeName: route.name,
    }))
  );
  // Group feedback by stop and route
  const statsMap: Record<string, any> = {};
  for (const fb of feedback) {
    // Type assertion to access possible Firestore fields
    const f: any = fb;
    const stop_id = (typeof f.stop_id === 'string' && f.stop_id) || (typeof f.busStopId === 'string' && f.busStopId) || 'unknown';
    const key = `${f.route}|${stop_id}`;
    if (!statsMap[key]) statsMap[key] = { feedbacks: [], route: f.route, stop_id };
    statsMap[key].feedbacks.push(fb);
  }
  // Aggregate
  const result = Object.values(statsMap).map((entry: any) => {
    const { feedbacks, route, stop_id } = entry;
    const avg_wait_time = feedbacks.reduce((a: number, b: any) => a + (parseFloat(b.waiting) || 0), 0) / feedbacks.length;
    const avg_ride_time = feedbacks.reduce((a: number, b: any) => a + (parseFloat(b.routeTime) || 0), 0) / feedbacks.length;
    const avg_rating = feedbacks.reduce((a: number, b: any) => a + (b.rating || 0), 0) / feedbacks.length;
    const feedback_volume = feedbacks.length;
    // Find stop coordinates
    const stop = stops.find((s: any) => s.route === route && (s.id === stop_id || (typeof s.label === 'string' && s.label.includes(stop_id))));
    return {
      route,
      stop_id,
      avg_wait_time,
      avg_ride_time,
      avg_rating,
      feedback_volume,
      latitude: stop?.lat,
      longitude: stop?.lng,
      stop_label: stop?.label,
    };
  });
  return result;
}

/**
 * Suggests new stop coordinates on a city grid, at least 250m from all current stops.
 * @returns Array of suggested new stop coordinates.
 */
export async function suggestNewStopCoords(step = 0.002, minDistanceKm = 0.25) {
  const stopsStats = await aggregateStopStats();
  const lats = stopsStats.map(s => s.latitude).filter((v): v is number => typeof v === 'number');
  const lngs = stopsStats.map(s => s.longitude).filter((v): v is number => typeof v === 'number');
  const lat_min = Math.min(...lats);
  const lat_max = Math.max(...lats);
  const lon_min = Math.min(...lngs);
  const lon_max = Math.max(...lngs);
  // Generate grid
  const grid_points: { latitude: number; longitude: number }[] = [];
  for (let lat = lat_min; lat <= lat_max; lat += step) {
    for (let lon = lon_min; lon <= lon_max; lon += step) {
      grid_points.push({ latitude: lat, longitude: lon });
    }
  }
  // Filter candidates
  const suggestions = grid_points.filter(({ latitude, longitude }) => {
    return stopsStats.every(stop => {
      if (typeof stop.latitude !== 'number' || typeof stop.longitude !== 'number') return true;
      const dist = geodesicDistance(
        { latitude, longitude },
        { latitude: stop.latitude, longitude: stop.longitude }
      ) / 1000;
      return dist > minDistanceKm;
    });
  });
  return suggestions;
}

/**
 * Annotates each stop with active time buckets from feedback data.
 * @returns Array of { stop_id, time_bucket, feedback_count }
 */
export async function annotateStopsWithActivePeriods() {
  const feedback = await getFeedbackData();
  // Parse hour and bucket
  function getTimeBucket(hour: number) {
    if (hour < 6) return 'Late Night';
    if (hour < 9) return 'Morning Rush';
    if (hour < 12) return 'Late Morning';
    if (hour < 15) return 'Afternoon';
    if (hour < 18) return 'Evening Rush';
    if (hour < 21) return 'Evening';
    return 'Night';
  }
  const bucketMap: Record<string, Record<string, number>> = {};
  for (const fb of feedback) {
    // Type assertion to access possible Firestore fields
    const f: any = fb;
    const stop_id = (typeof f.stop_id === 'string' && f.stop_id) || (typeof f.busStopId === 'string' && f.busStopId) || 'unknown';
    const dateStr = (typeof f.date === 'string' && f.date) || (typeof f.timestamp === 'string' && f.timestamp) || '';
    const hour = dateStr ? (new Date(dateStr).getHours()) : null;
    if (stop_id && hour !== null) {
      const bucket = getTimeBucket(hour);
      if (!bucketMap[stop_id]) bucketMap[stop_id] = {};
      bucketMap[stop_id][bucket] = (bucketMap[stop_id][bucket] || 0) + 1;
    }
  }
  // Only keep high-activity periods (>3 feedbacks)
  const result: { stop_id: string; time_bucket: string; feedback_count: number }[] = [];
  for (const stop_id in bucketMap) {
    for (const bucket in bucketMap[stop_id]) {
      const count = bucketMap[stop_id][bucket];
      if (count > 3) {
        result.push({ stop_id, time_bucket: bucket, feedback_count: count });
      }
    }
  }
  return result;
}

/**
 * Suggests improved stop locations for each existing stop, at least minImprovementDistance km away, closest among candidates.
 * @returns Array of suggestions: { original_stop_id, route, original_lat, original_lon, suggested_lat, suggested_lon, active_time }
 */
export async function suggestImprovedStops(minImprovementDistance = 0.25) {
  const stopsStats = await aggregateStopStats();
  const candidates = await suggestNewStopCoords();
  const activePeriods = await annotateStopsWithActivePeriods();
  const suggestions = [];
  for (const stop of stopsStats) {
    if (typeof stop.latitude !== 'number' || typeof stop.longitude !== 'number') continue;
    // Find candidates farther than minImprovementDistance
    const farCandidates = candidates.filter(c => {
      const dist = geodesicDistance(
        { latitude: stop.latitude, longitude: stop.longitude },
        { latitude: c.latitude, longitude: c.longitude }
      ) / 1000;
      return dist > minImprovementDistance;
    });
    if (farCandidates.length > 0) {
      // Pick closest among far candidates
      farCandidates.sort((a, b) => {
        const da = geodesicDistance(
          { latitude: stop.latitude, longitude: stop.longitude },
          { latitude: a.latitude, longitude: a.longitude }
        );
        const db = geodesicDistance(
          { latitude: stop.latitude, longitude: stop.longitude },
          { latitude: b.latitude, longitude: b.longitude }
        );
        return da - db;
      });
      const best = farCandidates[0];
      // Find most active time
      const periods = activePeriods.filter(p => p.stop_id === stop.stop_id);
      const active_time = periods.sort((a, b) => b.feedback_count - a.feedback_count)[0]?.time_bucket || 'General';
      suggestions.push({
        original_stop_id: stop.stop_id,
        route: stop.route,
        original_lat: stop.latitude,
        original_lon: stop.longitude,
        suggested_lat: best.latitude,
        suggested_lon: best.longitude,
        active_time,
      });
    }
  }
  return suggestions;
} 