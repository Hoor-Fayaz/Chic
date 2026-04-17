"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState("0-0");

  const toggle = (id) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="space-y-16">
      {faqs.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-6 pt-12 border-t border-gray-200">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">{group.category}</h3>
          <div className="border-t border-gray-200">
            {group.items.map((item, itemIndex) => {
              const id = `${groupIndex}-${itemIndex}`;
              const isOpen = openIndex === id;
              return (
                <div 
                  key={itemIndex} 
                  className="border-b border-gray-200 group transition-all duration-300"
                >
                  <button 
                    onClick={() => toggle(id)}
                    className="w-full flex items-center justify-between py-6 text-left outline-none"
                  >
                    <span className={`text-[15px] font-medium tracking-tight transition-colors ${isOpen ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`}>
                      {item.q}
                    </span>
                    <div className="shrink-0 text-gray-400 group-hover:text-black transition-colors ml-4">
                      {isOpen ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[300px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <div className="text-[14px] text-gray-600 leading-relaxed max-w-2xl pr-8">
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
