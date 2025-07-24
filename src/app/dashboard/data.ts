// Central data and types for dashboard

import { db } from './fire';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc
} from 'firebase/firestore';

export interface FeedbackType {
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

export const feedbackData: FeedbackType[] = [
  { id: 1, time: "12:02", date: "July 21st", remarks: "Bus was clean and the driver was very friendly.", route: "12", waiting: "11 minutes", routeTime: "11 minutes", rating: 4, important: true },
  { id: 2, time: "13:15", date: "July 22nd", remarks: "Waited a bit too long at the stop, but the ride was smooth.", route: "13", waiting: "7 minutes", routeTime: "10 minutes", rating: 2 },
  { id: 3, time: "14:30", date: "July 23rd", remarks: "Appreciated the air conditioning on a hot day!", route: "14", waiting: "15 minutes", routeTime: "13 minutes", rating: 5 },
  { id: 4, time: "15:45", date: "July 24th", remarks: "Bus arrived early and I almost missed it.", route: "12", waiting: "5 minutes", routeTime: "9 minutes", rating: 3, important: true },
  { id: 5, time: "16:00", date: "July 25th", remarks: "The bus was overcrowded and uncomfortable.", route: "15", waiting: "20 minutes", routeTime: "18 minutes", rating: 1 },
  { id: 6, time: "17:10", date: "July 26th", remarks: "Driver was helpful with directions.", route: "13", waiting: "8 minutes", routeTime: "12 minutes", rating: 4 },
  { id: 7, time: "18:20", date: "July 27th", remarks: "The bus was late, but the ride was quick.", route: "14", waiting: "12 minutes", routeTime: "14 minutes", rating: 2 },
  { id: 8, time: "19:30", date: "July 28th", remarks: "Great experience overall, will use again.", route: "15", waiting: "10 minutes", routeTime: "11 minutes", rating: 5 },
  { id: 9, time: "08:05", date: "July 29th", remarks: "Bus was on time and the seats were comfortable.", route: "12", waiting: "3 minutes", routeTime: "8 minutes", rating: 5 },
  { id: 10, time: "09:40", date: "July 29th", remarks: "Missed my stop because the driver didn't announce it.", route: "13", waiting: "6 minutes", routeTime: "10 minutes", rating: 2, important: true },
  { id: 11, time: "10:15", date: "July 30th", remarks: "Loved the free WiFi on the bus!", route: "14", waiting: "9 minutes", routeTime: "12 minutes", rating: 4 },
  { id: 12, time: "11:50", date: "July 30th", remarks: "Bus was delayed due to traffic, but the driver kept us informed.", route: "15", waiting: "18 minutes", routeTime: "20 minutes", rating: 3 },
  { id: 13, time: "13:25", date: "July 31st", remarks: "The bus was very clean and smelled fresh.", route: "12", waiting: "4 minutes", routeTime: "9 minutes", rating: 5 },
  { id: 14, time: "14:55", date: "July 31st", remarks: "Driver was rude when I asked a question.", route: "13", waiting: "10 minutes", routeTime: "13 minutes", rating: 1, important: true },
  { id: 15, time: "16:10", date: "August 1st", remarks: "Quick and efficient ride, no complaints.", route: "14", waiting: "7 minutes", routeTime: "10 minutes", rating: 4 },
  { id: 16, time: "17:35", date: "August 1st", remarks: "Standing room only, but the ride was fast.", route: "15", waiting: "12 minutes", routeTime: "15 minutes", rating: 3 },
  { id: 17, time: "18:50", date: "August 2nd", remarks: "The bus was late and very crowded.", route: "12", waiting: "16 minutes", routeTime: "17 minutes", rating: 2 },
  { id: 18, time: "20:05", date: "August 2nd", remarks: "Excellent service, will recommend to friends.", route: "13", waiting: "5 minutes", routeTime: "8 minutes", rating: 5 },
  { id: 19, time: "21:20", date: "August 3rd", remarks: "The bus was too cold inside.", route: "14", waiting: "8 minutes", routeTime: "11 minutes", rating: 3 },
  { id: 20, time: "22:35", date: "August 3rd", remarks: "Driver waited for me when I was running late. Thank you!", route: "15", waiting: "2 minutes", routeTime: "7 minutes", rating: 5, important: true },
];

export const routeColors: Record<string, string> = {
  '10': 'bg-yellow-500',
  '11': 'bg-red-500',
  '12': 'bg-blue-500',
  '13': 'bg-green-500',
  '14': 'bg-orange-500',
  '15': 'bg-purple-500',
};

export interface InsightType {
  id: number;
  title: string;
  subtitle?: string;
  date: string; // e.g., '2024-07-21'
  time: string; // e.g., '14:30'
  insight?: any; // full insight contents
}

export const insightsData: InsightType[] = [
];

// Add a new insight to Firestore
export async function addInsight(insight: Omit<InsightType, 'id'>) {
  await addDoc(collection(db, 'town-milton/insights/insight-collection'), insight);
}

// Bus route stops and route coordinates for the Milton map

export const routes = [
  {
    id: "12",
    name: "Route 12",
    color: "#5f4bb6",
    stops: [
      { id: "A", label: "A: Milton GO Station", lat: 43.517215, lng: -79.882439 },
      { id: "B", label: "B: McCuaig Dr & Thompson Rd S", lat: 43.515900, lng: -79.871900 },
      { id: "C", label: "C: Croft Ave & Laurier Ave", lat: 43.513900, lng: -79.857900 },
      { id: "D", label: "D: Clark Blvd & Fourth Line", lat: 43.505900, lng: -79.857000 },
      { id: "E", label: "E: Clark Blvd & Trudeau Dr", lat: 43.505900, lng: -79.848000 },
      { id: "3", label: "3: Louis St Laurent Ave & Trudeau Dr", lat: 43.500900, lng: -79.847000 },
    ],
    routeCoordinates: [
      [-79.882439, 43.517215],
      [-79.880000, 43.516000],
      [-79.877000, 43.515000],
      [-79.874000, 43.515500],
      [-79.872000, 43.514000],
      [-79.870000, 43.514500],
      [-79.868000, 43.512000],
      [-79.864000, 43.512500],
      [-79.860000, 43.513000],
      [-79.857900, 43.513900],
      [-79.857000, 43.510000],
      [-79.855000, 43.508000],
      [-79.852000, 43.507000],
      [-79.850000, 43.505900],
      [-79.857000, 43.505900],
      [-79.850000, 43.504000],
      [-79.848000, 43.505900],
      [-79.847000, 43.500900],
    ],
  },
  {
    id: "13",
    name: "Route 13",
    color: "#ff8800",
    stops: [
      { id: "A", label: "A: Milton GO Station", lat: 43.517215, lng: -79.882439 },
      { id: "1", label: "1: Main St E & Ontario St S", lat: 43.514800, lng: -79.882900 },
      { id: "B", label: "B: Ontario St N & Steeles Ave E", lat: 43.529000, lng: -79.876800 },
      { id: "C", label: "C: RR25/401 Park & Ride", lat: 43.540800, lng: -79.872800 },
      { id: "D", label: "D: High Point Dr & Derry Rd", lat: 43.545800, lng: -79.870000 },
      { id: "E", label: "E: Market Dr & Bronte St S", lat: 43.523000, lng: -79.900000 },
    ],
    routeCoordinates: [
      [-79.882439, 43.517215],
      [-79.880000, 43.517200],
      [-79.882900, 43.514800],
      [-79.882900, 43.520000],
      [-79.882900, 43.525000],
      [-79.876800, 43.529000],
      [-79.872800, 43.540800],
      [-79.870000, 43.545800],
      [-79.870000, 43.540000],
      [-79.880000, 43.540000],
      [-79.900000, 43.523000],
      [-79.900000, 43.523000],
      [-79.882900, 43.517215],
    ],
  },
  {
    id: "14",
    name: "Route 14",
    color: "#2ca58d",
    stops: [
      { id: "A", label: "A: Milton GO Station", lat: 43.517215, lng: -79.882439 },
      { id: "B", label: "B: Childs Dr & Thompson Rd S", lat: 43.517000, lng: -79.871000 },
      { id: "C", label: "C: Laurier Ave & Ontario St S", lat: 43.511000, lng: -79.887000 },
      { id: "D", label: "D: Hepburn Rd & Bronte St S", lat: 43.500900, lng: -79.900000 },
      { id: "5a", label: "5: Childs Dr & Ontario St S", lat: 43.523000, lng: -79.887000 },
      { id: "5b", label: "5: Yates Dr & Holly Ave", lat: 43.507000, lng: -79.872000 },
    ],
    routeCoordinates: [
      // Milton GO Station (A)
      [-79.882439, 43.517215],
      // Childs Dr east (B)
      [-79.880000, 43.517215],
      [-79.871000, 43.517000],
      // Ontario St S south (C)
      [-79.887000, 43.511000],
      // Laurier Ave west
      [-79.887000, 43.523000], // 5a
      // Yates Dr south
      [-79.872000, 43.507000], // 5b
      // Holly Ave south
      [-79.872000, 43.500900],
      // Hepburn Rd west (D)
      [-79.900000, 43.500900],
      // Bronte St N north
      [-79.900000, 43.517215],
      // Back to Milton GO Station
      [-79.882439, 43.517215],
    ],
  },
  {
    id: "15",
    name: "Route 15",
    color: "#d36eb6",
    stops: [
      { id: "A", label: "A: Milton GO Station", lat: 43.517215, lng: -79.882439 },
      { id: "4a", label: "4: Thompson Rd S & Childs Dr", lat: 43.511800, lng: -79.882000 },
      { id: "B", label: "B: Clark Blvd & Thompson Rd S", lat: 43.505900, lng: -79.882000 },
      { id: "4b", label: "4: Kennedy Cir & Louis St Laurent Ave", lat: 43.500900, lng: -79.888000 },
      { id: "C", label: "C: Bennett Blvd & Ferguson Dr", lat: 43.510800, lng: -79.868000 },
      { id: "D", label: "D: Fourth Line & Louis St Laurent Ave", lat: 43.500900, lng: -79.857000 },
    ],
    routeCoordinates: [
      // Milton GO Station (A)
      [-79.882439, 43.517215],
      // Thompson Rd S south
      [-79.882000, 43.515000],
      [-79.882000, 43.511800], // 4a
      [-79.882000, 43.505900], // B
      // Kennedy Cir west
      [-79.888000, 43.505900],
      [-79.888000, 43.500900], // 4b
      // Louis St Laurent Ave east
      [-79.870000, 43.500900],
      [-79.857000, 43.500900], // D
      // Clark Blvd north
      [-79.857000, 43.507000],
      [-79.868000, 43.510800], // C
      // Ferguson Dr south
      [-79.868000, 43.505900],
      // Clark Blvd west
      [-79.882000, 43.505900],
      // Back to Milton GO Station
      [-79.882439, 43.517215],
    ],
  },
];

// For backwards compatibility (route 12 as default)
export const stops = routes[0].stops;
export const routeCoordinates = routes[0].routeCoordinates;

// Example user positions for heatmap (randomized for demo)
export interface UserPosition {
  id: string;
  lat: number;
  lng: number;
  busStopId: string; // id of the stop the user is heading to
}

// For mapping, use stops from routes[0] and routes[1] for variety
const allStops = [
  ...routes[0].stops,
  ...routes[1].stops,
  ...routes[2].stops,
  ...routes[3].stops,
];

export const userPositions: UserPosition[] = [
  { id: 'u1', lat: 43.5200, lng: -79.8800, busStopId: 'A' },
  { id: 'u2', lat: 43.5100, lng: -79.8700, busStopId: 'B' },
  { id: 'u3', lat: 43.5150, lng: -79.8600, busStopId: 'C' },
  { id: 'u4', lat: 43.5050, lng: -79.8650, busStopId: 'D' },
  { id: 'u5', lat: 43.5180, lng: -79.8750, busStopId: 'E' },
  { id: 'u6', lat: 43.5080, lng: -79.8780, busStopId: '1' },
  { id: 'u7', lat: 43.5130, lng: -79.8820, busStopId: 'B' },
  { id: 'u8', lat: 43.5110, lng: -79.8720, busStopId: 'C' },
  { id: 'u9', lat: 43.5160, lng: -79.8680, busStopId: 'D' },
  { id: 'u10', lat: 43.5140, lng: -79.8600, busStopId: 'E' },
  { id: 'u11', lat: 43.5070, lng: -79.8770, busStopId: 'A' },
  { id: 'u12', lat: 43.5190, lng: -79.8620, busStopId: 'B' },
  { id: 'u13', lat: 43.5120, lng: -79.8800, busStopId: 'C' },
  { id: 'u14', lat: 43.5090, lng: -79.8650, busStopId: 'D' },
  { id: 'u15', lat: 43.5170, lng: -79.8700, busStopId: 'E' },
  { id: 'u16', lat: 43.5060, lng: -79.8720, busStopId: '1' },
  { id: 'u17', lat: 43.5200, lng: -79.8600, busStopId: 'B' },
  { id: 'u18', lat: 43.5130, lng: -79.8750, busStopId: 'C' },
  { id: 'u19', lat: 43.5150, lng: -79.8780, busStopId: 'D' },
  { id: 'u20', lat: 43.5080, lng: -79.8680, busStopId: 'E' },
  { id: 'u21', lat: 43.5140, lng: -79.8800, busStopId: 'A' },
  { id: 'u22', lat: 43.5090, lng: -79.8620, busStopId: 'B' },
  { id: 'u23', lat: 43.5160, lng: -79.8650, busStopId: 'C' },
  { id: 'u24', lat: 43.5070, lng: -79.8700, busStopId: 'D' },
  { id: 'u25', lat: 43.5190, lng: -79.8780, busStopId: 'E' },
  { id: 'u26', lat: 43.5100, lng: -79.8600, busStopId: '1' },
  { id: 'u27', lat: 43.5150, lng: -79.8720, busStopId: 'B' },
  { id: 'u28', lat: 43.5060, lng: -79.8650, busStopId: 'C' },
  { id: 'u29', lat: 43.5180, lng: -79.8700, busStopId: 'D' },
  { id: 'u30', lat: 43.5110, lng: -79.8780, busStopId: 'E' },
  { id: 'u31', lat: 43.5140, lng: -79.8620, busStopId: 'A' },
  { id: 'u32', lat: 43.5090, lng: -79.8800, busStopId: 'B' },
  { id: 'u33', lat: 43.5170, lng: -79.8650, busStopId: 'C' },
  { id: 'u34', lat: 43.5080, lng: -79.8720, busStopId: 'D' },
  { id: 'u35', lat: 43.5130, lng: -79.8600, busStopId: 'E' },
  { id: 'u36', lat: 43.5200, lng: -79.8680, busStopId: '1' },
  { id: 'u37', lat: 43.5120, lng: -79.8650, busStopId: 'B' },
  { id: 'u38', lat: 43.5090, lng: -79.8700, busStopId: 'C' },
  { id: 'u39', lat: 43.5160, lng: -79.8780, busStopId: 'D' },
  { id: 'u40', lat: 43.5070, lng: -79.8620, busStopId: 'E' },
  { id: 'u41', lat: 43.5190, lng: -79.8650, busStopId: 'A' },
  { id: 'u42', lat: 43.5100, lng: -79.8720, busStopId: 'B' },
  { id: 'u43', lat: 43.5150, lng: -79.8680, busStopId: 'C' },
  { id: 'u44', lat: 43.5060, lng: -79.8780, busStopId: 'D' },
  { id: 'u45', lat: 43.5180, lng: -79.8620, busStopId: 'E' },
  { id: 'u46', lat: 43.5110, lng: -79.8650, busStopId: '1' },
  { id: 'u47', lat: 43.5140, lng: -79.8700, busStopId: 'B' },
  { id: 'u48', lat: 43.5090, lng: -79.8780, busStopId: 'C' },
  { id: 'u49', lat: 43.5170, lng: -79.8620, busStopId: 'D' },
  { id: 'u50', lat: 43.5080, lng: -79.8650, busStopId: 'E' },
];

// People waiting at bus stops
export interface WaitingUser {
  id: string;
  lat: number;
  lng: number;
  busStopId: string;
}

// Use all stops from all routes, with varied user counts
const allStopsForWaiting = [
  ...routes[0].stops,
  ...routes[1].stops,
  ...routes[2].stops,
  ...routes[3].stops,
];

// Assign a different number of users to each stop
export const waitingUsers: WaitingUser[] = [
  // Route 12 stops
  ...Array.from({ length: 3 }, (_, i) => ({ id: `w1A${i + 1}`, lat: 43.517215, lng: -79.882439, busStopId: 'A' })),
  ...Array.from({ length: 7 }, (_, i) => ({ id: `w1B${i + 1}`, lat: 43.515900, lng: -79.871900, busStopId: 'B' })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `w1C${i + 1}`, lat: 43.513900, lng: -79.857900, busStopId: 'C' })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `w1D${i + 1}`, lat: 43.505900, lng: -79.857000, busStopId: 'D' })),
  ...Array.from({ length: 1 }, (_, i) => ({ id: `w1E${i + 1}`, lat: 43.505900, lng: -79.848000, busStopId: 'E' })),
  ...Array.from({ length: 4 }, (_, i) => ({ id: `w13${i + 1}`, lat: 43.500900, lng: -79.847000, busStopId: '3' })),
  // Route 13 stops
  ...Array.from({ length: 5 }, (_, i) => ({ id: `w2A${i + 1}`, lat: 43.517215, lng: -79.882439, busStopId: 'A' })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `w21${i + 1}`, lat: 43.514800, lng: -79.882900, busStopId: '1' })),
  ...Array.from({ length: 8 }, (_, i) => ({ id: `w2B${i + 1}`, lat: 43.529000, lng: -79.876800, busStopId: 'B' })),
  ...Array.from({ length: 1 }, (_, i) => ({ id: `w2C${i + 1}`, lat: 43.540800, lng: -79.872800, busStopId: 'C' })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: `w2D${i + 1}`, lat: 43.545800, lng: -79.870000, busStopId: 'D' })),
  ...Array.from({ length: 3 }, (_, i) => ({ id: `w2E${i + 1}`, lat: 43.523000, lng: -79.900000, busStopId: 'E' })),
  // Route 14 stops
  ...Array.from({ length: 2 }, (_, i) => ({ id: `w3A${i + 1}`, lat: 43.517215, lng: -79.882439, busStopId: 'A' })),
  ...Array.from({ length: 9 }, (_, i) => ({ id: `w3B${i + 1}`, lat: 43.517000, lng: -79.871000, busStopId: 'B' })),
  ...Array.from({ length: 1 }, (_, i) => ({ id: `w3C${i + 1}`, lat: 43.511000, lng: -79.887000, busStopId: 'C' })),
  ...Array.from({ length: 4 }, (_, i) => ({ id: `w3D${i + 1}`, lat: 43.500900, lng: -79.900000, busStopId: 'D' })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `w35a${i + 1}`, lat: 43.523000, lng: -79.887000, busStopId: '5a' })),
  ...Array.from({ length: 7 }, (_, i) => ({ id: `w35b${i + 1}`, lat: 43.507000, lng: -79.872000, busStopId: '5b' })),
  // Route 15 stops
  ...Array.from({ length: 3 }, (_, i) => ({ id: `w4A${i + 1}`, lat: 43.517215, lng: -79.882439, busStopId: 'A' })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `w44a${i + 1}`, lat: 43.511800, lng: -79.882000, busStopId: '4a' })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `w4B${i + 1}`, lat: 43.505900, lng: -79.882000, busStopId: 'B' })),
  ...Array.from({ length: 1 }, (_, i) => ({ id: `w44b${i + 1}`, lat: 43.500900, lng: -79.888000, busStopId: '4b' })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: `w4C${i + 1}`, lat: 43.510800, lng: -79.868000, busStopId: 'C' })),
  ...Array.from({ length: 2 }, (_, i) => ({ id: `w4D${i + 1}`, lat: 43.500900, lng: -79.857000, busStopId: 'D' })),
];

