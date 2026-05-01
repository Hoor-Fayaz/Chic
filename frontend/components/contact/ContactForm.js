"use client";

import { useState } from 'react';
import { useToastStore } from "@/store/toastStore";
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

export default function ContactForm({ contactPhone = '923141988998' }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send to Backend API
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
         throw new Error('Failed to send message');
      }

      showToast('Message sent successfully!', 'success');

      // 2. Redirect to WhatsApp with dynamic phone number
      const waMessage = `Hello Jannah,\n\nMy name is ${formData.name} (${formData.email}).\n\n${formData.message}`;
      const waUrl = `https://wa.me/${contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`;
      
      window.open(waUrl, '_blank');

      // Reset form
      setFormData({ name: '', email: '', message: '' });

    } catch (error) {
      console.error('Contact submit error:', error);
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">Typically responds within 2 hours</p>
      
      <div className="space-y-4">
        <input 
          placeholder="Full Name" 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full bg-white border border-gray-200 p-4 text-[13px] font-medium outline-none focus:border-black transition-colors" 
        />
        <input 
          placeholder="Email Address" 
          type="email" 
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full bg-white border border-gray-200 p-4 text-[13px] font-medium outline-none focus:border-black transition-colors" 
        />
        <textarea 
          placeholder="How can we help?" 
          rows="5" 
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          className="w-full bg-white border border-gray-200 p-4 text-[13px] font-medium outline-none focus:border-black transition-colors resize-none" 
        />
      </div>
      
      <button 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Dispatch Message'}
      </button>
    </form>
  );
}
