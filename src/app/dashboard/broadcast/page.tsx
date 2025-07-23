"use client";
import React, { useState } from "react";
import Sidebar from '../../../components/Sidebar';
import Head from "next/head";

export default function BroadcastPage() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [selectedDriver, setSelectedDriver] = useState("12");
  // driverType is now just 'type', used for both recipient types
  const [type, setType] = useState("information");
  const [sentMessages, setSentMessages] = useState<{ recipient: string; message: string; driver?: string; type?: string }[]>([]);
  const [sending, setSending] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSentMessages(msgs => [
        { recipient, message, driver: recipient === 'driver' ? selectedDriver : undefined, type },
        ...msgs
      ]);
      setMessage("");
      setSending(false);
    }, 600);
  };

  return (
    <>
      <Head>
        <title>Broadcast</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[#f7f8fa] flex font-sans min-h-screen">
        <Sidebar selected="broadcast" />
        <main className="flex-1 flex flex-col p-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border flex flex-col gap-6">
            <div className="flex items-center mb-2 gap-4">
              <h2 className="text-2xl font-bold text-[#2d2363] m-0">Broadcast Message</h2>
            </div>
            <form onSubmit={handleSend} className="flex flex-col gap-4 max-w-xl">
              <div className="flex gap-4 items-center">
                <label className="font-semibold text-sm text-[#2d2363]">Recipient</label>
                <select
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  value={recipient}
                  onChange={e => { setRecipient(e.target.value); setType("information"); }}
                  disabled={sending}
                >
                  <option value="driver">Driver</option>
                  <option value="all">All users</option>
                </select>
                {recipient === 'driver' && (
                  <select
                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    value={selectedDriver}
                    onChange={e => setSelectedDriver(e.target.value)}
                    disabled={sending}
                  >
                    <option value="12">Route 12</option>
                    <option value="13">Route 13</option>
                    <option value="14">Route 14</option>
                    <option value="15">Route 15</option>
                  </select>
                )}
              </div>
              {/* Type dropdown for both recipient types */}
              {(recipient === 'driver' || recipient === 'all') && (
                <select
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  value={type}
                  onChange={e => setType(e.target.value)}
                  disabled={sending}
                >
                  {recipient === 'driver' ? (
                    <>
                      <option value="information">Information</option>
                      <option value="compliment">Positive</option>
                      <option value="order">Negative</option>
                    </>
                  ) : (
                    <>
                      <option value="information">Information</option>
                      <option value="route-update">Route update</option>
                    </>
                  )}
                </select>
              )}
              <textarea
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black min-h-[80px] resize-none"
                placeholder="Type your broadcast message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold hover:from-blue-600 hover:to-pink-600 transition text-sm shadow-md self-end"
                disabled={sending || !message.trim()}
                style={{ backgroundSize: '200% 200%', animation: 'gradientMove 2s linear infinite' }}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
            <div className="mt-8 max-w-xl">
              <h3 className="text-lg font-semibold text-[#2d2363] mb-2">Updates sent</h3>
              {sentMessages.length === 0 ? (
                <div className="text-gray-400 text-sm">No updates sent yet.</div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {sentMessages.map((msgObj, i) => (
                    <li key={i} className="bg-white border rounded-lg px-4 py-2 text-sm text-[#22223b] shadow-sm">
                      <span className="font-semibold text-[#5f4bb6] mr-2">
                        [{msgObj.recipient === 'all' ? 'All users' : `Driver${msgObj.driver ? ' (Route ' + msgObj.driver + ')' : ''}${msgObj.type ? ', ' + (msgObj.type === 'compliment' ? 'Positive' : msgObj.type === 'order' ? 'Negative' : msgObj.type === 'route-update' ? 'Route update' : msgObj.type.charAt(0).toUpperCase() + msgObj.type.slice(1)) : ''}` }]
                      </span>
                      {msgObj.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 