// Bus data for map
export interface Bus {
  id: string;
  lat: number;
  lng: number;
  routeId: string;
  nextStopId: string;
  totalPassengers: number;
}

// --- FIRESTORE FETCH HELPERS ---

export async function getFeedbackData(): Promise<FeedbackType[]> {
  const snapshot = await getDocs(collection(db, 'town-milton/feedback/feedback-collection'));
  return snapshot.docs.map(doc => doc.data() as FeedbackType);
}

export async function getInsightsData(): Promise<InsightType[]> {
  const snapshot = await getDocs(collection(db, 'town-milton/insights/insights-collection'));
  return snapshot.docs.map(doc => doc.data() as InsightType);
}

// Add Route and Schedule types for fetching
export interface Stop {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  name: string;
  color: string;
  stops: Stop[];
  routeCoordinates: number[][];
}

export interface ScheduleDay {
  day: string;
  stops: string[];
  times: string[][];
}

export interface Schedule {
  id: string;
  routeId: string;
  days: ScheduleDay[];
}

export async function getRoutes(): Promise<Route[]> {
  const snapshot = await getDocs(collection(db, 'town-milton/routes/route-collection'));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    if ('json' in data) return JSON.parse(data.json) as Route;
    return data as Route;
  });
}

export async function getUserPositions(): Promise<UserPosition[]> {
  const snapshot = await getDocs(collection(db, 'town-milton/user-positions/user-positions-collection'));
  return snapshot.docs.map(doc => doc.data() as UserPosition);
}

