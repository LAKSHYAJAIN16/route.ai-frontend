"use client";
import React, { useState, useRef, useEffect } from "react";
import Sidebar from '../../../../components/Sidebar';
import { HiCheckCircle } from 'react-icons/hi';
import { FeedbackType, addInsight } from '../../../dashboard/data';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'next/navigation';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

// Helper to parse GPT output into structured insights
function parseInsights(text: string) {
  const regex = /\[(positive|negative)\]\[(.*?)\]\[(.*?)\]\[(.*?)\]\[(.*?)\]/gs;
  const matches = [...text.matchAll(regex)];
  return matches.map(m => ({
    sentiment: m[1],
    title: m[2],
    content: m[3],
    recommendation: m[4],
    data: (() => { try { return JSON.parse(m[5]); } catch { return m[5]; } })(),
  }));
}

export default function FeedbackChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [displayedData, setDisplayedData] = useState<FeedbackType[] | null>(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [dismissedInsights, setDismissedInsights] = useState<{[key: string]: boolean}>({});
  const [savedInsights, setSavedInsights] = useState<{[key: string]: boolean}>({});
  const [dataError, setDataError] = useState<string | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // On mount, parse data from URL and start chat
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = decodeURIComponent(dataParam);
        const data = JSON.parse(decoded);
        if (Array.isArray(data) && data.length > 0) {
          setDisplayedData(null);
          setDataError(null);
          setChatVisible(true);
          // Always start with 'Selected: Feedback' and keep it forever
          setMessages([
            { sender: 'user', text: 'Selected: Feedback' } as Message,
            { sender: 'user', text: 'Auto-selecting filtered feedback items' } as Message
          ]);
          setTimeout(() => {
            setMessages(msgs => [
              ...msgs,
              { sender: 'user', text: 'uploading-data' } as Message
            ]);
            setTimeout(() => {
              setDisplayedData(data);
              // When generating insights, always prepend 'Selected: Feedback' if not present
              sendToGPT(data, msgs => {
                if (!msgs.find(m => m.text === 'Selected: Feedback')) {
                  return ([{ sender: 'user', text: 'Selected: Feedback' } as Message, ...msgs]);
                }
                return msgs;
              });
            }, 1200);
          }, 700);
        } else {
          setDataError('No data provided.');
        }
      } catch (e) {
        setDataError('Invalid data format.');
      }
    } else {
      setDataError('No data provided.');
    }
    // eslint-disable-next-line
  }, []);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput("");
    await getAIResponse([...messages, userMsg]);
  };

  async function getAIResponse(chatHistory: Message[]) {
    setMessages(msgs => [
      ...msgs,
      { sender: 'ai', text: '__ai_loading__' } as Message
    ]);
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      console.log(openai);
      const openaiMessages = chatHistory.map(m => ({
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
        { sender: 'ai', text: aiText } as Message
      ]);
    } catch (e) {
      setMessages(msgs => [
        ...msgs.filter(m => m.text !== '__ai_loading__'),
        { sender: 'ai', text: 'Error contacting GPT-4 API.' } as Message
      ]);
    }
  }

  // Patch sendToGPT to accept a message adjuster
  async function sendToGPT(data: FeedbackType[], adjustMessages?: (msgs: Message[]) => Message[]) {
    if (!data || data.length === 0) return;
    setInsightsLoading(true);
    setMessages(msgs => {
      let newMsgs = [...msgs, { sender: 'ai', text: '__initial_loading__' } as Message];
      if (adjustMessages) newMsgs = adjustMessages(newMsgs);
      return newMsgs;
    });
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: "You are route.ai. Analyse data, generate significant insights. Format must be [positive or negative][insight title][insight content][insight reccomendation][data points that led to the insight, identical format as the data, if muultiple include all]. Here is that data : " + JSON.stringify(data) }
        ],
        max_tokens: 1000,
      });
      const aiText = completion.choices?.[0]?.message?.content || 'No response.';
      const insights = parseInsights(aiText);
      setMessages(msgs => {
        // Remove only loading/response placeholders, but always keep 'Selected: Feedback'
        let filtered = msgs.filter(m => m.text !== 'Generating response ...' && m.text !== '__initial_loading__' && m.text !== '__loading__');
        if (!filtered.find(m => m.text === 'Selected: Feedback')) {
          filtered = ([{ sender: 'user', text: 'Selected: Feedback' } as Message, ...filtered]);
        }
        return filtered;
      });
      insights.forEach((insight, idx) => {
        setTimeout(() => {
          setMessages(msgs => {
            let newMsgs = [...msgs, { sender: 'ai', text: `__loading_${idx}__` } as Message];
            if (!newMsgs.find(m => m.text === 'Selected: Feedback')) {
              newMsgs = ([{ sender: 'user', text: 'Selected: Feedback' } as Message, ...newMsgs]);
            }
            return newMsgs;
          });
          setTimeout(() => {
            setMessages(msgs => {
              let newMsgs = [...msgs.filter(m => m.text !== `__loading_${idx}__`), { sender: 'ai', text: `[${insight.sentiment}][${insight.title}][${insight.content}][${insight.recommendation}][${JSON.stringify(insight.data)}]` } as Message];
              if (!newMsgs.find(m => m.text === 'Selected: Feedback')) {
                newMsgs = ([{ sender: 'user', text: 'Selected: Feedback' } as Message, ...newMsgs]);
              }
              return newMsgs;
            });
            if (idx === insights.length - 1) {
              setInsightsLoading(false);
            }
          }, 900);
        }, idx * 1100);
      });
    } catch (e) {
      setMessages(msgs => {
        let newMsgs = [...msgs.filter(m => m.text !== 'Analysing data...'), { sender: 'ai', text: 'Error contacting GPT-4 API.' } as Message];
        if (!newMsgs.find(m => m.text === 'Selected: Feedback')) {
          newMsgs = ([{ sender: 'user', text: 'Selected: Feedback' } as Message, ...newMsgs]);
        }
        return newMsgs;
      });
      setInsightsLoading(false);
    }
  }

  function isAIThinking() {
    if (insightsLoading) return true;
    if (messages.length === 0) return false;
    const lastMsg = messages[messages.length - 1];
    return lastMsg.sender === 'ai' && (lastMsg.text === '__ai_loading__' || lastMsg.text === '__initial_loading__' || /^__loading(_\d+)?__$/.test(lastMsg.text));
  }

  return (
    <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
      <Sidebar selected="insights" />
      <main className="flex-1 flex flex-col p-8">
        <div className="flex items-center mb-6 gap-4">
           <a href="/dashboard/feedback" style={{ textDecoration: 'none' }}>
             <button
                className="bg-red-500 text-white text-xs font-semibold rounded-full py-1 px-4 hover:bg-red-600 transition-colors"
                type="button"
             >
                <span className="mr-1">&#8592;</span>Back
             </button>
           </a>
           <h2 className="text-2xl font-bold text-[#2d2363] m-0">Insights from Feedback</h2>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto bg-white rounded-xl p-6 shadow-sm border flex flex-col gap-4 mb-4" style={{ minHeight: 400, position: 'relative' }}>
          {dataError && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
              <div className="bg-white border border-red-400 text-red-700 px-6 py-4 rounded-xl text-sm font-semibold shadow-lg flex flex-col items-center min-w-[220px] max-w-xs relative">
                <button className="absolute top-2 right-2 text-lg text-gray-400 hover:text-gray-700" onClick={() => setDataError(null)}>&times;</button>
                <div className="text-red-700 text-center">{dataError}</div>
              </div>
            </div>
          )}
          {chatVisible && (
          <>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'user' && (msg.text.startsWith('Selected:') || msg.text === 'Auto-selecting filtered feedback items' || msg.text === 'Auto-selecting active feedback items') ? (
                <div className="max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md border border-blue-500 bg-white text-blue-700 flex items-center gap-2">
                  <HiCheckCircle className="text-blue-500 text-lg" />
                  <span className="font-semibold">{msg.text}</span>
                </div>
              ) : msg.sender === 'user' && msg.text === 'uploading-data' ? (
                <div className="max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md border border-blue-400 bg-white text-blue-700 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-semibold">{displayedData ? 'Uploaded data' : 'Uploading data'}</span>
                    {!displayedData && <>
                      <span className="inline-block animate-bounce">.</span>
                      <span className="inline-block animate-bounce delay-100">.</span>
                      <span className="inline-block animate-bounce delay-200">.</span>
                    </>}
                  </div>
                  {displayedData && (
                    <button
                      className="mt-0 w-full px-0 py-2 rounded-md bg-[#e5e7eb] text-[#22223b] font-semibold hover:bg-[#f3f4f6] transition text-xs shadow border border-[#e5e7eb]"
                      onClick={() => setShowDataModal(true)}
                    >
                      View Data
                    </button>
                  )}
                </div>
              ) : msg.sender === 'ai' && msg.text === '__initial_loading__' ? (
                <div className="max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm bg-gray-100 text-[#22223b] flex items-center gap-2">
                  <span className="inline-block animate-bounce">.</span>
                  <span className="inline-block animate-bounce delay-100">.</span>
                  <span className="inline-block animate-bounce delay-200">.</span>
                  <span className="ml-2 text-xs text-[#7c88a1]">Generating insights (may take a while, AI is hard at work)...</span>
                </div>
              ) : msg.sender === 'ai' && msg.text === '__ai_loading__' ? (
                <div className="max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm bg-gray-100 text-[#22223b] flex items-center gap-2">
                  <span className="inline-block animate-bounce">.</span>
                  <span className="inline-block animate-bounce delay-100">.</span>
                  <span className="inline-block animate-bounce delay-200">.</span>
                  <span className="ml-2 text-xs text-[#7c88a1]">Route.ai is thinking...</span>
                </div>
              ) : msg.sender === 'ai' && /^__loading(_\d+)?__$/.test(msg.text) ? (
                <div className="max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm bg-gray-100 text-[#22223b] flex items-center gap-2">
                  <span className="inline-block animate-bounce">.</span>
                  <span className="inline-block animate-bounce delay-100">.</span>
                  <span className="inline-block animate-bounce delay-200">.</span>
                  <span className="ml-2 text-xs text-[#7c88a1]">Generating insight...</span>
                </div>
              ) : msg.sender === 'ai' && /\[(positive|negative)\]\[/.test(msg.text) ? (
                <div className="flex flex-col gap-4 w-full max-w-[70%]">
                  {parseInsights(msg.text).map((insight, idx) => {
                    const insightKey = `${i}-${idx}`;
                    if (dismissedInsights[insightKey]) return null;
                    return (
                      <div key={insightKey} className={`rounded-xl shadow border p-4 flex flex-col gap-2 ${insight.sentiment === 'positive' ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-base ${insight.sentiment === 'positive' ? 'text-green-700' : 'text-red-700'}`}>{insight.sentiment === 'positive' ? 'Positive' : 'Negative'}</span>
                          <span className="font-semibold text-[#2d2363] text-base">{insight.title}</span>
                        </div>
                        <div className="text-sm text-[#22223b] whitespace-pre-line">{insight.content}</div>
                        <div className="text-xs text-[#2d2363] font-semibold">Recommendation:</div>
                        <div className="text-xs text-[#22223b] mb-2">{insight.recommendation}</div>
                        <div className="text-xs text-[#2d2363] font-semibold mt-2">Data Points:</div>
                        {(() => {
                          let tableData = null;
                          if (Array.isArray(insight.data)) {
                            tableData = insight.data;
                          } else if (insight.data && typeof insight.data === 'object') {
                            tableData = [insight.data];
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
                        })()}
                        <div className="flex gap-2 mt-2 self-end">
                          <button
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${savedInsights[insightKey] ? 'bg-green-500 text-white border-green-500 cursor-default' : 'bg-white text-green-700 border-green-400 hover:bg-green-50'}`}
                            disabled={!!savedInsights[insightKey]}
                            onClick={async () => {
                              setSavedInsights(s => ({ ...s, [insightKey]: true }));
                              const now = new Date();
                              let route = '';
                              if (Array.isArray(insight.data) && insight.data.length > 0 && insight.data[0].route) {
                                route = insight.data[0].route;
                              } else if (insight.data && typeof insight.data === 'object' && insight.data.route) {
                                route = insight.data.route;
                              }
                              const titleWithRoute = route ? `${insight.title} (Route ${route})` : insight.title;
                              await addInsight({
                                title: titleWithRoute,
                                subtitle: insight.recommendation,
                                date: now.toISOString().slice(0, 10),
                                time: now.toTimeString().slice(0, 5),
                                insight: {
                                  sentiment: insight.sentiment,
                                  title: insight.title,
                                  content: insight.content,
                                  recommendation: insight.recommendation,
                                  data: insight.data
                                }
                              });
                              setTimeout(() => {
                                setSavedInsights(s => ({ ...s, [insightKey]: false }));
                                setDismissedInsights(s => ({ ...s, [insightKey]: true }));
                              }, 1000);
                            }}
                          >
                            {savedInsights[insightKey] ? 'Insight saved!' : 'Save'}
                          </button>
                          {!savedInsights[insightKey] && (
                          <button
                            className="px-3 py-1 rounded-full text-xs font-semibold border bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                            onClick={() => setDismissedInsights(s => ({ ...s, [insightKey]: true }))}
                          >
                            Dismiss
                          </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : msg.sender === 'ai' ? (
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm bg-gray-100 text-[#22223b]`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-white border border-blue-100 text-blue-700' : 'bg-gray-100 text-[#22223b]'}`}>{msg.text}</div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
          {/* Show chat input form after insights are generated */}
          {!isAIThinking() && messages.length > 0 && (
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                placeholder="Ask AI about your data....."
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
          </>
          )}
        </div>
        {/* Data preview modal */}
        {showDataModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative">
              <button className="absolute top-3 right-3 text-lg text-gray-400 hover:text-gray-700" onClick={() => setShowDataModal(false)}>&times;</button>
              <div className="text-lg font-bold text-[#2d2363] mb-3">Data Preview</div>
              {displayedData && displayedData.length === 0 ? (
                <div className="text-gray-400 text-sm">No data to display.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-black">
                    <thead>
                      <tr className="text-black text-left border-b">
                        <th className="py-2 px-2 font-semibold">Date</th>
                        <th className="py-2 px-2 font-semibold">Time</th>
                        <th className="py-2 px-2 font-semibold">Route</th>
                        <th className="py-2 px-2 font-semibold">Remarks</th>
                        <th className="py-2 px-2 font-semibold">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedData?.map((f, i) => (
                        <tr key={i} className="border-b last:border-0 text-black">
                          <td className="py-1 px-2 text-black">{f.date}</td>
                          <td className="py-1 px-2 text-black">{f.time}</td>
                          <td className="py-1 px-2 text-black">{f.route}</td>
                          <td className="py-1 px-2 text-black">{f.remarks}</td>
                          <td className="py-1 px-2 text-black">{f.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 