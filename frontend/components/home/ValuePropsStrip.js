"use client";

import { Truck, BadgeCheck, RefreshCcw, MessageCircle } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Fast Dispatch",
    desc: "Tracked delivery nationwide",
  },
  {
    icon: BadgeCheck,
    title: "Premium Quality",
    desc: "Curated textiles & tailoring",
  },
  {
    icon: RefreshCcw,
    title: "Easy Exchange",
    desc: "7-day exchange policy",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    desc: "Concierge-style assistance",
  },
];

export default function ValuePropsStrip() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-12">
        <div className="grid grid-cols-2 gap-3 rounded-[2rem] border border-gray-100 bg-gray-50/60 p-5 sm:grid-cols-4 sm:gap-4 sm:p-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                  <Icon size={18} className="text-gray-900" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[12px] font-medium text-gray-500 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

