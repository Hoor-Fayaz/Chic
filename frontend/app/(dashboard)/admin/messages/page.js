"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from "@/store/toastStore";
import { Mail, Check, Inbox } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      showToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status })
      });
      
      const data = await res.json();
      if (data.success) {
        showToast(`Message marked as ${status}`, 'success');
        fetchMessages();
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col justify-between items-start mb-8 gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-blue-500 font-bold mb-3">Communications</p>
          <h1 className="text-5xl font-display tracking-tight text-gray-900 mb-4 flex items-center gap-4">
             Messages
          </h1>
          <p className="text-sm text-gray-400 italic max-w-lg">View and manage incoming contact requests</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 font-display">Loading messages...</div>
        ) : messages?.length === 0 ? (
          <div className="p-24 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
             </div>
             <p className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-2">No Messages Found</p>
             <p className="text-xs text-gray-400 max-w-xs mx-auto">You have not received any contact messages yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-1/3">Message</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg._id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${msg.status === 'new' ? 'bg-blue-50/10' : ''}`}>
                    <td className="p-6 text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-bold text-gray-900">{msg.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{msg.email}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-xs text-gray-600 line-clamp-2">{msg.message}</p>
                    </td>
                    <td className="p-6">
                       <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${
                          msg.status === 'new' ? 'bg-blue-100 text-blue-600' :
                          msg.status === 'read' ? 'bg-amber-100 text-amber-600' :
                          'bg-emerald-100 text-emerald-600'
                       }`}>
                         {msg.status}
                       </span>
                    </td>
                    <td className="p-6 text-right space-x-2">
                       {msg.status === 'new' && (
                         <button 
                           onClick={() => updateStatus(msg._id, 'read')}
                           className="px-3 py-1.5 bg-gray-100 text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors"
                         >
                           Mark Read
                         </button>
                       )}
                       {msg.status !== 'replied' && (
                         <button 
                           onClick={() => updateStatus(msg._id, 'replied')}
                           className="px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors"
                         >
                           Resolved
                         </button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
