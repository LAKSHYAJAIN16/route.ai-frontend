"use client";
import React, { useState } from "react";
import Sidebar from '../../../components/Sidebar';
import { HiOutlinePlus, HiOutlineDotsHorizontal } from 'react-icons/hi';
import { getRouteColors, InsightType } from '../data';
import { useRouter } from 'next/navigation';
import { db } from '../fire';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Head from "next/head";

function getRouteNumber(title: string | undefined | null): string | null {
  if (!title) return null;
  const match = title.match(/(?:Route|Bus) (\d{1,2})/i);
  return match ? match[1] : null;
}

function getFeedbackReviewDate(title: string): string | null {
  const match = title.match(/Feedback review (\d{1,2}\.\d{1,2})/i);
  return match ? match[1] : null;
}

function getHexColor(tw: string): string {
  switch (tw) {
    case 'bg-blue-500': return '#3b82f6';
    case 'bg-green-500': return '#22c55e';
    case 'bg-orange-500': return '#f59e42';
    case 'bg-purple-500': return '#a855f7';
    case 'bg-yellow-500': return '#f59e42'; // Tailwind yellow-500 is #f59e42
    case 'bg-red-500': return '#ef4444';
    default: return '#e0e7ff';
  }
}

function InsightCover({ title, routeColors }: { title: string, routeColors: Record<string, string> }) {
  const routeNumber = getRouteNumber(title);
  // If it's a route number, show the route SVG
  if (routeNumber) {
    const bg = getHexColor(routeColors[routeNumber] || '');
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" className="rounded-xl" style={{ background: bg }}>
        <rect width="56" height="56" rx="12" fill={bg} />
        <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="2rem" fill="#fff" fontWeight="bold">{routeNumber}</text>
      </svg>
    );
  }
  // If not a route number, treat as feedback review (show first word/number as feedbackDate)
  const feedbackDate = title?.split(' ').slice(0, 2).join(' ');
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" className="rounded-xl" style={{ background: '#22c55e' }}>
      <rect width="56" height="56" rx="12" fill="#22c55e" />
      <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="1.1rem" fill="#fff" fontWeight="bold">{feedbackDate}</text>
    </svg>
  );
}

function formatDate(dateStr: string): string {
  // Accepts '2024-07-21' or similar
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }
  // fallback: try to parse as 'July 21st' etc.
  return dateStr;
}

export default function InsightsPage() {
  const [items, setItems] = useState<InsightType[]>([]);
  // Store Firestore docId for each insight
  type InsightWithDocId = InsightType & { docId: string };
  const [insightItems, setInsightItems] = useState<InsightWithDocId[]>([]);
  const [routeColors, setRouteColors] = useState<Record<string, string>>({});
  const handleDelete = async (docId: string) => {
    await deleteDoc(doc(db, 'town-milton/insights/insight-collection', docId));
    setInsightItems(items => items.filter(i => i.docId !== docId));
  };
  const router = useRouter();
  React.useEffect(() => {
    async function fetchData() {
      // Fetch from Firestore
      const snapshot = await getDocs(collection(db, 'town-milton/insights/insight-collection'));
      const insights: InsightWithDocId[] = snapshot.docs.map((docSnap, idx) => {
        const data = docSnap.data();
        let idNum = parseInt(docSnap.id, 10);
        if (isNaN(idNum)) idNum = Date.now() + idx;
        return {
          id: idNum,
          title: data.title || '',
          subtitle: data.subtitle || '',
          date: data.date || '',
          time: data.time || '',
          insight: data.insight || {},
          docId: docSnap.id,
        };
      });
      setInsightItems(insights);
      const colors = await getRouteColors();
      setRouteColors(colors);
    }
    fetchData();
  }, []);
  return (
    <>
      <Head>
        <title>Insights</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        <Sidebar selected="insights" />
        <main className="flex-1 flex flex-col p-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-2xl font-bold text-[#2d2363]">Insights</h2>
              <button
                className="cursor-pointer flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 text-white font-semibold shadow hover:brightness-105 transition-all min-w-[220px] text-base animated-gradient"
                style={{ maxWidth: '100%', width: 'fit-content' }}
                onClick={() => router.push('/dashboard/insights/new-chat')}
              >
                <HiOutlinePlus className="text-xl" />
                <span>New Analysis</span>
              </button>
            </div>
            {insightItems.length === 0 ? (
              <div className="text-center text-[#7c88a1] text-base py-12">No insights found. Time to analyse your data!</div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insightItems.map(item => (
                  <li key={item.id} className="flex flex-col items-center bg-[#f7f8fa] rounded-lg p-3 shadow-sm border text-xs min-h-[120px] relative">
                    <div className="mb-2">
                      <InsightCover title={typeof item.title === 'string' ? item.title : ''} routeColors={routeColors} />
                    </div>
                    <div className="font-semibold text-[#22223b] text-base text-center mb-0.5 truncate w-full">{item.title}</div>
                    {item.subtitle && (
                      <div className="text-[#7c88a1] text-xs text-center mb-2 w-full">{item.subtitle}</div>
                    )}
                    <div className="flex items-center justify-between w-full mt-auto gap-2">
                      <span className="text-[#7c88a1] text-[10px]">{formatDate(item.date)} {item.time}</span>
                      <div className="flex gap-2 ml-auto">
                        <button
                          className="p-1 rounded-full border border-blue-500 text-blue-500 text-xs transition hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-md"
                          title="Open"
                          onClick={() => {
                            let insightDataId = item.insight && item.insight.data && (Array.isArray(item.insight.data) ? item.insight.data[0]?.id : item.insight.data.id);
                            router.push(`/dashboard/insights/open-chat?id=${insightDataId ?? item.id}`);
                          }}
                        >
                          Open
                        </button>
                        <button
                          className="p-1 rounded-full border border-green-500 text-green-500 text-xs transition hover:bg-green-500 hover:text-white hover:scale-105 hover:shadow-md"
                          title="Resolved"
                          onClick={() => handleDelete(item.docId)}
                        >
                          Resolved
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
} 