export async function getWaitingUsers(): Promise<WaitingUser[]> {
  const snapshot = await getDocs(collection(db, 'town-milton/waiting-users/waiting-users-collection'));
  return snapshot.docs.map(doc => doc.data() as WaitingUser);
}

export async function getBuses(): Promise<Bus[]> {
  const snapshot = await getDocs(collection(db, 'town-milton/buses/bus-collection'));
  return snapshot.docs.map(doc => doc.data() as Bus);
}

export async function getSchedules(): Promise<Schedule[]> {
  const snapshot = await getDocs(collection(db, 'town-milton/schedules/schedule-collection'));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    if ('json' in data) return JSON.parse(data.json) as Schedule;
    return data as Schedule;
  });
}

export async function getRouteColors(): Promise<Record<string, string>> {
  const docSnap = await getDoc(doc(db, 'town-milton/route-colors'));
  return docSnap.data() as Record<string, string>;
}

export interface Trip {
  id: string;
  uID: string;
  routeId: string;
  startTime: string;
  startLat: number;
  startLng: number;
  waitStart: string;
  waitEnd: string;
  endTime: string;
  startStopId: string;
  startStopLat: number;
  startStopLng: number;
  endStopId: string;
  endStopLat: number;
  endStopLng: number;
  duration: number;
}

