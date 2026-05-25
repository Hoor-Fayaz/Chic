import { fetchPage } from "@/lib/cms";
export const revalidate = 60;
import { fetchPublicSettings } from "@/lib/api";
import PageContent from "@/components/ui/PageContent";
import { ArrowRight } from "lucide-react";

export async function generateMetadata() {
  try {
    const res = await fetchPage("returns");
    const page = res?.data;
    return {
      title: `${page?.title || "Refund Policy"} | Jannah Chic`,
      description: page?.content?.substring(0, 160) || "Returns and exchanges policy for Jannah Chic.",
    };
  } catch (e) {
    return { title: "Refund Policy | Jannah Chic" };
  }
}

export default async function ReturnsPage() {
  let page = null;
  let settings = null;

  try {
    const [res, settingsRes] = await Promise.all([
      fetchPage("returns"),
      fetchPublicSettings(),
    ]);
    page = res?.data;
    settings = settingsRes?.data;
  } catch (e) {
    console.error("❌ Failed to load Returns page data:", e.message);
  }

  const contactPhone = settings?.contactPhone || "923141988998";
  const formattedPhone = contactPhone.replace(/\D/g, "");

  return (
    <div className="space-y-16 pb-20 max-w-2xl animate-in fade-in duration-1000">
      {/* Intro */}
      <section className="space-y-6">
        <h2 className="text-3xl font-display font-medium text-gray-900 tracking-tight leading-tight">
          {page?.title || "Effortless Returns & Exchanges"}
        </h2>
        <PageContent content={page?.content} />
      </section>

      {/* Policy Details (Combined with dynamic content or kept static for layout) */}
      <div className="space-y-10 border-t border-gray-200 pt-16">
        <h3 className="text-xl font-display font-medium text-gray-900">Core Policy Rules</h3>
        <ul className="space-y-4">
          {[
            "Items must be returned within 7 days of delivery.",
            "Custom-stitched or tailored pieces are final sale.",
            "Exchanges are subject to stock availability.",
            "Sale items can only be exchanged for size, not for refund.",
            "Shipping charges are non-refundable unless item was faulty.",
            "Refunds are processed as Store Credit or via Original Method."
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-4 text-[14px] text-gray-500">
              <span className="text-gray-300 mt-1">—</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Help Banner */}
      <div className="border-t border-gray-900 pt-12 flex flex-col md:flex-row items-baseline justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-bold text-gray-900">Have more questions?</h3>
          <p className="text-gray-500 text-[14px]">Our concierge team is here to assist with sizing and style advice.</p>
        </div>
        <a 
          href={`https://wa.me/${formattedPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] font-bold uppercase border-b border-black pb-1 tracking-[0.2em] hover:text-gray-500 hover:border-gray-500 transition-colors shrink-0"
        >
          Speak to an Expert <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
