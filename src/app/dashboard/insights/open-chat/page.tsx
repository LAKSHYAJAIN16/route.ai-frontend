"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from '../../../../components/Sidebar';
import { db } from '../../fire';
import { collection, getDocs } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { InsightType } from '../../data';
import { Suspense } from "react";

// Helper to render data table like in new-chat
function DataTable({ data }: { data: any }) {
  let tableData = null;
  if (Array.isArray(data)) {
    tableData = data;
  } else if (data && typeof data === 'object') {
    tableData = [data];
  }
  if (tableData && tableData.length > 0) {
    return (
      <div className="overflow-x-auto text-black">
        <table className="min-w-full text-[10px] border mt-2">
          <thead>
            <tr className="text-[#7c88a1] text-left border-b">
              {Object.keys(tableData[0]).map((k, i) => (
                <th key={i} className="py-1 px-2 font-semibold whitespace-nowrap">{k.charAt(0).toUpperCase() + k.slice(1)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row: any, i: number) => (
              <tr key={i} className="border-b last:border-0">
                {Object.values(row).map((v: any, j: number) => (
                  <td key={j} className="py-1 px-2 whitespace-nowrap">{String(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <div className="bg-gray-100 rounded p-2 text-xs text-[#22223b] mt-2">No structured data available.</div>;
  }
}

// Helper to render sentiment badge
function SentimentBadge({ sentiment }: { sentiment: string }) {
  const isPositive = sentiment === 'positive';
  return (
    <span className={`font-bold text-base px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-300'}`}>{isPositive ? 'Positive' : 'Negative'}</span>
  );
}

// Helper to render AI loading bubble
function AILoadingBubble() {
  return (
    <div className="max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm bg-gray-100 text-[#22223b] flex items-center gap-2">
      <span className="inline-block animate-bounce">.</span>
      <span className="inline-block animate-bounce delay-100">.</span>
      <span className="inline-block animate-bounce delay-200">.</span>
      <span className="ml-2 text-xs text-[#7c88a1]">Route.ai is thinking...</span>
    </div>
  );
}

function OpenChat() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [insight, setInsight] = useState<InsightType | undefined>(undefined);
  const [loading, setLoading] = useState(true); // <-- Add loading state
  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Start loading
      try {
        // Fetch all docs and find the one where insight.data.id === id
        const snapshot = await getDocs(collection(db, 'town-milton/insights/insight-collection'));
        const idNum = parseInt(id || '', 10);
        const found = snapshot.docs.find(doc => {
          const data = doc.data();
          return data.insight.data.id == idNum;
        });
        if (found) {
          console.log("found!");
          const data = found.data();
          let idNum = parseInt(found.id, 10);
          if (isNaN(idNum)) idNum = Date.now();
          setInsight({
            id: idNum,
            title: data.title || '',
            subtitle: data.subtitle || '',
            date: data.date || '',
            time: data.time || '',
            insight: data.insight || {},
          });
        } else {
          setInsight(undefined);
        }
      } finally {
        setLoading(false); // End loading
      }
    }
    fetchData();
  }, [id]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Add a special type for insight messages
  type ChatMessage = { sender: 'user' | 'ai'; text?: string; type?: 'insight'; insightObj?: any };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  // When insight loads, set as first message
  useEffect(() => {
    if (insight) {
      setMessages([
        { sender: 'ai', type: 'insight', insightObj: insight.insight }
      ]);
    }
  }, [insight]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    await getAIResponse([...messages, userMsg]);
  };

  async function getAIResponse(chatHistory: ChatMessage[]) {
    setMessages(msgs => [
      ...msgs,
      { sender: 'ai', text: '__ai_loading__' }
    ]);
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      const openaiMessages = chatHistory.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })) as Array<{ role: 'user' | 'assistant'; content: string }>;
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        max_tokens: 500,
      });
      const aiText = completion.choices?.[0]?.message?.content || 'No response.';
      setMessages(msgs => [
        ...msgs.filter(m => m.text !== '__ai_loading__'),
        { sender: 'ai', text: aiText }
      ]);
    } catch (e) {
      setMessages(msgs => [
        ...msgs.filter(m => m.text !== '__ai_loading__'),
        { sender: 'ai', text: 'Error contacting GPT-4 API.' }
      ]);
    }
  }

  // Helper to check if AI is thinking
  function isAIThinking() {
    if (messages.length === 0) return false;
    const lastMsg = messages[messages.length - 1];
    return lastMsg.sender === 'ai' && lastMsg.text === '__ai_loading__';
  }

  return (
    <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
      <Sidebar selected="insights" />
      <main className="flex-1 flex flex-col p-8">
        <div className="flex items-center mb-6 gap-4">
          <a href="/dashboard/insights" style={{ textDecoration: 'none' }}>
            <button
              className="bg-red-500 text-white text-xs font-semibold rounded-full py-1 px-4 hover:bg-red-600 transition-colors mb-2"
              type="button"
            >
              <span className="mr-1">&#8592;</span>Back
            </button>
          </a>
          <h2 className="text-2xl font-bold text-[#2d2363]">Insight Analysis</h2>
        </div>
        <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border flex flex-col mb-4 min-h-0" style={{ minHeight: 400, position: 'relative' }}>
          {/* Loader */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <div className="text-[#2d2363] text-lg font-semibold">Loading insight...</div>
            </div>
          ) : !insight ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-[#2d2363] text-lg font-semibold">Insight not found.</div>
            </div>
          ) : (
            // Chat messages */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0">
              {messages.map((msg, i: number) => {
                // Render insight card if type is 'insight'
                if (msg.type === 'insight' && msg.insightObj) {
                  const insightObj = msg.insightObj;
                  return (
                    <div key={i} className="flex justify-start">
                      <div className={`rounded-xl shadow border p-4 flex flex-col gap-2 ${insightObj.sentiment === 'positive' ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'} w-full max-w-[70%]`}>
                        <div className="flex items-center gap-2">
                          <SentimentBadge sentiment={insightObj.sentiment} />
                          <span className="font-semibold text-[#2d2363] text-base">{insightObj.title}</span>
                        </div>
                        <div className="text-sm text-[#22223b] whitespace-pre-line">{insightObj.content}</div>
                        <div className="text-xs text-[#2d2363] font-semibold">Recommendation:</div>
                        <div className="text-xs text-[#22223b] mb-2">{insightObj.recommendation}</div>
                        <div className="text-xs text-[#2d2363] font-semibold mt-2">Data Points:</div>
                        <DataTable data={insightObj.data} />
                      </div>
                    </div>
                  );
                }
                // AI loading bubble
                if (msg.sender === 'ai' && msg.text === '__ai_loading__') {
                  return (
                    <div key={i} className="flex justify-start">
                      <AILoadingBubble />
                    </div>
                  );
                }
                // Other messages
                return (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-white border border-blue-100 text-blue-700' : 'bg-gray-100 text-[#22223b]'}`}>
                      <ReactMarkdown>{msg.text || ''}</ReactMarkdown>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          )}
          {/* Chat input form anchored to bottom */}
          {!isAIThinking() && (
            <form onSubmit={sendMessage} className="flex gap-2 pt-4">
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Ask AI about this insight..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold hover:from-blue-600 hover:to-pink-600 transition text-sm shadow-md"
                style={{ backgroundSize: '200% 200%', animation: 'gradientMove 2s linear infinite' }}
              >
                Send
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function OpenChatPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OpenChat />
    </Suspense>
  );
} 