// Demo trips for testing
export const demoTrips: Trip[] = [
  { id: 'trip1', uID: 'user1', routeId: '12', startTime: '2024-07-21T08:05:00', startLat: 43.517215, startLng: -79.882439, waitStart: '2024-07-21T07:55:00', waitEnd: '2024-07-21T08:00:00', endTime: '2024-07-21T08:25:00', startStopId: '12:A: Milton GO Station', startStopLat: 43.517215, startStopLng: -79.882439, endStopId: '12:E: Clark Blvd & Trudeau Dr', endStopLat: 43.505900, endStopLng: -79.848000, duration: 20 },
  { id: 'trip2', uID: 'user2', routeId: '13', startTime: '2024-07-21T09:10:00', startLat: 43.517215, startLng: -79.882439, waitStart: '2024-07-21T09:00:00', waitEnd: '2024-07-21T09:05:00', endTime: '2024-07-21T09:35:00', startStopId: '13:A: Milton GO Station', startStopLat: 43.517215, startStopLng: -79.882439, endStopId: '13:E: Market Dr & Bronte St S', endStopLat: 43.523000, endStopLng: -79.900000, duration: 25 },
  { id: 'trip3', uID: 'user3', routeId: '14', startTime: '2024-07-21T10:20:00', startLat: 43.517215, startLng: -79.882439, waitStart: '2024-07-21T10:10:00', waitEnd: '2024-07-21T10:15:00', endTime: '2024-07-21T10:40:00', startStopId: '14:A: Milton GO Station', startStopLat: 43.517215, startStopLng: -79.882439, endStopId: '14:D: Hepburn Rd & Bronte St S', endStopLat: 43.500900, endStopLng: -79.900000, duration: 20 },
  { id: 'trip4', uID: 'user4', routeId: '15', startTime: '2024-07-21T11:00:00', startLat: 43.517215, startLng: -79.882439, waitStart: '2024-07-21T10:50:00', waitEnd: '2024-07-21T10:55:00', endTime: '2024-07-21T11:22:00', startStopId: '15:A: Milton GO Station', startStopLat: 43.517215, startStopLng: -79.882439, endStopId: '15:D: Fourth Line & Louis St Laurent Ave', endStopLat: 43.500900, endStopLng: -79.857000, duration: 22 },
  { id: 'trip5', uID: 'user5', routeId: '12', startTime: '2024-07-21T12:15:00', startLat: 43.515900, startLng: -79.871900, waitStart: '2024-07-21T12:05:00', waitEnd: '2024-07-21T12:10:00', endTime: '2024-07-21T12:35:00', startStopId: '12:B: McCuaig Dr & Thompson Rd S', startStopLat: 43.515900, startStopLng: -79.871900, endStopId: '12:C: Croft Ave & Laurier Ave', endStopLat: 43.513900, endStopLng: -79.857900, duration: 20 },
  { id: 'trip6', uID: 'user6', routeId: '13', startTime: '2024-07-21T13:30:00', startLat: 43.529000, startLng: -79.876800, waitStart: '2024-07-21T13:20:00', waitEnd: '2024-07-21T13:25:00', endTime: '2024-07-21T13:55:00', startStopId: '13:B: Ontario St N & Steeles Ave E', startStopLat: 43.529000, startStopLng: -79.876800, endStopId: '13:C: RR25/401 Park & Ride', endStopLat: 43.540800, endStopLng: -79.872800, duration: 25 },
  { id: 'trip7', uID: 'user7', routeId: '14', startTime: '2024-07-21T14:45:00', startLat: 43.517000, startLng: -79.871000, waitStart: '2024-07-21T14:35:00', waitEnd: '2024-07-21T14:40:00', endTime: '2024-07-21T15:05:00', startStopId: '14:B: Childs Dr & Thompson Rd S', startStopLat: 43.517000, startStopLng: -79.871000, endStopId: '14:C: Laurier Ave & Ontario St S', endStopLat: 43.511000, endStopLng: -79.887000, duration: 20 },
  { id: 'trip8', uID: 'user8', routeId: '15', startTime: '2024-07-21T15:10:00', startLat: 43.510800, startLng: -79.868000, waitStart: '2024-07-21T15:00:00', waitEnd: '2024-07-21T15:05:00', endTime: '2024-07-21T15:30:00', startStopId: '15:C: Bennett Blvd & Ferguson Dr', startStopLat: 43.510800, startStopLng: -79.868000, endStopId: '15:B: Clark Blvd & Thompson Rd S', endStopLat: 43.505900, endStopLng: -79.882000, duration: 20 },
  { id: 'trip9', uID: 'user9', routeId: '12', startTime: '2024-07-21T16:20:00', startLat: 43.505900, startLng: -79.857000, waitStart: '2024-07-21T16:10:00', waitEnd: '2024-07-21T16:15:00', endTime: '2024-07-21T16:40:00', startStopId: '12:D: Clark Blvd & Fourth Line', startStopLat: 43.505900, startStopLng: -79.857000, endStopId: '12:E: Clark Blvd & Trudeau Dr', endStopLat: 43.505900, endStopLng: -79.848000, duration: 20 },
  { id: 'trip10', uID: 'user10', routeId: '13', startTime: '2024-07-21T17:35:00', startLat: 43.540800, startLng: -79.872800, waitStart: '2024-07-21T17:25:00', waitEnd: '2024-07-21T17:30:00', endTime: '2024-07-21T17:55:00', startStopId: '13:C: RR25/401 Park & Ride', startStopLat: 43.540800, startStopLng: -79.872800, endStopId: '13:D: High Point Dr & Derry Rd', endStopLat: 43.545800, endStopLng: -79.870000, duration: 20 },
  { id: 'trip11', uID: 'user11', routeId: '14', startTime: '2024-07-21T18:50:00', startLat: 43.511000, startLng: -79.887000, waitStart: '2024-07-21T18:40:00', waitEnd: '2024-07-21T18:45:00', endTime: '2024-07-21T19:10:00', startStopId: '14:C: Laurier Ave & Ontario St S', startStopLat: 43.511000, startStopLng: -79.887000, endStopId: '14:5a: Childs Dr & Ontario St S', endStopLat: 43.523000, endStopLng: -79.887000, duration: 20 },
  { id: 'trip12', uID: 'user12', routeId: '15', startTime: '2024-07-21T19:05:00', startLat: 43.500900, startLng: -79.888000, waitStart: '2024-07-21T18:55:00', waitEnd: '2024-07-21T19:00:00', endTime: '2024-07-21T19:25:00', startStopId: '15:4b: Kennedy Cir & Louis St Laurent Ave', startStopLat: 43.500900, startStopLng: -79.888000, endStopId: '15:D: Fourth Line & Louis St Laurent Ave', endStopLat: 43.500900, endStopLng: -79.857000, duration: 20 },
  { id: 'trip13', uID: 'user13', routeId: '12', startTime: '2024-07-21T20:15:00', startLat: 43.505900, startLng: -79.848000, waitStart: '2024-07-21T20:05:00', waitEnd: '2024-07-21T20:10:00', endTime: '2024-07-21T20:35:00', startStopId: '12:E: Clark Blvd & Trudeau Dr', startStopLat: 43.505900, startStopLng: -79.848000, endStopId: '12:3: Louis St Laurent Ave & Trudeau Dr', endStopLat: 43.500900, endStopLng: -79.847000, duration: 20 },
  { id: 'trip14', uID: 'user14', routeId: '13', startTime: '2024-07-21T21:30:00', startLat: 43.523000, startLng: -79.900000, waitStart: '2024-07-21T21:20:00', waitEnd: '2024-07-21T21:25:00', endTime: '2024-07-21T21:50:00', startStopId: '13:E: Market Dr & Bronte St S', startStopLat: 43.523000, startStopLng: -79.900000, endStopId: '13:A: Milton GO Station', endStopLat: 43.517215, endStopLng: -79.882439, duration: 20 },
  { id: 'trip15', uID: 'user15', routeId: '14', startTime: '2024-07-21T22:45:00', startLat: 43.523000, startLng: -79.887000, waitStart: '2024-07-21T22:35:00', waitEnd: '2024-07-21T22:40:00', endTime: '2024-07-21T23:05:00', startStopId: '14:5a: Childs Dr & Ontario St S', startStopLat: 43.523000, startStopLng: -79.887000, endStopId: '14:5b: Yates Dr & Holly Ave', endStopLat: 43.507000, endStopLng: -79.872000, duration: 20 },
  { id: 'trip16', uID: 'user16', routeId: '15', startTime: '2024-07-21T23:10:00', startLat: 43.505900, startLng: -79.882000, waitStart: '2024-07-21T23:00:00', waitEnd: '2024-07-21T23:05:00', endTime: '2024-07-21T23:30:00', startStopId: '15:B: Clark Blvd & Thompson Rd S', startStopLat: 43.505900, startStopLng: -79.882000, endStopId: '15:4a: Thompson Rd S & Childs Dr', endStopLat: 43.511800, endStopLng: -79.882000, duration: 20 },
  { id: 'trip17', uID: 'user17', routeId: '12', startTime: '2024-07-22T08:05:00', startLat: 43.517215, startLng: -79.882439, waitStart: '2024-07-22T07:55:00', waitEnd: '2024-07-22T08:00:00', endTime: '2024-07-22T08:25:00', startStopId: '12:A: Milton GO Station', startStopLat: 43.517215, startStopLng: -79.882439, endStopId: '12:B: McCuaig Dr & Thompson Rd S', endStopLat: 43.515900, endStopLng: -79.871900, duration: 20 },
  { id: 'trip18', uID: 'user18', routeId: '13', startTime: '2024-07-22T09:10:00', startLat: 43.514800, startLng: -79.882900, waitStart: '2024-07-22T09:00:00', waitEnd: '2024-07-22T09:05:00', endTime: '2024-07-22T09:35:00', startStopId: '13:1: Main St E & Ontario St S', startStopLat: 43.514800, startStopLng: -79.882900, endStopId: '13:B: Ontario St N & Steeles Ave E', endStopLat: 43.529000, endStopLng: -79.876800, duration: 25 },
  { id: 'trip19', uID: 'user19', routeId: '14', startTime: '2024-07-22T10:20:00', startLat: 43.517215, startLng: -79.882439, waitStart: '2024-07-22T10:10:00', waitEnd: '2024-07-22T10:15:00', endTime: '2024-07-22T10:40:00', startStopId: '14:A: Milton GO Station', startStopLat: 43.517215, startStopLng: -79.882439, endStopId: '14:B: Childs Dr & Thompson Rd S', endStopLat: 43.517000, endStopLng: -79.871000, duration: 20 },
  { id: 'trip20', uID: 'user20', routeId: '15', startTime: '2024-07-22T11:00:00', startLat: 43.511800, startLng: -79.882000, waitStart: '2024-07-22T10:50:00', waitEnd: '2024-07-22T10:55:00', endTime: '2024-07-22T11:22:00', startStopId: '15:4a: Thompson Rd S & Childs Dr', startStopLat: 43.511800, startStopLng: -79.882000, endStopId: '15:C: Bennett Blvd & Ferguson Dr', endStopLat: 43.510800, endStopLng: -79.868000, duration: 22 },
  { id: 'trip21', uID: 'user21', routeId: '12', startTime: '2024-07-22T12:15:00', startLat: 43.513900, startLng: -79.857900, waitStart: '2024-07-22T12:05:00', waitEnd: '2024-07-22T12:10:00', endTime: '2024-07-22T12:35:00', startStopId: '12:C: Croft Ave & Laurier Ave', startStopLat: 43.513900, startStopLng: -79.857900, endStopId: '12:D: Clark Blvd & Fourth Line', endStopLat: 43.505900, endStopLng: -79.857000, duration: 20 },
  { id: 'trip22', uID: 'user22', routeId: '13', startTime: '2024-07-22T13:30:00', startLat: 43.545800, startLng: -79.870000, waitStart: '2024-07-22T13:20:00', waitEnd: '2024-07-22T13:25:00', endTime: '2024-07-22T13:55:00', startStopId: '13:D: High Point Dr & Derry Rd', startStopLat: 43.545800, startStopLng: -79.870000, endStopId: '13:E: Market Dr & Bronte St S', endStopLat: 43.523000, endStopLng: -79.900000, duration: 25 },
  { id: 'trip23', uID: 'user23', routeId: '14', startTime: '2024-07-22T14:45:00', startLat: 43.507000, startLng: -79.872000, waitStart: '2024-07-22T14:35:00', waitEnd: '2024-07-22T14:40:00', endTime: '2024-07-22T15:05:00', startStopId: '14:5b: Yates Dr & Holly Ave', startStopLat: 43.507000, startStopLng: -79.872000, endStopId: '14:A: Milton GO Station', endStopLat: 43.517215, endStopLng: -79.882439, duration: 20 },
  { id: 'trip24', uID: 'user24', routeId: '15', startTime: '2024-07-22T15:10:00', startLat: 43.500900, startLng: -79.857000, waitStart: '2024-07-22T15:00:00', waitEnd: '2024-07-22T15:05:00', endTime: '2024-07-22T15:30:00', startStopId: '15:D: Fourth Line & Louis St Laurent Ave', startStopLat: 43.500900, startStopLng: -79.857000, endStopId: '15:4b: Kennedy Cir & Louis St Laurent Ave', endStopLat: 43.500900, endStopLng: -79.888000, duration: 20 },
  { id: 'trip25', uID: 'user25', routeId: '12', startTime: '2024-07-22T16:20:00', startLat: 43.500900, startLng: -79.847000, waitStart: '2024-07-22T16:10:00', waitEnd: '2024-07-22T16:15:00', endTime: '2024-07-22T16:40:00', startStopId: '12:3: Louis St Laurent Ave & Trudeau Dr', startStopLat: 43.500900, startStopLng: -79.847000, endStopId: '12:A: Milton GO Station', endStopLat: 43.517215, endStopLng: -79.882439, duration: 20 },
  { id: 'trip26', uID: 'user26', routeId: '13', startTime: '2024-07-22T17:35:00', startLat: 43.517215, startLng: -79.882439, waitStart: '2024-07-22T17:25:00', waitEnd: '2024-07-22T17:30:00', endTime: '2024-07-22T17:55:00', startStopId: '13:A: Milton GO Station', startStopLat: 43.517215, startStopLng: -79.882439, endStopId: '13:1: Main St E & Ontario St S', endStopLat: 43.514800, endStopLng: -79.882900, duration: 20 },
  { id: 'trip27', uID: 'user27', routeId: '14', startTime: '2024-07-22T18:50:00', startLat: 43.500900, startLng: -79.900000, waitStart: '2024-07-22T18:40:00', waitEnd: '2024-07-22T18:45:00', endTime: '2024-07-22T19:10:00', startStopId: '14:D: Hepburn Rd & Bronte St S', startStopLat: 43.500900, startStopLng: -79.900000, endStopId: '14:5a: Childs Dr & Ontario St S', endStopLat: 43.523000, endStopLng: -79.887000, duration: 20 },
  { id: 'trip28', uID: 'user28', routeId: '15', startTime: '2024-07-22T19:05:00', startLat: 43.505900, startLng: -79.882000, waitStart: '2024-07-22T18:55:00', waitEnd: '2024-07-22T19:00:00', endTime: '2024-07-22T19:25:00', startStopId: '15:B: Clark Blvd & Thompson Rd S', startStopLat: 43.505900, startStopLng: -79.882000, endStopId: '15:4a: Thompson Rd S & Childs Dr', endStopLat: 43.511800, endStopLng: -79.882000, duration: 20 },
  { id: 'trip29', uID: 'user29', routeId: '12', startTime: '2024-07-22T20:15:00', startLat: 43.517215, startLng: -79.882439, waitStart: '2024-07-22T20:05:00', waitEnd: '2024-07-22T20:10:00', endTime: '2024-07-22T20:35:00', startStopId: '12:A: Milton GO Station', startStopLat: 43.517215, startStopLng: -79.882439, endStopId: '12:D: Clark Blvd & Fourth Line', endStopLat: 43.505900, endStopLng: -79.857000, duration: 20 },
  { id: 'trip30', uID: 'user30', routeId: '13', startTime: '2024-07-22T21:30:00', startLat: 43.529000, startLng: -79.876800, waitStart: '2024-07-22T21:20:00', waitEnd: '2024-07-22T21:25:00', endTime: '2024-07-22T21:50:00', startStopId: '13:B: Ontario St N & Steeles Ave E', startStopLat: 43.529000, startStopLng: -79.876800, endStopId: '13:C: RR25/401 Park & Ride', endStopLat: 43.540800, endStopLng: -79.872800, duration: 20 },
  { id: 'trip31', uID: 'user31', routeId: '14', startTime: '2024-07-22T22:45:00', startLat: 43.517000, startLng: -79.871000, waitStart: '2024-07-22T22:35:00', waitEnd: '2024-07-22T22:40:00', endTime: '2024-07-22T23:05:00', startStopId: '14:B: Childs Dr & Thompson Rd S', startStopLat: 43.517000, startStopLng: -79.871000, endStopId: '14:C: Laurier Ave & Ontario St S', endStopLat: 43.511000, endStopLng: -79.887000, duration: 20 },
  { id: 'trip32', uID: 'user32', routeId: '15', startTime: '2024-07-22T23:10:00', startLat: 43.510800, startLng: -79.868000, waitStart: '2024-07-22T23:00:00', waitEnd: '2024-07-22T23:05:00', endTime: '2024-07-22T23:30:00', startStopId: '15:C: Bennett Blvd & Ferguson Dr', startStopLat: 43.510800, startStopLng: -79.868000, endStopId: '15:D: Fourth Line & Louis St Laurent Ave', endStopLat: 43.500900, endStopLng: -79.857000, duration: 20 },
  { id: 'trip33', uID: 'user33', routeId: '12', startTime: '2024-07-23T08:05:00', startLat: 43.515900, startLng: -79.871900, waitStart: '2024-07-23T07:55:00', waitEnd: '2024-07-23T08:00:00', endTime: '2024-07-23T08:25:00', startStopId: '12:B: McCuaig Dr & Thompson Rd S', startStopLat: 43.515900, startStopLng: -79.871900, endStopId: '12:C: Croft Ave & Laurier Ave', endStopLat: 43.513900, endStopLng: -79.857900, duration: 20 },
  { id: 'trip34', uID: 'user34', routeId: '13', startTime: '2024-07-23T09:10:00', startLat: 43.514800, startLng: -79.882900, waitStart: '2024-07-23T09:00:00', waitEnd: '2024-07-23T09:05:00', endTime: '2024-07-23T09:35:00', startStopId: '13:1: Main St E & Ontario St S', startStopLat: 43.514800, startStopLng: -79.882900, endStopId: '13:E: Market Dr & Bronte St S', endStopLat: 43.523000, endStopLng: -79.900000, duration: 25 },
  { id: 'trip35', uID: 'user35', routeId: '14', startTime: '2024-07-23T10:20:00', startLat: 43.511000, startLng: -79.887000, waitStart: '2024-07-23T10:10:00', waitEnd: '2024-07-23T10:15:00', endTime: '2024-07-23T10:40:00', startStopId: '14:C: Laurier Ave & Ontario St S', startStopLat: 43.511000, startStopLng: -79.887000, endStopId: '14:5b: Yates Dr & Holly Ave', endStopLat: 43.507000, endStopLng: -79.872000, duration: 20 },
  { id: 'trip36', uID: 'user36', routeId: '15', startTime: '2024-07-23T11:00:00', startLat: 43.511800, startLng: -79.882000, waitStart: '2024-07-23T10:50:00', waitEnd: '2024-07-23T10:55:00', endTime: '2024-07-23T11:22:00', startStopId: '15:4a: Thompson Rd S & Childs Dr', startStopLat: 43.511800, startStopLng: -79.882000, endStopId: '15:4b: Kennedy Cir & Louis St Laurent Ave', endStopLat: 43.500900, endStopLng: -79.888000, duration: 22 },
  { id: 'trip37', uID: 'user37', routeId: '12', startTime: '2024-07-23T12:15:00', startLat: 43.513900, startLng: -79.857900, waitStart: '2024-07-23T12:05:00', waitEnd: '2024-07-23T12:10:00', endTime: '2024-07-23T12:35:00', startStopId: '12:C: Croft Ave & Laurier Ave', startStopLat: 43.513900, startStopLng: -79.857900, endStopId: '12:3: Louis St Laurent Ave & Trudeau Dr', endStopLat: 43.500900, endStopLng: -79.847000, duration: 20 },
  { id: 'trip38', uID: 'user38', routeId: '13', startTime: '2024-07-23T13:30:00', startLat: 43.545800, startLng: -79.870000, waitStart: '2024-07-23T13:20:00', waitEnd: '2024-07-23T13:25:00', endTime: '2024-07-23T13:55:00', startStopId: '13:D: High Point Dr & Derry Rd', startStopLat: 43.545800, startStopLng: -79.870000, endStopId: '13:B: Ontario St N & Steeles Ave E', endStopLat: 43.529000, endStopLng: -79.876800, duration: 25 },
  { id: 'trip39', uID: 'user39', routeId: '14', startTime: '2024-07-23T14:45:00', startLat: 43.507000, startLng: -79.872000, waitStart: '2024-07-23T14:35:00', waitEnd: '2024-07-23T14:40:00', endTime: '2024-07-23T15:05:00', startStopId: '14:5b: Yates Dr & Holly Ave', startStopLat: 43.507000, startStopLng: -79.872000, endStopId: '14:D: Hepburn Rd & Bronte St S', endStopLat: 43.500900, endStopLng: -79.900000, duration: 20 },
  { id: 'trip40', uID: 'user40', routeId: '15', startTime: '2024-07-23T15:10:00', startLat: 43.500900, startLng: -79.857000, waitStart: '2024-07-23T15:00:00', waitEnd: '2024-07-23T15:05:00', endTime: '2024-07-23T15:30:00', startStopId: '15:D: Fourth Line & Louis St Laurent Ave', startStopLat: 43.500900, startStopLng: -79.857000, endStopId: '15:A: Milton GO Station', endStopLat: 43.517215, endStopLng: -79.882439, duration: 20 },
];