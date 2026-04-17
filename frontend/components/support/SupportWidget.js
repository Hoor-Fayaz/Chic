"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { fetchPublicSettings } from "@/lib/api";

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const endOfMessagesRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [contactPhone, setContactPhone] = useState('923141988998');

  useEffect(() => {
    fetchPublicSettings()
      .then(res => { if (res?.data?.contactPhone) setContactPhone(res.data.contactPhone); })
      .catch(() => {});
  }, []);

  // Initial messages state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello! Welcome to Jannah Chic. How can we help you today?",
      options: [
        { id: "exchange", label: "Exchange Policy" },
        { id: "shipping", label: "Shipping Info" },
        { id: "agent", label: "Talk to an Agent" },
      ]
    }
  ]);

  // Auto scroll to bottom
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, open]);

  const simulateBotResponse = (userText, optionId = null) => {
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "Thanks for reaching out! For detailed assistance, I recommend speaking directly with our team on WhatsApp.";
      let showWhatsApp = true;
      if (optionId === "exchange") {
        replyText = "We offer a 7-day exchange policy for unwashed and unworn items with original tags. At this time, we do not offer refunds.";
        showWhatsApp = false;
      } else if (optionId === "shipping") {
        replyText = "Standard delivery typically takes 3-5 business days across the country. Fast shipping is available in select areas.";
        showWhatsApp = false;
      } else if (optionId === "agent") {
        replyText = "I'll connect you right away! Click the button below to chat with a live agent on WhatsApp.";
        showWhatsApp = true;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: replyText,
          isWhatsAppBtn: showWhatsApp
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleSend = (text, optionId = null) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: "user", text }
    ]);
    setInputValue("");

    // Trigger bot response
    simulateBotResponse(text, optionId);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {/* Panel */}
      <div
        className={`transition-all duration-500 ease-in-out origin-bottom-right ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
      >
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-black/15 border border-gray-100 w-80 md:w-[360px] flex flex-col overflow-hidden" style={{ height: '500px', maxHeight: '80vh' }}>

          {/* Header */}
          <div className="bg-gray-900 px-6 py-5 text-white shrink-0">
            <h3 className="text-lg font-display font-bold">Jannah Chic Support</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[11px] text-gray-400 font-medium">Chatbot is online</span>
            </div>
          </div>

          {/* Chat Flow Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-gray-900' : 'bg-gray-200'}`}>
                    {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-gray-600" />}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className={`p-3 text-[13px] leading-relaxed break-words ${msg.sender === 'user' ? 'bg-gray-900 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm'}`}>
                      {msg.text}
                    </div>

                    {/* Render Options if any */}
                    {msg.options && (
                      <div className="flex flex-col gap-2 mt-1">
                        {msg.options.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => handleSend(opt.label, opt.id)}
                            className="text-[12px] bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-full text-left hover:bg-gray-50 hover:border-black transition-colors shadow-sm"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Render WhatsApp Button if flagged */}
                    {msg.isWhatsAppBtn && (
                      <a
                        href={`https://wa.me/${contactPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-green-500 text-white text-[12px] font-bold py-2.5 px-5 rounded-full hover:bg-green-600 transition-colors shadow-md mt-1 w-fit"
                      >
                        <MessageCircle size={14} />
                        Connect on WhatsApp
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center">
                  <Bot size={14} className="text-gray-600" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm p-4 flex items-center justify-center gap-1 w-fit">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-50 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              className="flex-1 bg-gray-100/50 border border-gray-100 rounded-full px-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all min-w-0"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
            >
              <Send size={16} className="mr-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle Chatbot"
        className={`relative w-14 h-14 rounded-full shadow-2xl shadow-black/25 flex items-center justify-center transition-all duration-300 ${open ? "bg-gray-900 rotate-0" : "bg-gray-900 hover:scale-110"
          }`}
      >
        <span
          className={`absolute transition-all duration-300 ${open ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
            }`}
        >
          <X size={20} className="text-white" />
        </span>
        <span
          className={`absolute transition-all duration-300 ${open ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
            }`}
        >
          <MessageCircle size={20} className="text-white" />
        </span>

        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-gray-900 opacity-20" />
        )}
      </button>
    </div>
  );
}
