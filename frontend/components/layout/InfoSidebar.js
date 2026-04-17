"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, Truck, RefreshCw, MessageCircle, Info, FileText, ShieldCheck, Briefcase } from "lucide-react";

const links = [
  { group: "Help", items: [
    { label: "Shipping Info", href: "/shipping", icon: MessageCircle },
    { label: "Returns & Exchanges", href: "/returns", icon: RefreshCw },
    { label: "FAQs", href: "/faqs", icon: HelpCircle },
    { label: "Contact Us", href: "/contact", icon: Info },
  ]},
  { group: "Company", items: [
    { label: "About Us", href: "/about", icon: Info },
    { label: "Terms & Conditions", href: "/terms", icon: FileText },
    { label: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
    { label: "Careers", href: "/careers", icon: Briefcase },
  ]}
];

export default function InfoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <div className="flex lg:flex-col gap-8 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
        {links.map((group) => (
          <div key={group.group} className="shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 pl-1 hidden lg:block">
              {group.group}
            </p>
            <ul className="flex lg:flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon size={14} className={isActive ? "text-white" : "text-gray-400"} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
